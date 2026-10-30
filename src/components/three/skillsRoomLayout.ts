export const SKILLS_ROOM_RADIUS = 22.3
export const SKILLS_WALK_RADIUS = 14.5
export const SKILLS_SYSTEM_HEIGHT = 1.55
export function ratingOrbit(stars: number) {
  return 2.5 + (5 - Math.max(1, Math.min(5, stars))) * 1.3
}
export function skillOrbitAngle(indexOnRing: number, ringCount: number, stars: number) {
  return indexOnRing / Math.max(1, ringCount) * Math.PI * 2 + stars * .31
}
export function skillsWalkPosition(angle: number, mobile = false): [number, number, number] {
  const radius = mobile ? 19 : SKILLS_WALK_RADIUS
  return [Math.sin(angle) * radius, 4.2, Math.cos(angle) * radius]
}

export const SKILLS_DOME_SPRING = 8.5
export const SKILLS_DOME_RISE = 6.6
export const SKILLS_DEFAULT_PITCH = .04
export function skillBubbleScale(hovered: boolean, selected: boolean) {
  return hovered ? 2.35 : selected ? 1.65 : 1
}
export function skillDomePoint(angle: number, elevation: number): [number, number, number] {
  const radius = (SKILLS_ROOM_RADIUS - .18) * Math.cos(elevation)
  return [Math.sin(angle) * radius, SKILLS_DOME_SPRING + Math.sin(elevation) * SKILLS_DOME_RISE - .09, Math.cos(angle) * radius]
}
