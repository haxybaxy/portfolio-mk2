// Shared easing: quick start, long soft landing
const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
export const ICON_MOTION = `transition-[opacity,translate] duration-700 ${EASE}`
export const TEXT_MOTION = `transition-[opacity,translate] duration-500 ${EASE}`

/** Fade in on first paint; browsers without @starting-style simply show the element */
export const REVEAL = `transition-opacity duration-1000 ease-out starting:opacity-0 motion-reduce:transition-none`
