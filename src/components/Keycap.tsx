import { useEffect, useRef, useState } from 'react'
import {
  BufferGeometry,
  CanvasTexture,
  Group,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { livePalette } from '../background/livePalette'

// Size of one rendered pixel in CSS pixels
const PIXEL_SIZE = 2
// Color levels per channel after dithering
const COLOR_LEVELS = 10

// Keycap proportions (model units), after the HHKB Ursa profile, bottom row (where Z sits):
// widest at the flat base, near-vertical back, a convex curved front, and a dished top
// that tilts up slightly toward the front
const BASE = 1 // base width and depth
const HEIGHT = 0.58
const SKIRT = 0.06 // short vertical band at the base
const TOP_WIDTH = 0.7
const TOP_DEPTH = 0.62
const BACK_LEAN = 0.1 // how far the back wall leans in toward the top
const TOP_TILT = 0.04 // front edge of the top face is this much higher than the back
const DISH_DEPTH = 0.07 // deep spherical divot in the top face
const DISH_RADIUS = 0.82 // dish extent within the top face; the rest is a flat rim
const CORNER_SHARPNESS = 0.3 // lower is squarer corners
const EDGE_SHARPNESS = 0.05 // lower is a crisper top edge
const LEGEND = 'Z'

// Resting pose: three-quarter view, tipped slightly
const BASE_YAW = 0
const BASE_PITCH = 0.08
// Cursor following: max turn toward the cursor, how far away (in px) the cursor
// reaches that max, and how quickly the keycap catches up (higher is snappier)
const MAX_YAW = 0.6
const MAX_PITCH = 0.4
const FOLLOW_REACH = 500
const FOLLOW_SPEED = 9
const PRESS_DEPTH = 0.12

/** Ursa-profile keycap, reshaped from a superellipsoid so the corners stay rounded */
function createKeycapGeometry(): BufferGeometry {
  const sphere = new SphereGeometry(1, 128, 96)
  const position = sphere.attributes.position
  const backTop = -BASE / 2 + BACK_LEAN
  const frontTop = backTop + TOP_DEPTH

  for (let i = 0; i < position.count; i++) {
    const n = new Vector3().fromBufferAttribute(position, i)
    // Push the sphere out toward a box with rounded edges, coordinates in -1..1
    const box = new Vector3(
      Math.sign(n.x) * Math.abs(n.x) ** CORNER_SHARPNESS,
      Math.sign(n.y) * Math.abs(n.y) ** EDGE_SHARPNESS,
      Math.sign(n.z) * Math.abs(n.z) ** CORNER_SHARPNESS,
    )
    const height = (box.y + 1) / 2 // 0 at the base, 1 at the top
    // Vertical skirt at the base, then a convex wall: steep near the skirt, sweeping in toward the top
    const wall = Math.max(0, (height - SKIRT) / (1 - SKIRT))
    const curve = Math.sin((Math.PI / 2) * (1 - wall))

    const halfWidth = TOP_WIDTH / 2 + ((BASE - TOP_WIDTH) / 2) * curve
    const back = -BASE / 2 + BACK_LEAN * wall
    const front = frontTop + (BASE / 2 - frontTop) * curve
    const x = box.x * halfWidth
    const z = back + ((box.z + 1) / 2) * (front - back)

    // Flat base, tilted top, and a spherical dish inside a flat rim
    const onTop = Math.min(1, Math.max(0, (box.y - 0.9) / 0.09))
    // Squircle distance so the dish follows the top's rounded-square outline
    const r = (Math.abs(box.x) ** 4 + Math.abs(box.z) ** 4) ** 0.25 / DISH_RADIUS
    // Cosine falloff: deepest in the middle, easing smoothly into the flat rim
    const dish = r < 1 ? 0.5 + 0.5 * Math.cos(Math.PI * r) : 0
    const y = height * (HEIGHT + (TOP_TILT * (box.z + 1)) / 2) - DISH_DEPTH * dish * onTop

    position.setXYZ(i, x, y, z)
  }

  sphere.deleteAttribute('normal')
  sphere.deleteAttribute('uv')
  const geometry = mergeVertices(sphere)
  geometry.computeVertexNormals()
  // Center the top face on the origin so the legend lands in the middle of it
  geometry.translate(0, -HEIGHT / 2, -(backTop + frontTop) / 2)
  sphere.dispose()
  return geometry
}

/** "Z" in JetBrains Mono, used as an engraved legend on the top face */
async function createLegendTexture() {
  await document.fonts.load('700 100px "JetBrains Mono"')
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const context = canvas.getContext('2d')!
  context.fillStyle = '#fff'
  context.font = '700 200px "JetBrains Mono", monospace'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(LEGEND, 128, 142)
  // Thicken the strokes a little so the cut survives being rendered at a few dozen pixels
  context.strokeStyle = '#fff'
  context.lineWidth = 8
  context.lineJoin = 'round'
  context.strokeText(LEGEND, 128, 142)
  return new CanvasTexture(canvas)
}

/** Polished dark chrome reflecting a studio lit in the background's live palette */
const metalMaterial = new ShaderMaterial({
  uniforms: {
    uPalette: { value: [new Vector3(), new Vector3(), new Vector3(), new Vector3()] },
    uBack: { value: new Vector3() },
    uLegend: { value: null },
    uLegendHalf: { value: TOP_WIDTH * 0.34 },
  },
  vertexShader: /* glsl */ `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPos;
    varying vec3 vObjPos;
    varying vec3 vObjNormal;
    void main() {
      vObjPos = position;
      vObjNormal = normal;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uPalette[4];
    uniform vec3 uBack;
    uniform sampler2D uLegend;
    uniform float uLegendHalf;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPos;
    varying vec3 vObjPos;
    varying vec3 vObjNormal;

    // How far the engraving's shadow wall reaches, in legend UV units
    const vec2 LEGEND_DEPTH = vec2(-0.06, 0.09);
    // Width of the dark rim cut around the letter, in legend UV units
    const float LEGEND_RIM = 0.06;

    vec3 gradient(float f) {
      f = clamp(f, 0.0, 1.0) * 3.0;
      int i = int(min(floor(f), 2.0));
      return mix(uPalette[i], uPalette[i + 1], smoothstep(0.0, 1.0, f - float(i)));
    }

    // Environment: a dark room faintly tinted by the palette, lit by crisp softboxes.
    // Mirror chrome is mostly reflection, so hard-edged bright panels on a dark room
    // give the high-contrast polished look.
    // Studio for polished metal: a near-black room with a smooth palette sky, so every
    // surface shows a gradient, plus crisp bright strip lights for hard specular streaks
    vec3 environment(vec3 dir) {
      float azimuth = atan(dir.z, dir.x);

      // Sky: dark at the horizon, rising into the palette overhead
      vec3 sky = gradient(0.15 + 0.85 * smoothstep(-0.1, 0.9, dir.y)) * smoothstep(-0.2, 0.7, dir.y);
      vec3 color = mix(uBack * 0.5, sky * 0.9, smoothstep(-0.15, 0.1, dir.y));

      // Thin overhead strip light: a single bright streak across the top face
      float strip = smoothstep(0.06, 0.02, abs(azimuth + 1.9)) * smoothstep(0.55, 0.6, dir.y);
      color = mix(color, vec3(1.0) * 1.6, strip);

      // Ring of bright vertical panels around the horizon, caught by the flared sides
      float panels = smoothstep(0.75, 0.9, cos(azimuth * 4.0 + 0.6));
      float bandHigh = smoothstep(-0.05, 0.05, dir.y) * smoothstep(0.45, 0.35, dir.y);
      color = mix(color, mix(vec3(1.0), uPalette[1], 0.4) * 1.4, panels * bandHigh);

      // Floor bounce in a palette color, for the underside of the flare
      float floor = smoothstep(-0.2, -0.5, dir.y);
      color = mix(color, uPalette[2] * 0.6, floor * (0.5 + 0.5 * cos(azimuth * 2.0)));
      return color;
    }

    void main() {
      vec3 normal = normalize(vWorldNormal);
      vec3 view = normalize(cameraPosition - vWorldPos);
      vec3 reflected = reflect(-view, normal);

      vec3 color = environment(reflected);
      // Metal: reflections tinted slightly by the palette, brighter at grazing angles
      float fresnel = pow(1.0 - max(dot(normal, view), 0.0), 5.0);
      vec3 tint = mix(vec3(1.0), uPalette[1], 0.25);
      color = color * tint * (0.9 + 0.6 * fresnel);
      // Hard sun glint
      color += pow(max(dot(reflected, normalize(vec3(0.35, 0.85, 0.4))), 0.0), 400.0) * 4.0;

      // Engraved white legend: the letter is filled white, and its inner edge on the
      // far side is shaded where the cut wall would cast a shadow, so it reads as recessed
      if (vObjNormal.y > 0.6) {
        vec2 uv = vec2(vObjPos.x, -vObjPos.z) / (2.0 * uLegendHalf) + 0.5;
        float letter = texture2D(uLegend, uv).a;
        float wall = texture2D(uLegend, uv + LEGEND_DEPTH).a;
        float shadow = letter * (1.0 - wall);
        // Sample a ring of 8 offsets so the dark outline is even all the way around
        float around = 0.0;
        for (int i = 0; i < 8; i++) {
          float a = float(i) * 0.785398;
          around = max(around, texture2D(uLegend, uv + LEGEND_RIM * vec2(cos(a), sin(a))).a);
        }
        float rim = around * (1.0 - letter);
        color = mix(color, uBack * 0.2, rim);
        color = mix(color, vec3(1.0), letter);
        color = mix(color, uBack * 0.3, shadow * 0.9);
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `,
})

/** Converts to sRGB, quantizes with a 4×4 Bayer matrix, and cuts alpha to hard pixels */
const ditherMaterial = new ShaderMaterial({
  uniforms: { tScene: { value: null }, levels: { value: COLOR_LEVELS } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tScene;
    uniform float levels;
    varying vec2 vUv;

    float bayer4(vec2 p) {
      int x = int(mod(p.x, 4.0));
      int y = int(mod(p.y, 4.0));
      int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
      return (float(m[x + y * 4]) + 0.5) / 16.0;
    }

    vec3 linearToSrgb(vec3 c) {
      return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
    }

    void main() {
      vec4 texel = texture2D(tScene, vUv);
      float threshold = bayer4(gl_FragCoord.xy);
      if (step(threshold, texel.a) == 0.0) discard;

      vec3 color = linearToSrgb(clamp(texel.rgb / max(texel.a, 1e-4), 0.0, 1.0));
      color = floor(color * (levels - 1.0) + threshold) / (levels - 1.0);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  depthTest: false,
  depthWrite: false,
})

const srgbToLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)

function Keycap({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setPixelRatio(1)

    const scene = new Scene()
    const camera = new PerspectiveCamera(30, 1, 0.1, 100)
    // Looking down enough that the legend on the top face reads clearly
    camera.position.set(0, 1.7, 2.3)
    camera.lookAt(0, -0.05, 0)

    const geometry = createKeycapGeometry()
    const keycap = new Mesh(geometry, metalMaterial)
    const pivot = new Group()
    pivot.add(keycap)
    scene.add(pivot)

    // Low-res offscreen render, then the dither pass draws it to the canvas
    const target = new WebGLRenderTarget(1, 1, { minFilter: NearestFilter, magFilter: NearestFilter })
    ditherMaterial.uniforms.tScene.value = target.texture
    const postScene = new Scene()
    const postQuad = new Mesh(new PlaneGeometry(2, 2), ditherMaterial)
    postScene.add(postQuad)
    const postCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

    let disposed = false
    let legend: CanvasTexture | null = null
    createLegendTexture().then((texture) => {
      if (disposed) return texture.dispose()
      legend = texture
      metalMaterial.uniforms.uLegend.value = texture
      setReady(true)
      requestFrame()
    })

    const resize = () => {
      const width = Math.max(1, Math.round(canvas.clientWidth / PIXEL_SIZE))
      const height = Math.max(1, Math.round(canvas.clientHeight / PIXEL_SIZE))
      renderer.setSize(width, height, false)
      target.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      requestFrame()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    // Interaction: tilt toward the cursor; held down while the mouse button or Z key is held
    const tilt = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const press = { position: 0, velocity: 0, target: 0 }

    const setPressed = (pressed: boolean) => {
      press.target = pressed ? -PRESS_DEPTH : 0
      requestFrame()
    }
    const isZ = (event: KeyboardEvent) => event.key.toLowerCase() === 'z' && !event.metaKey && !event.ctrlKey
    const onKeyDown = (event: KeyboardEvent) => isZ(event) && !event.repeat && setPressed(true)
    const onKeyUp = (event: KeyboardEvent) => isZ(event) && setPressed(false)
    const onPointerDown = () => setPressed(true)
    const release = () => setPressed(false)
    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches) return
      const rect = canvas.getBoundingClientRect()
      // Offset from the keycap's center, eased with tanh so it never hard-stops at the limit
      const dx = Math.tanh((event.clientX - (rect.left + rect.width / 2)) / FOLLOW_REACH)
      const dy = Math.tanh((event.clientY - (rect.top + rect.height / 2)) / FOLLOW_REACH)
      tilt.targetY = dx * MAX_YAW
      tilt.targetX = dy * MAX_PITCH
      requestFrame()
    }
    // Drift back to center when the cursor leaves the page
    const onPointerLeave = () => {
      tilt.targetX = 0
      tilt.targetY = 0
      requestFrame()
    }

    window.addEventListener('pointermove', onPointerMove)
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    window.addEventListener('blur', release)
    canvas.addEventListener('pointerdown', onPointerDown)

    // Render loop, paused while off screen
    let frame: number | null = null
    let visible = true
    let lastTime = performance.now()

    const render = (now: number) => {
      frame = null
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      // Reflect the background's current colors
      metalMaterial.uniforms.uPalette.value.forEach((color: Vector3, i: number) => {
        const [r, g, b] = livePalette.colors[i]
        color.set(srgbToLinear(r), srgbToLinear(g), srgbToLinear(b))
      })
      const [br, bg, bb] = livePalette.back
      metalMaterial.uniforms.uBack.value.set(srgbToLinear(br), srgbToLinear(bg), srgbToLinear(bb))

      // Springy press: stiff enough to snap, underdamped for a small bounce
      const acceleration = -320 * (press.position - press.target) - 16 * press.velocity
      press.velocity += acceleration * dt
      press.position += press.velocity * dt

      const ease = 1 - Math.exp(-FOLLOW_SPEED * dt)
      tilt.x += (tilt.targetX - tilt.x) * ease
      tilt.y += (tilt.targetY - tilt.y) * ease
      const bob = reducedMotion.matches ? 0 : Math.sin(now / 900) * 0.025

      pivot.rotation.set(BASE_PITCH + tilt.x, BASE_YAW + tilt.y, 0)
      pivot.position.y = bob + press.position

      renderer.setRenderTarget(target)
      renderer.render(scene, camera)
      renderer.setRenderTarget(null)
      renderer.render(postScene, postCamera)

      if (visible) requestFrame()
    }

    function requestFrame() {
      if (frame === null && !disposed) {
        lastTime = Math.max(lastTime, performance.now() - 50)
        frame = requestAnimationFrame(render)
      }
    }

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) requestFrame()
    })
    intersectionObserver.observe(canvas)

    return () => {
      disposed = true
      if (frame !== null) cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('blur', release)
      canvas.removeEventListener('pointerdown', onPointerDown)
      legend?.dispose()
      geometry.dispose()
      postQuad.geometry.dispose()
      target.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`cursor-pointer [image-rendering:pixelated] transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  )
}

export default Keycap
