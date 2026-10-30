export const EXHIBIT_FRAME_DEPTH = .18
export const EXHIBIT_ARTWORK_OFFSET = EXHIBIT_FRAME_DEPTH / 2 + .025
export const EXHIBIT_SPACING = 7
export const GALLERY_ENTRANCE_Z = 18
export function exhibitPlacement(index: number) {
  const side = index % 2 === 0 ? -1 : 1
  return { side, pair: Math.floor(index / 2), z: 2 - Math.floor(index / 2) * EXHIBIT_SPACING, rotation: side === -1 ? Math.PI / 2 : -Math.PI / 2 }
}
export function galleryLength(exhibitCount: number) {
  return Math.max(28, Math.ceil(exhibitCount / 2) * EXHIBIT_SPACING + 18) + 5
}
export function galleryEndZ(exhibitCount: number) {
  return GALLERY_ENTRANCE_Z - galleryLength(exhibitCount)
}
export function maxGalleryProgress(exhibitCount: number) {
  // Continue beyond the final display pair and into the portrait alcove.
  return (11 - (galleryEndZ(exhibitCount) - .2)) / EXHIBIT_SPACING
}
export function clampGalleryProgress(progress: number, exhibitCount: number) {
  return Math.max(0, Math.min(maxGalleryProgress(exhibitCount), progress))
}
export function galleryCameraZ(progress: number) {
  return 11 - progress * EXHIBIT_SPACING
}
export function focusAtProgress(progress: number, exhibitCount: number, side: number) {
  if (!exhibitCount) return 0
  return Math.min(exhibitCount - 1, Math.round(clampGalleryProgress(progress, exhibitCount)) * 2 + side)
}
