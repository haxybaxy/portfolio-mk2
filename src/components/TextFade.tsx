/**
 * Soft black glow sized to its parent's content, fading to nothing on every side,
 * so text stays readable over any background without a visible edge.
 * The parent needs `relative isolate`.
 */
function TextFade() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-12 -inset-y-6 -z-10 bg-[radial-gradient(closest-side,rgb(0_0_0/0.3),rgb(0_0_0/0.12)_50%,transparent)]"
    />
  )
}

export default TextFade
