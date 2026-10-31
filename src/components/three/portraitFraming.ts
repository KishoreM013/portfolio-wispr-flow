export const PORTRAIT_WIDTH = 3.65
export const PORTRAIT_HEIGHT = 6.32

// Subject-specific framing avoids fitting transparent margins or a landscape canvas
// into the tall portrait panel. Coordinates are fractions of the source image.
const framing: Record<string, { centerX: number; top: number; width: number }> = {
  'portrait-01.png': { centerX: .49, top: .292, width: .72 },
  'portrait-02.png': { centerX: .58, top: .345, width: .54 },
  'portrait-03.png': { centerX: .475, top: .02, width: .31 },
  'portrait-04.png': { centerX: .475, top: .02, width: .31 },
  'portrait-05-clean.png': { centerX: .535, top: 0, width: .74 },
  'portrait-06-clean.png': { centerX: .61, top: 0, width: .8 },
  'portrait-07-clean.png': { centerX: .54, top: .02, width: .78 },
  'portrait-08.png': { centerX: .48, top: .29, width: .74 },
  'portrait-09.png': { centerX: .56, top: .33, width: .7 },
  'portrait-10-clean.png': { centerX: .51, top: 0, width: .74 },
  'portrait-11.png': { centerX: .37, top: .27, width: .22 },
}

export function portraitViewport(src: string, imageWidth: number, imageHeight: number) {
  const preset = framing[src.split('/').at(-1)!]
  const aspect = PORTRAIT_WIDTH / PORTRAIT_HEIGHT
  const y = (preset?.top ?? 0) * imageHeight
  const width = Math.min((preset?.width ?? 1) * imageWidth, (imageHeight - y) * aspect)
  const height = width / aspect
  const x = Math.max(0, Math.min(imageWidth - width, (preset?.centerX ?? .5) * imageWidth - width / 2))
  return { x, y, width, height, repeat: [width / imageWidth, height / imageHeight] as const, offset: [x / imageWidth, 1 - (y + height) / imageHeight] as const }
}
