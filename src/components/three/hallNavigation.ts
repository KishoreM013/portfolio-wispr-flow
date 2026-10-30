import * as THREE from 'three'

export const HALL_CENTER_Z = 3
export const HALL_RADIUS = 29.2
export const HALL_WALL_HEIGHT = 11.6
export const HALL_BALCONY_INNER = 24.5
export const GALLERY_FLOOR = 5.2
export const EYE_HEIGHT = 1.7
export const UPPER_INNER_RADIUS = 25.3
export const UPPER_OUTER_RADIUS = 27.5
export const STAIR_TOP_ANGLE = Math.PI / 2
export const STAIR_BOTTOM_ANGLE = 2.3
export const STAIR_STEPS = 32
export const STAIR_WALK_RADIUS = 26.6
export const STAIR_RAIL_HEIGHT = 1.12
export const STAIR_RAIL_POST_COUNT = Math.ceil((STAIR_BOTTOM_ANGLE - STAIR_TOP_ANGLE) * (STAIR_WALK_RADIUS + 2.03) / .82) + 1
// Kept for consumers of the former center-stair geometry API.
export const HALL_STAIR_DEPTH = .8
export const HALL_STAIR_FIRST_Z = -1.1
export const ARCH_ANGLES = [-.94, -.44, .44, .94]
export type HallView = 'arrival' | 'statue' | 'ground' | 'stairs' | 'upper'
export type HallStop = { id: string; view: HallView; label: string; position: THREE.Vector3; look: THREE.Vector3; roomIndex?: number; progress: number }
export const hallPolar = (radius: number, angle: number, y = 0) => new THREE.Vector3(Math.sin(angle) * radius, y, HALL_CENTER_Z - Math.cos(angle) * radius)
// Both floors have a central gallery, with the upper route returning from the
// east staircase through its mirrored run of rooms.
const FLOOR_ROOM_ANGLES = [ARCH_ANGLES[0], ARCH_ANGLES[1], 0, ARCH_ANGLES[2], ARCH_ANGLES[3]]
const UPPER_ROOM_ANGLES = [ARCH_ANGLES[3], ARCH_ANGLES[2], 0, ARCH_ANGLES[1], ARCH_ANGLES[0]]
export const roomAngle = (index: number) => index < 5 ? FLOOR_ROOM_ANGLES[index] : UPPER_ROOM_ANGLES[index - 5]
export const sideStairHeight = (angle: number) => THREE.MathUtils.clamp((STAIR_BOTTOM_ANGLE - Math.abs(angle)) / (STAIR_BOTTOM_ANGLE - STAIR_TOP_ANGLE), 0, 1) * GALLERY_FLOOR
/** Shared handrail path used by both mirrored flights. Its centerline meets the gallery handrail. */
export const sideStairRailPosition = (side: -1 | 1, offset: number, progress: number) => {
  const angle = THREE.MathUtils.lerp(STAIR_BOTTOM_ANGLE, STAIR_TOP_ANGLE, THREE.MathUtils.clamp(progress, 0, 1))
  return hallPolar(STAIR_WALK_RADIUS + offset, side * angle, sideStairHeight(angle) + STAIR_RAIL_HEIGHT)
}
/** Compatibility helper for the older central-stair collision checks and geometry tests. */
export const stairHeight = (z: number) => THREE.MathUtils.clamp((5 - z) / 28.2, 0, 1) * GALLERY_FLOOR
export const hallFieldOfView = (zoom: number, aspect: number) => THREE.MathUtils.clamp((aspect < .8 ? 76 : 58) / zoom, 27, 90)

