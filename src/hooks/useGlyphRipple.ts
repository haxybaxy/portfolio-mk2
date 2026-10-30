import { useEffect, type RefObject } from 'react'

type Cell = {
  el: HTMLSpanElement
  row: number
  col: number
  // current (eased) and target displacement in em, plus glow strength 0..1
  x: number
  y: number
  g: number
  tx: number
  ty: number
  tg: number
}

const RADIUS = 5 // em from the pointer that glyphs react within
const AMP = 0.32 // em of maximum outward displacement
const CELL_W = 0.6 // JetBrains Mono advance width in em
const EASE = 0.18

/**
 * Shader-style hover for a block of monospace glyphs: every `span[data-row][data-col]` inside
 * the element is pushed outward from the pointer with a slow ripple and a soft glow, easing
 * back when the pointer leaves. Runs imperatively on a rAF loop so the text never re-renders
 * and stays selectable. The glow uses the current text colour, so it follows the theme.
 */
export function useGlyphRipple(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cells: Cell[] = Array.from(el.querySelectorAll<HTMLSpanElement>('span[data-row]')).map((span) => ({
      el: span,
      row: Number(span.dataset.row),
      col: Number(span.dataset.col),
      x: 0,
      y: 0,
      g: 0,
      tx: 0,
      ty: 0,
      tg: 0,
    }))
    const byKey = new Map(cells.map((cell) => [cell.row * 4096 + cell.col, cell]))
    const active = new Set<Cell>()
    let pointer: { col: number; row: number } | null = null
    let raf = 0
    const start = performance.now()

    const paint = (cell: Cell) => {
      cell.el.style.transform = cell.x || cell.y ? `translate(${cell.x.toFixed(3)}em, ${cell.y.toFixed(3)}em)` : ''
      cell.el.style.textShadow =
        cell.g > 0.01
          ? `0 0 ${(0.6 * cell.g).toFixed(2)}em color-mix(in srgb, currentColor ${Math.round(90 * cell.g)}%, transparent)`
          : ''
    }

    const frame = (now: number) => {
      const t = (now - start) / 1000
      for (const cell of active) {
        cell.tx = cell.ty = cell.tg = 0
        if (pointer) {
          const dx = (cell.col + 0.5) * CELL_W - pointer.col * CELL_W
          const dy = cell.row + 0.5 - pointer.row
          const d = Math.hypot(dx, dy)
          if (d < RADIUS && d > 1e-3) {
            const fall = (1 - d / RADIUS) ** 2
            const ripple = 0.65 + 0.35 * Math.sin(d * 2.4 - t * 4)
            const mag = reduceMotion ? 0 : AMP * fall * ripple
            cell.tx = (dx / d) * mag
            cell.ty = (dy / d) * mag
            cell.tg = fall
          }
        }
        cell.x += (cell.tx - cell.x) * EASE
        cell.y += (cell.ty - cell.y) * EASE
        cell.g += (cell.tg - cell.g) * EASE
        const settled = Math.abs(cell.x) < 0.002 && Math.abs(cell.y) < 0.002 && cell.g < 0.005
        if (settled && !cell.tx && !cell.ty && !cell.tg) {
          cell.x = cell.y = cell.g = 0
          active.delete(cell)
        }
        paint(cell)
      }
      raf = active.size || pointer ? requestAnimationFrame(frame) : 0
    }

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const fontSize = parseFloat(getComputedStyle(el).fontSize)
      pointer = { col: (event.clientX - rect.left) / (CELL_W * fontSize), row: (event.clientY - rect.top) / fontSize }
      const rows = Math.ceil(RADIUS)
      const cols = Math.ceil(RADIUS / CELL_W)
      const r0 = Math.floor(pointer.row)
      const c0 = Math.floor(pointer.col)
      for (let r = r0 - rows; r <= r0 + rows; r++) {
        for (let c = c0 - cols; c <= c0 + cols; c++) {
          const cell = byKey.get(r * 4096 + c)
          if (cell) active.add(cell)
        }
      }
      wake()
    }

    const onLeave = () => {
      pointer = null
      wake()
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
      for (const cell of cells) {
        cell.el.style.transform = ''
        cell.el.style.textShadow = ''
      }
    }
  }, [ref])
}
