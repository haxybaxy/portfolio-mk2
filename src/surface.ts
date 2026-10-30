// Shared styles; fg/bg follow the light or dark theme (see index.css)

/** Small uppercase label that opens every section */
export const SECTION_TITLE = 'text-xs font-bold tracking-[0.2em] uppercase opacity-60'

export const LINK = 'underline decoration-fg/30 underline-offset-4 transition-colors hover:decoration-fg'

export const MUTED = 'text-sm opacity-60'

/** Bordered tile for photos and cards */
export const PANEL = 'overflow-hidden rounded-xl border border-fg/10'

/** Icon + label chip for a technology */
export const CHIP = 'flex items-center gap-2 rounded-lg border border-fg/10 bg-fg/5 px-2.5 py-1 text-sm'

export const TAG = 'rounded-full border border-fg/20 px-2.5 py-0.5 text-xs opacity-80'

/** 24px matches the pixel icons' grid so they stay crisp */
export const PIXEL_ICON = { width: 24, height: 24, shapeRendering: 'crispEdges', 'aria-hidden': true } as const