/** Apply free-look to a fresh tour bearing, without feeding the prior camera target back into itself. */
export function orbitLookTarget(camera: THREE.Vector3, bearing: THREE.Vector3, yaw: number, pitch: number, target = new THREE.Vector3()) {
  const direction = bearing.clone().sub(camera)
  const distance = Math.max(.001, direction.length())
  const azimuth = Math.atan2(direction.x, -direction.z) - yaw
  const elevation = THREE.MathUtils.clamp(Math.asin(THREE.MathUtils.clamp(direction.y / distance, -1, 1)) + pitch - .15, -.9, .9)
  const horizontal = Math.cos(elevation) * distance
  return target.set(camera.x + Math.sin(azimuth) * horizontal, camera.y + Math.sin(elevation) * distance, camera.z - Math.cos(azimuth) * horizontal)
}

/** The floor-supported route visits the statue and all ten galleries in order. */
export function createHallTour() {
  const points: THREE.Vector3[] = [], targets: THREE.Vector3[] = []
  const stops: HallStop[] = []
  const add = (p: THREE.Vector3, look: THREE.Vector3) => { points.push(p); targets.push(look) }
  const stop = (id: string, view: HallView, label: string, p: THREE.Vector3, look: THREE.Vector3, roomIndex?: number) => {
    add(p, look); stops.push({ id, view, label, position: p, look, roomIndex, progress: points.length - 1 })
  }
  const eyes = EYE_HEIGHT
  stop('arrival', 'arrival', 'The Grand Rotunda', new THREE.Vector3(0, eyes, 27), new THREE.Vector3(0, 4.2, 5))
  stop('statue', 'statue', 'The standing portrait', new THREE.Vector3(0, eyes, 12), new THREE.Vector3(0, 3.25, 5))
  add(new THREE.Vector3(-8, eyes, 9), hallPolar(HALL_RADIUS, -.94, 2.15))
  add(hallPolar(22.6, -1.32, eyes), hallPolar(HALL_RADIUS, -.94, 2.15))
  const names = ['Skills', 'Volunteering', 'Contributions', 'Writing & Songs', 'Hobby & More About Me', 'Projects', 'Accounts', 'Achievements', 'VIP Pass', 'Management Room']
  for (let index = 0; index < 5; index++) {
    const angle = roomAngle(index)
    if (index) for (let j = 1; j < 5; j++) {
      const a = THREE.MathUtils.lerp(roomAngle(index - 1), angle, j / 5)
      add(hallPolar(22.6, a, eyes), hallPolar(HALL_RADIUS, a, 2.15))
    }
    stop(`room-${index}`, 'ground', `${String(index + 1).padStart(2, '0')} · ${names[index]}`, hallPolar(22.6, angle, eyes), hallPolar(HALL_RADIUS, angle + Math.sign(angle) * .08, 2.15), index)
  }
  for (const a of [1.22, 1.5, 1.82, 2.15]) add(hallPolar(22.6, a, eyes), hallPolar(STAIR_WALK_RADIUS, STAIR_BOTTOM_ANGLE, 2.2))
  stop('stairs', 'stairs', 'The east staircase', hallPolar(STAIR_WALK_RADIUS, STAIR_BOTTOM_ANGLE + .07, eyes), hallPolar(STAIR_WALK_RADIUS, 2.04, 3.7))
  for (let j = 0; j <= STAIR_STEPS; j++) {
    const a = THREE.MathUtils.lerp(STAIR_BOTTOM_ANGLE, STAIR_TOP_ANGLE, j / STAIR_STEPS)
    add(hallPolar(STAIR_WALK_RADIUS, a, sideStairHeight(a) + eyes), hallPolar(STAIR_WALK_RADIUS, Math.max(1.35, a - .2), sideStairHeight(a - .2) + eyes))
  }
  stop('upper', 'upper', 'The upper gallery', hallPolar(STAIR_WALK_RADIUS, 1.4, eyes + GALLERY_FLOOR), hallPolar(HALL_RADIUS, .94, 7.35))
  for (let index = 5; index < 10; index++) {
    const angle = roomAngle(index), start = index === 5 ? 1.4 : roomAngle(index - 1)
    for (let j = 1; j < 6; j++) {
      const a = THREE.MathUtils.lerp(start, angle, j / 6)
      add(hallPolar(STAIR_WALK_RADIUS, a, eyes + GALLERY_FLOOR), hallPolar(HALL_RADIUS, angle + Math.sign(angle) * .12, 7.35))
    }
    // Stand beside the balustrade, far enough away to read the board.
    stop(`room-${index}`, 'upper', `${String(index + 1).padStart(2, '0')} · ${names[index]}`, hallPolar(25.5, angle + Math.sign(angle) * .1, eyes + GALLERY_FLOOR), hallPolar(HALL_RADIUS, angle + Math.sign(angle) * .155, 7.35), index)
  }
  // Piecewise distances retain exact landings and stops; cubic interpolation can cut through railings.
  const distances = [0]
  for (let i = 1; i < points.length; i++) distances.push(distances[i - 1] + points[i].distanceTo(points[i - 1]))
  const length = distances.at(-1)!
  for (const stop of stops) stop.progress = distances[stop.progress] / length
  const sample = (progress: number, position = new THREE.Vector3(), look = new THREE.Vector3()) => {
    const distance = THREE.MathUtils.clamp(progress, 0, 1) * length
    let i = 1
    while (i < distances.length - 1 && distances[i] < distance) i++
    const t = (distance - distances[i - 1]) / Math.max(.00001, distances[i] - distances[i - 1])
    position.lerpVectors(points[i - 1], points[i], t)
    look.lerpVectors(targets[i - 1], targets[i], t)
    const angle = Math.atan2(position.x, HALL_CENTER_Z - position.z), radius = Math.hypot(position.x, HALL_CENTER_Z - position.z)
    if (Math.abs(angle) >= STAIR_TOP_ANGLE && Math.abs(angle) <= STAIR_BOTTOM_ANGLE && radius > HALL_BALCONY_INNER) position.y = sideStairHeight(angle) + EYE_HEIGHT + .08
    return { position, look }
  }
  return { stops, length, sample, getPointAt: (p: number, target?: THREE.Vector3) => sample(p, target).position, points }
}
export const createHallRoute = createHallTour
export function nearestTourProgress(position: THREE.Vector3, tour = createHallTour(), around = 0) {
  let result = around, best = Infinity
  const point = new THREE.Vector3()
  for (let i = 0; i <= 1200; i++) {
    const p = i / 1200, distance = tour.getPointAt(p, point).distanceToSquared(position) + Math.abs(p - around) * .001
    if (distance < best) { best = distance; result = p }
  }
  return result
}
export function constrainUpperPosition(position: THREE.Vector3) {
  const angle = THREE.MathUtils.clamp(Math.atan2(position.x, HALL_CENTER_Z - position.z), -1.35, 1.35)
  const radius = THREE.MathUtils.clamp(Math.hypot(position.x, HALL_CENTER_Z - position.z), UPPER_INNER_RADIUS, UPPER_OUTER_RADIUS)
  return position.copy(hallPolar(radius, angle, GALLERY_FLOOR + EYE_HEIGHT))
}
export function constrainGroundPosition(position: THREE.Vector3) {
  const dz = position.z - HALL_CENTER_Z, radius = Math.hypot(position.x, dz)
  if (radius > HALL_RADIUS - 1.4) { position.x *= (HALL_RADIUS - 1.4) / radius; position.z = HALL_CENTER_Z + dz * (HALL_RADIUS - 1.4) / radius }
  const statueZ = position.z - 5, distance = Math.hypot(position.x, statueZ)
  if (distance < 3) { const a = distance > .001 ? Math.atan2(position.x, statueZ) : 0; position.x = Math.sin(a) * 3; position.z = 5 + Math.cos(a) * 3 }
  return position
}
export function boardMount(archAngle: number, side: number) {
  const angle = archAngle + side * .155
  const radius = HALL_RADIUS - .22
  return { position: [radius * Math.sin(angle), 2.15, HALL_CENTER_Z - radius * Math.cos(angle)] as [number, number, number], angle }
}
