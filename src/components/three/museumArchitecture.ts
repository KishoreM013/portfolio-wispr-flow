import * as THREE from 'three'

export type CircularOpening = { angle: number; floor: number; radius: number; spring: number }
const wrap = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle))

/** Marble ground plane with an accurately aligned stairwell cut through its surface. */
export function circularFloorWithOpening(radius: number, centerZ: number, angle: number, width: number, depth: number, entryRadius = radius) {
  const shape = new THREE.Shape()
  shape.absarc(0, 0, radius, 0, Math.PI * 2, false)
  const hole = new THREE.Path()
  const x = Math.sin(angle) * entryRadius, z = centerZ - Math.cos(angle) * entryRadius
  const corners = [[-width / 2, -.35], [width / 2, -.35], [width / 2, depth], [-width / 2, depth]]
  for (let i = 0; i < corners.length; i++) {
    const [u, v] = corners[i]
    const point = [x + Math.cos(angle) * u - Math.sin(angle) * v, -(z + Math.sin(angle) * u + Math.cos(angle) * v - centerZ)] as [number, number]
    if (i === 0) hole.moveTo(...point); else hole.lineTo(...point)
  }
  hole.closePath()
  shape.holes.push(hole)
  const geometry = new THREE.ShapeGeometry(shape, 144)
  geometry.rotateX(-Math.PI / 2)
  return geometry
}

/** Continuous 360° masonry, with genuine openings and no mismatched semicircles. */
export function circularWallGeometry(radius: number, height: number, centerZ: number, openings: CircularOpening[]) {
  const positions: number[] = [], uvs: number[] = []
  const halfAngle = (o: CircularOpening) => Math.asin(o.radius / radius)
  const boundaries = [-Math.PI, Math.PI, ...openings.flatMap(o => [wrap(o.angle - halfAngle(o)), wrap(o.angle + halfAngle(o))])].sort((a, b) => a - b)
  const quad = (a: number, b: number, loA: number, loB: number, hiA: number, hiB: number) => {
    const points = [[Math.sin(a) * radius, loA, centerZ - Math.cos(a) * radius], [Math.sin(b) * radius, loB, centerZ - Math.cos(b) * radius], [Math.sin(b) * radius, hiB, centerZ - Math.cos(b) * radius], [Math.sin(a) * radius, hiA, centerZ - Math.cos(a) * radius]]
    for (const i of [0, 1, 2, 0, 2, 3]) { positions.push(...points[i]); uvs.push((i === 0 || i === 3 ? a : b) / (Math.PI * 2) + .5, points[i][1] / height) }
  }
  for (let i = 0; i < boundaries.length - 1; i++) {
    const start = boundaries[i], end = boundaries[i + 1]
    if (end - start < 1e-8) continue
    const holes = openings.filter(o => Math.abs(wrap((start + end) / 2 - o.angle)) < halfAngle(o)).sort((a, b) => a.floor - b.floor)
    const segments = Math.max(1, Math.ceil((end - start) * 120))
    for (let j = 0; j < segments; j++) {
      const a = start + (end - start) * j / segments, b = start + (end - start) * (j + 1) / segments
      let loA = 0, loB = 0
      for (const hole of holes) {
        if (hole.floor > loA) quad(a, b, loA, loB, hole.floor, hole.floor)
        const top = (angle: number) => hole.floor + hole.spring + Math.sqrt(Math.max(0, hole.radius ** 2 - (Math.sin(wrap(angle - hole.angle)) * radius) ** 2))
        loA = top(a); loB = top(b)
      }
      if (loA < height || loB < height) quad(a, b, loA, loB, height, height)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geometry.computeVertexNormals()
  return geometry
}
export function portalWallGeometry(width: number, height: number, radius: number, spring: number, depth = .45) {
  const s = new THREE.Shape(), half = width / 2
  s.moveTo(-half, 0); s.lineTo(-half, height); s.lineTo(half, height); s.lineTo(half, 0)
  s.lineTo(radius, 0); s.lineTo(radius, spring); s.absarc(0, spring, radius, 0, Math.PI, false); s.lineTo(-radius, 0); s.closePath()
  return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 48 })
}
export function portalOpeningGeometry(radius: number, spring: number) {
  const s = new THREE.Shape(); s.moveTo(-radius, 0); s.lineTo(radius, 0); s.lineTo(radius, spring); s.absarc(0, spring, radius, 0, Math.PI, false); s.lineTo(-radius, 0); s.closePath()
  return new THREE.ShapeGeometry(s)
}
