import { useEffect, useRef, useState } from 'react'
import {
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
import { livePalette } from '../background/livePalette'

// Size of one rendered pixel in CSS pixels
const PIXEL_SIZE = 2
// Color levels per channel after dithering
const COLOR_LEVELS = 10

const RADIUS = 0.62
// The face texture spans this many radians of azimuth and latitude, centered on the front
const FACE_SPAN = Math.PI / 1.5

// Resting pose: turned slightly, face toward the camera
const BASE_YAW = 0
const BASE_PITCH = 0.05
// Cursor following: max turn toward the cursor, how far away (in px) the cursor
// reaches that max, and how quickly the smiley catches up (higher is snappier)
const MAX_YAW = 0.7
const MAX_PITCH = 0.5
const FOLLOW_REACH = 500
const FOLLOW_SPEED = 9
const SQUISH = 0.14

/**
 * Smiley face mask, traced from the old portfolio's face texture (864px across).
 * White where the face is cut into the metal, transparent elsewhere.
 */
function createFaceTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const context = canvas.getContext('2d')!
  // Map the original texture's coordinates (face centered on 432, 432) into this canvas
  const scale = (size / 864) * 1.6
  context.translate(size / 2, size / 2)
  context.scale(scale, scale)
  context.translate(-432, -440)
  context.fillStyle = context.strokeStyle = '#fff'

  // Eyes
  context.beginPath()
  context.ellipse(367, 377, 25, 35, 0, 0, Math.PI * 2)
  context.ellipse(497, 377, 25, 35, 0, 0, Math.PI * 2)
  context.fill()

  // Crescent smile with rounded tips
  context.beginPath()
  context.moveTo(340, 465)
  context.quadraticCurveTo(432, 575, 525, 465)
  context.quadraticCurveTo(432, 515, 340, 465)
  context.fill()
  context.lineWidth = 10
  context.lineJoin = 'round'
  context.stroke()

  return new CanvasTexture(canvas)
}

