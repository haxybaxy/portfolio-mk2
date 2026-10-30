// Shared page styles so every section reads the same over the shifting background
export const PAGE_TITLE = 'text-center text-[clamp(3rem,10vw,8rem)] leading-none font-bold tracking-tighter'

/** Dark frosted panel: keeps body text readable over any background colour */
export const CARD = 'rounded-2xl border border-white/15 bg-black/35 backdrop-blur-md'

export const TAG = 'rounded-full border border-white/20 px-2.5 py-0.5 text-xs opacity-80'

/** 24px matches the pixel icons' grid so they stay crisp */
export const PIXEL_ICON = { width: 24, height: 24, shapeRendering: 'crispEdges', 'aria-hidden': true } as const
