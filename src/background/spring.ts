export type SpringValue = { value: number; velocity: number }

/**
 * Advances a critically damped spring by `dt` seconds using the closed-form
 * solution, so it's stable for any frame time and never overshoots from rest.
 * `omega` is the natural frequency: ~9.2 / omega is the time to settle within 0.1%.
 */
export function stepSpring(spring: SpringValue, target: number, omega: number, dt: number) {
  const offset = spring.value - target
  const decay = Math.exp(-omega * dt)
  const k = spring.velocity + omega * offset

  spring.value = target + (offset + k * dt) * decay
  spring.velocity = (spring.velocity - omega * k * dt) * decay
}

export function isSettled(spring: SpringValue, target: number, epsilon = 1e-4) {
  return Math.abs(spring.value - target) < epsilon && Math.abs(spring.velocity) < epsilon
}