/** Polished silver, reflecting a studio lit in the background's live palette, with the face engraved */
const metalMaterial = new ShaderMaterial({
  uniforms: {
    uPalette: { value: [new Vector3(), new Vector3(), new Vector3(), new Vector3()] },
    uBack: { value: new Vector3() },
    uFace: { value: null },
    uFaceSpan: { value: FACE_SPAN },
  },
  vertexShader: /* glsl */ `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPos;
    varying vec3 vObjNormal;
    void main() {
      vObjNormal = normalize(position);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uPalette[4];
    uniform vec3 uBack;
    uniform sampler2D uFace;
    uniform float uFaceSpan;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPos;
    varying vec3 vObjNormal;

    const vec3 SILVER = vec3(0.92, 0.94, 0.97);

    vec3 gradient(float f) {
      f = clamp(f, 0.0, 1.0) * 3.0;
      int i = int(min(floor(f), 2.0));
      return mix(uPalette[i], uPalette[i + 1], smoothstep(0.0, 1.0, f - float(i)));
    }

    // Studio for polished metal: a near-black room with a smooth palette sky, so every
    // surface shows a gradient, plus crisp bright strip lights for hard specular streaks
    vec3 environment(vec3 dir) {
      float azimuth = atan(dir.z, dir.x);

      vec3 sky = gradient(0.15 + 0.85 * smoothstep(-0.1, 0.9, dir.y)) * smoothstep(-0.2, 0.7, dir.y);
      vec3 color = mix(uBack * 0.5, sky * 0.9, smoothstep(-0.15, 0.1, dir.y));

      // Thin overhead strip light
      float strip = smoothstep(0.06, 0.02, abs(azimuth + 1.9)) * smoothstep(0.55, 0.6, dir.y);
      color = mix(color, vec3(1.0) * 1.6, strip);

      // Ring of bright vertical panels around the horizon
      float panels = smoothstep(0.75, 0.9, cos(azimuth * 4.0 + 0.6));
      float bandHigh = smoothstep(-0.05, 0.05, dir.y) * smoothstep(0.45, 0.35, dir.y);
      color = mix(color, mix(vec3(1.0), uPalette[1], 0.4) * 1.4, panels * bandHigh);

      // Floor bounce in a palette color
      float floor = smoothstep(-0.2, -0.5, dir.y);
      color = mix(color, uPalette[2] * 0.6, floor * (0.5 + 0.5 * cos(azimuth * 2.0)));
      return color;
    }

    void main() {
      vec3 normal = normalize(vWorldNormal);
      vec3 view = normalize(cameraPosition - vWorldPos);
      vec3 reflected = reflect(-view, normal);
      vec3 env = environment(reflected);

      // Silver reflects mostly by brightness, slightly cool, with the palette showing through
      float luminance = dot(env, vec3(0.2126, 0.7152, 0.0722));
      float fresnel = pow(1.0 - max(dot(normal, view), 0.0), 5.0);
      vec3 silver = mix(SILVER, vec3(1.0), fresnel * 0.6);
      vec3 color = silver * (0.08 + luminance * 1.5) + env * 0.3;
      // Hard sun glint
      color += pow(max(dot(reflected, normalize(vec3(0.35, 0.85, 0.4))), 0.0), 400.0) * 4.0;

      // Engraved face: features cut into the front as dark recesses
      if (vObjNormal.z > 0.0) {
        vec3 n = normalize(vObjNormal);
        vec2 uv = vec2(atan(n.x, n.z), asin(n.y)) / uFaceSpan + 0.5;
        float feature = texture2D(uFace, uv).a;
        vec3 cut = vec3(0.008) + env * 0.02;
        color = mix(color, cut, feature);
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

function Smiley({ className = '' }: { className?: string }) {
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
    camera.position.set(0, 0.5, 3)
    camera.lookAt(0, 0, 0)

    const geometry = new SphereGeometry(RADIUS, 96, 64)
    const smiley = new Mesh(geometry, metalMaterial)
    const pivot = new Group()
    pivot.add(smiley)
    scene.add(pivot)

    const face = createFaceTexture()
    metalMaterial.uniforms.uFace.value = face

    // Low-res offscreen render, then the dither pass draws it to the canvas
    const target = new WebGLRenderTarget(1, 1, { minFilter: NearestFilter, magFilter: NearestFilter })
    ditherMaterial.uniforms.tScene.value = target.texture
    const postScene = new Scene()
    const postQuad = new Mesh(new PlaneGeometry(2, 2), ditherMaterial)
    postScene.add(postQuad)
    const postCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

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

    // Interaction: the face turns toward the cursor, and squishes while pressed
    const tilt = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const squish = { amount: 0, velocity: 0, target: 0 }

    const setPressed = (pressed: boolean) => {
      squish.target = pressed ? SQUISH : 0
      requestFrame()
    }
    const onPointerDown = () => setPressed(true)
    const release = () => setPressed(false)
    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches) return
      const rect = canvas.getBoundingClientRect()
      // Offset from the smiley's center, eased with tanh so it never hard-stops at the limit
      const dx = Math.tanh((event.clientX - (rect.left + rect.width / 2)) / FOLLOW_REACH)
      const dy = Math.tanh((event.clientY - (rect.top + rect.height / 2)) / FOLLOW_REACH)
      tilt.targetY = dx * MAX_YAW
      tilt.targetX = dy * MAX_PITCH
    }
    // Drift back to center when the cursor leaves the page
    const onPointerLeave = () => {
      tilt.targetX = 0
      tilt.targetY = 0
    }

    window.addEventListener('pointermove', onPointerMove)
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    window.addEventListener('blur', release)
    canvas.addEventListener('pointerdown', onPointerDown)

    // Render loop, paused while off screen
    let disposed = false
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

      // Springy squish: stiff enough to snap, underdamped for a small wobble
      const acceleration = -320 * (squish.amount - squish.target) - 14 * squish.velocity
      squish.velocity += acceleration * dt
      squish.amount += squish.velocity * dt

      const ease = 1 - Math.exp(-FOLLOW_SPEED * dt)
      tilt.x += (tilt.targetX - tilt.x) * ease
      tilt.y += (tilt.targetY - tilt.y) * ease
      const bob = reducedMotion.matches ? 0 : Math.sin(now / 900) * 0.025

      pivot.rotation.set(BASE_PITCH + tilt.x, BASE_YAW + tilt.y, 0)
      // Flatten from the bottom so it squashes against an imaginary floor
      const squashY = 1 - squish.amount
      const squashXZ = 1 + squish.amount * 0.5
      pivot.scale.set(squashXZ, squashY, squashXZ)
      pivot.position.y = bob - RADIUS * (1 - squashY)

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
    setReady(true)

    return () => {
      disposed = true
      if (frame !== null) cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('blur', release)
      canvas.removeEventListener('pointerdown', onPointerDown)
      face.dispose()
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

export default Smiley
