import { getShaderNoiseTexture, ShaderFitOptions } from '@paper-design/shaders'
import { ShaderMount, type PaperShaderElement } from '@paper-design/shaders-react'
import { useEffect, useRef, useState } from 'react'
import { getScrollProgress } from '../scrollProgress'
import type { Background } from '../sections'
import { hexToOklab, oklabToRgba } from './color'
import { updateLivePalette } from './livePalette'
import { COLOR_COUNT, grainMorphShader, SHAPES } from './grainMorphShader'
import { isSettled, stepSpring, type SpringValue } from './spring'

// Spring frequencies smoothing the scroll-driven blend: settle time ≈ 9.2 / omega
// seconds. Colors lead slightly, the pattern follows.
const COLOR_OMEGA = 10
const SHAPE_OMEGA = 7.5

const DEFAULTS = { softness: 0.5, intensity: 0.5, noise: 0.25, scale: 1 }

// Flat layout of every animated value: shape weights, then colors (OKLab),
// then back color (OKLab), then softness / intensity / noise / scale.
const SHAPE_SLOTS = SHAPES.length
const COLOR_START = SHAPE_SLOTS
const BACK_START = COLOR_START + COLOR_COUNT * 4
const PARAMS_START = BACK_START + 4

function toTargets(background: Background): number[] {
  return [
    ...SHAPES.map((shape) => (shape === background.shape ? 1 : 0)),
    ...background.colors.flatMap(hexToOklab),
    ...hexToOklab(background.colorBack),
    background.softness ?? DEFAULTS.softness,
    background.intensity ?? DEFAULTS.intensity,
    background.noise ?? DEFAULTS.noise,
    background.scale ?? DEFAULTS.scale,
  ]
}

function toUniforms(values: number[]) {
  const weights = values.slice(0, SHAPE_SLOTS).map((w) => Math.max(w, 0))
  const total = weights.reduce((sum, w) => sum + w, 0) || 1
  const [wave, dots, truchet, corners, ripple, blob, sphere] = weights.map((w) => w / total)

  const colors = []
  for (let i = 0; i < COLOR_COUNT; i++) {
    const start = COLOR_START + i * 4
    colors.push(oklabToRgba(values.slice(start, start + 4) as [number, number, number, number]))
  }

  const [softness, intensity, noise, scale] = values.slice(PARAMS_START)

  return {
    u_shapeWeightsA: [wave, dots, truchet, corners],
    u_shapeWeightsB: [ripple, blob, sphere, 0],
    u_colors: colors,
    u_colorBack: oklabToRgba(values.slice(BACK_START, PARAMS_START) as [number, number, number, number]),
    u_softness: softness,
    u_intensity: intensity,
    u_noise: noise,
    u_scale: scale,
  }
}

// The library's `setUniformValues` writes uniforms without forcing an extra draw;
// its own render loop picks them up on the next frame. It's public at runtime but
// typed private, hence the narrow cast (package version is pinned in package.json).
type UniformWriter = { setUniformValues: (uniforms: ReturnType<typeof toUniforms>) => void }

/** Blends between adjacent stops; smoothstep holds each section's look while it fills the screen */
function targetsAt(stopTargets: number[][], progress: number): number[] {
  const index = Math.min(Math.floor(progress), stopTargets.length - 1)
  const from = stopTargets[index]
  const to = stopTargets[Math.min(index + 1, stopTargets.length - 1)]
  const t = progress - index
  const eased = t * t * (3 - 2 * t)
  return from.map((value, i) => value + (to[i] - value) * eased)
}

function MorphingBackground({ stops, className }: { stops: Background[]; className?: string }) {
  const elementRef = useRef<PaperShaderElement>(null)

  // Must keep a stable identity: ShaderMount resets every uniform whenever this
  // object changes, and only registers uniforms present on first mount.
  const [initialUniforms] = useState(() => {
    const uniforms = toUniforms(targetsAt(stops.map(toTargets), getScrollProgress(stops.length)))
    updateLivePalette(uniforms.u_colors, uniforms.u_colorBack)
    return {
      ...uniforms,
      u_noiseTexture: getShaderNoiseTexture(),
      u_fit: ShaderFitOptions.contain,
      u_rotation: 0,
      u_offsetX: 0,
      u_offsetY: 0,
      u_originX: 0.5,
      u_originY: 0.5,
      u_worldWidth: 0,
      u_worldHeight: 0,
    }
  })

  useEffect(() => {
    const stopTargets = stops.map(toTargets)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let targets = targetsAt(stopTargets, getScrollProgress(stops.length))
    const springs: SpringValue[] = targets.map((value) => ({ value, velocity: 0 }))

    let frame: number | null = null
    let lastTime = 0

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000
      lastTime = now

      let settled = true
      springs.forEach((spring, i) => {
        if (reducedMotion.matches) {
          spring.value = targets[i]
          spring.velocity = 0
          return
        }
        stepSpring(spring, targets[i], i < SHAPE_SLOTS ? SHAPE_OMEGA : COLOR_OMEGA, dt)
        if (isSettled(spring, targets[i])) {
          spring.value = targets[i]
          spring.velocity = 0
        } else {
          settled = false
        }
      })

      const mount = elementRef.current?.paperShaderMount as unknown as UniformWriter | undefined
      const uniforms = toUniforms(springs.map((spring) => spring.value))
      updateLivePalette(uniforms.u_colors, uniforms.u_colorBack)
      mount?.setUniformValues(uniforms)

      // Keep going until settled, and until the mount exists so the final values land
      frame = settled && mount ? null : requestAnimationFrame(tick)
    }

    const wake = () => {
      targets = targetsAt(stopTargets, getScrollProgress(stops.length))
      if (frame === null) {
        lastTime = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }

    wake()
    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', wake)

    return () => {
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', wake)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [stops])

  return (
    <ShaderMount
      ref={elementRef}
      className={className}
      fragmentShader={grainMorphShader}
      uniforms={initialUniforms}
      speed={1}
    />
  )
}

export default MorphingBackground
