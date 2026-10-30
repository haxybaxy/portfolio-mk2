type Rgba = [number, number, number, number] | number[]

/**
 * The background's current colors (sRGB, 0–1), updated every frame it animates.
 * Lets other renderers, like the keycap, reflect the same palette without React state.
 */
export const livePalette = {
  colors: [
    [0.45, 0, 1],
    [0.92, 0.66, 1],
    [0, 0.75, 1],
    [0.17, 0, 1],
  ] as number[][],
  back: [0, 0, 0] as number[],
}

export function updateLivePalette(colors: Rgba[], back: Rgba) {
  livePalette.colors = colors.map(([r, g, b]) => [r, g, b])
  livePalette.back = [back[0], back[1], back[2]]
}
