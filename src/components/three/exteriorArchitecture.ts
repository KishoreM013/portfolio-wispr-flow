import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

export const EXTERIOR = {
  halfWidth: 22,
  floor: 2,
  wallFront: 1.6,
  columnFront: 3.15,
  columnTop: 11.65,
  pedimentBase: 13.08,
  pedimentTop: 17.2,
  pedimentFront: 3.62,
  inscriptionFront: 3.68,
  wingFront: 0.3,
  gateZ: 13,
} as const
export const EXTERIOR_COLUMNS = [-10.2, -7.8, -5.4, -3, 3, 5.4, 7.8, 10.2]
export const EXTERIOR_WINDOWS = [-19.2, -15.8, -12.4, 12.4, 15.8, 19.2]
export type ExteriorFinish = 'masonry' | 'stone' | 'trim' | 'shadow' | 'bronze' | 'roof' | 'glass'
type V3 = [number, number, number]

/** Static ornaments share seven meshes, instead of a draw call for every stone. */
export class ArchitecturalGeometry {
  private parts = new Map<ExteriorFinish, THREE.BufferGeometry[]>()
  add(finish: ExteriorFinish, geometry: THREE.BufferGeometry, position: V3 = [0, 0, 0], rotation: V3 = [0, 0, 0], scale: V3 = [1, 1, 1]) {
    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(...position), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)), new THREE.Vector3(...scale))
    geometry.applyMatrix4(matrix)
    // Metre-based stone courses, independent of the size of a wall or moulding.
    if (finish === 'masonry') {
      const p = geometry.getAttribute('position'), n = geometry.getAttribute('normal'), uv = geometry.getAttribute('uv')
      for (let i = 0; i < p.count; i++) {
        const horizontal = Math.abs(n.getX(i)) > .5 ? p.getZ(i) : p.getX(i)
        uv.setXY(i, horizontal / 5.6, (Math.abs(n.getY(i)) > .5 ? p.getZ(i) : p.getY(i)) / 2.8)
      }
    }
    const group = this.parts.get(finish) ?? []
    group.push(geometry)
    this.parts.set(finish, group)
  }
  box(finish: ExteriorFinish, position: V3, size: V3, rotation: V3 = [0, 0, 0]) {
    this.add(finish, new THREE.BoxGeometry(...size), position, rotation)
  }
  sphere(finish: ExteriorFinish, position: V3, scale: V3, rotation: V3 = [0, 0, 0]) {
    this.add(finish, new THREE.SphereGeometry(1, 12, 8), position, rotation, scale)
  }
  ring(finish: ExteriorFinish, position: V3, radius: number, tube: number, rotation: V3 = [0, 0, 0], arc = Math.PI * 2) {
    this.add(finish, new THREE.TorusGeometry(radius, tube, 6, 40, arc), position, rotation)
  }
  beam(finish: ExteriorFinish, from: V3, to: V3, width: number, depth = width) {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to), vector = b.clone().sub(a)
    const geometry = new THREE.BoxGeometry(width, vector.length(), depth)
    geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vector.normalize()))
    this.add(finish, geometry, a.add(b).multiplyScalar(.5).toArray() as V3)
  }
  lathe(finish: ExteriorFinish, position: V3, profile: [number, number][], segments = 20, scale: V3 = [1, 1, 1]) {
    this.add(finish, new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments), position, [0, 0, 0], scale)
  }
  tube(finish: ExteriorFinish, points: THREE.Vector3[], radius = .035, segments = 36) {
    this.add(finish, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, 5, false))
  }
  finish() {
    const result = {} as Record<ExteriorFinish, THREE.BufferGeometry>
    for (const [key, parts] of this.parts) {
      // Extrusions use non-indexed attributes; normalize before merging.
      const normalized = parts.map(part => part.index ? part.toNonIndexed() : part)
      result[key] = mergeGeometries(normalized, false)!
      result[key].computeBoundingSphere()
      for (const part of new Set([...parts, ...normalized])) part.dispose()
    }
    return result
  }
}

export function archedWindowShape(radius: number, bottom: number, spring: number, x = 0) {
  const shape = new THREE.Shape()
  shape.moveTo(x - radius, bottom)
  shape.lineTo(x + radius, bottom)
  shape.lineTo(x + radius, spring)
  shape.absarc(x, spring, radius, 0, Math.PI, false)
  shape.closePath()
  return shape
}

function archStones(b: ArchitecturalGeometry, x: number, spring: number, z: number, radius: number, width: number, count = 17) {
  for (let i = 0; i < count; i++) {
    const start = i / count * Math.PI + .006, end = (i + 1) / count * Math.PI - .006
    const shape = new THREE.Shape()
    shape.absarc(0, 0, radius, start, end, false)
    shape.absarc(0, 0, radius + width, end, start, true)
    shape.closePath()
    b.add('trim', new THREE.ExtrudeGeometry(shape, { depth: .32, bevelEnabled: true, bevelThickness: .018, bevelSize: .012, bevelSegments: 1, curveSegments: 4 }), [x, spring, z])
  }
  b.box('trim', [x, spring + radius + width * .5, z + .22], [.34, width + .23, .36])
}

function flutedShaft(height: number, lite: boolean) {
  const geometry = new THREE.CylinderGeometry(.38, .47, height, lite ? 96 : 144, 8)
  const p = geometry.getAttribute('position')
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), radius = Math.hypot(x, z)
    if (!radius) continue
    const flute = .026 * Math.pow((1 + Math.cos(Math.atan2(z, x) * 24)) * .5, 1.3)
    const entasis = .025 * Math.sin((p.getY(i) / height + .5) * Math.PI)
    p.setXYZ(i, x / radius * (radius - flute + entasis), p.getY(i), z / radius * (radius - flute + entasis))
  }
  geometry.computeVertexNormals()
  return geometry
}

function column(b: ArchitecturalGeometry, x: number, lite: boolean) {
  const z = EXTERIOR.columnFront
  b.box('stone', [x, 2.14, z], [1.34, .28, 1.34])
  b.box('trim', [x, 2.35, z], [1.15, .14, 1.15])
  b.lathe('trim', [x, 2.42, z], [[.55, 0], [.57, .05], [.55, .13], [.45, .19], [.43, .25], [.51, .30], [.51, .36], [.47, .4]])
  b.add('stone', flutedShaft(7.92, lite), [x, 6.78, z])
  b.lathe('trim', [x, 10.7, z], [[.39, 0], [.43, .07], [.43, .14], [.4, .2], [.46, .35], [.59, .57], [.61, .64]])
  // Two carved acanthus tiers, with scrolls beneath the capital's abacus.
  for (const [radius, y, count] of [[.44, 10.94, 8], [.51, 11.19, 8]]) {
    for (let i = 0; i < count; i++) {
      const a = i / count * Math.PI * 2
      b.sphere('trim', [x + Math.sin(a) * radius, y, z + Math.cos(a) * radius], [.105, .24, .075], [Math.cos(a) * .26, a, -Math.sin(a) * .26])
    }
  }
  for (const side of [-1, 1]) {
    const points = Array.from({ length: 29 }, (_, i) => {
      const angle = i / 28 * Math.PI * 3.3, r = .17 * (1 - i / 32)
      return new THREE.Vector3(x + side * (.42 + Math.cos(angle) * r), 11.36 + Math.sin(angle) * r, z + .43)
    })
    b.tube('trim', points, .045, 28)
  }
  b.box('trim', [x, 11.51, z], [1.25, .28, 1.25])
}

function urn(b: ArchitecturalGeometry, x: number, y: number, z: number, scale = 1) {
  b.box('trim', [x, y + .09, z], [.7 * scale, .18 * scale, .7 * scale])
  b.lathe('stone', [x, y + .18 * scale, z], [[.26, 0], [.28, .1], [.19, .17], [.16, .34], [.31, .42], [.44, .7], [.41, .87], [.31, .94], [.32, 1.02], [.43, 1.07], [.43, 1.15], [.29, 1.22], [.08, 1.39], [0, 1.43]], 24, [scale, scale, scale])
  for (const side of [-1, 1]) b.ring('trim', [x + side * .39 * scale, y + .91 * scale, z], .18 * scale, .045 * scale)
}

function baluster(b: ArchitecturalGeometry, x: number, y: number, z: number, scale = 1) {
  b.lathe('stone', [x, y, z], [[.14, 0], [.14, .08], [.1, .12], [.07, .21], [.14, .34], [.15, .42], [.11, .51], [.065, .62], [.08, .73], [.13, .77], [.13, .84]], 12, [scale, scale, scale])
}

function wing(b: ArchitecturalGeometry, side: number) {
  const center = side * 16.6
  b.box('masonry', [center, 6.35, -6.5], [10.8, 8.7, 12])
  // Each front wall has three real arched apertures with deep shadowed reveals.
  const shape = new THREE.Shape()
  shape.moveTo(-5.4, 2); shape.lineTo(5.4, 2); shape.lineTo(5.4, 10.7); shape.lineTo(-5.4, 10.7); shape.closePath()
  const windows = EXTERIOR_WINDOWS.filter(x => Math.sign(x) === side)
  for (const x of windows) {
    const opening = archedWindowShape(1.02, 4.12, 7.46, x - center)
    shape.holes.push(new THREE.Path(opening.getPoints(32).reverse()))
  }
  b.add('masonry', new THREE.ExtrudeGeometry(shape, { depth: .8, bevelEnabled: false, curveSegments: 20 }), [center, 0, -.5])
  for (const x of windows) {
    b.add('shadow', new THREE.ShapeGeometry(archedWindowShape(1.02, 4.12, 7.46)), [x, 0, -.44])
    b.add('glass', new THREE.ShapeGeometry(archedWindowShape(.88, 4.24, 7.46)), [x, 0, -.4])
    for (const dx of [-1.16, 1.16]) {
      b.box('trim', [x + dx, 5.79, .39], [.3, 3.34, .42])
      b.box('trim', [x + dx, 7.43, .46], [.43, .17, .54])
      b.box('trim', [x + dx, 4.22, .47], [.42, .22, .58])
    }
    archStones(b, x, 7.46, .19, 1.03, .34)
    b.box('trim', [x, 4.02, .4], [2.75, .22, .95])
    b.box('stone', [x, 3.82, .29], [2.4, .18, .57])
    // Mullions and fanlight tracery sit inside the reveal, behind the stone trim.
    for (const dx of [-.44, 0, .44]) b.box('bronze', [x + dx, 5.85, -.3], [.035, 3.22, .055])
    for (const y of [5.31, 6.38, 7.46]) b.box('bronze', [x, y, -.3], [1.8, .045, .055])
    for (let i = 1; i < 6; i++) {
      const a = i / 6 * Math.PI
      b.beam('bronze', [x, 7.46, -.3], [x + Math.cos(a) * .88, 7.46 + Math.sin(a) * .88, -.3], .025, .045)
    }
    b.ring('bronze', [x, 7.46, -.3], .38, .027, [0, 0, 0], Math.PI)
    // Recessed spandrel panel above each window.
    b.box('shadow', [x, 9.58, .32], [2.35, .66, .035])
    b.box('stone', [x, 9.58, .35], [2.18, .5, .07])
    for (let i = -3; i <= 3; i++) b.sphere('trim', [x + i * .23, 9.55 - .1 * Math.cos(i * .5), .42], [.13, .08, .045], [0, 0, i * -.18])
  }
  // Rusticated corner piers and horizontal courses give the façade real depth.
  for (const x of [side * 11.15, side * 14.1, side * 17.5, side * 21.35]) {
    for (let i = 0; i < 14; i++) b.box('stone', [x, 2.36 + i * .56, .41], [i % 2 ? .73 : .95, .525, .36])
    b.box('trim', [x, 10.37, .43], [1.13, .24, .66])
  }
  for (const [y, h, projection] of [[2.14, .28, .52], [3.67, .16, .56], [10.65, .18, .68], [10.94, .22, .93], [11.16, .17, 1.08]]) {
    b.box('trim', [center, y, -.02], [11, h, projection + .6])
  }
  for (let i = 0; i < 28; i++) b.box('trim', [center - 5.1 + i * .38, 10.76, .49], [.19, .19, .31])
  b.box('roof', [center, 10.78, -6.35], [10.8, .15, 12.3])
  // A complete roof parapet, including the returns at each end.
  for (const y of [11.36, 12.34]) b.box('trim', [center, y, .12], [11.2, .18, .65])
  for (let i = 0; i < 25; i++) baluster(b, center - 5.1 + i * .425, 11.45, .12)
  for (const x of [center - 5.25, center, center + 5.25]) {
    b.box('stone', [x, 11.84, .12], [.58, .88, .65])
    b.box('trim', [x, 12.35, .12], [.78, .18, .82])
    urn(b, x, 12.44, .12, .73)
  }
  for (const z of [-2, -4, -6, -8, -10, -12]) {
    b.box('stone', [side * 21.85, 11.84, z], [.5, .88, .5])
  }
  for (const y of [11.36, 12.34]) b.box('trim', [side * 21.85, y, -6], [.65, .18, 12.5])
}

function pediment(b: ArchitecturalGeometry) {
  const { pedimentBase: base, pedimentTop: top } = EXTERIOR
  const shape = new THREE.Shape()
  shape.moveTo(-11.7, base); shape.lineTo(11.7, base); shape.lineTo(0, top); shape.closePath()
  b.add('stone', new THREE.ExtrudeGeometry(shape, { depth: 4.2, bevelEnabled: false }), [0, 0, -.8])
  for (const side of [-1, 1]) {
    b.beam('trim', [side * 11.9, base, 3.53], [0, top + .1, 3.53], .3, .62)
    b.beam('trim', [side * 11.32, base + .08, 3.72], [0, top - .18, 3.72], .11, .12)
    for (let i = 0; i < 26; i++) {
      const t = (i + .5) / 26
      b.box('trim', [side * 11.35 * (1 - t), base + (top - base - .24) * t - .12, 3.48], [.17, .15, .25], [0, 0, -side * Math.atan2(top - base, 11.7)])
    }
  }
  b.box('trim', [0, base + .03, 3.41], [24.1, .24, .85])
  b.box('trim', [0, base + .19, 3.56], [23.1, .13, .42])
  // Raised laurel cartouche, flanked by reliefs of a book and an armillary globe.
  b.add('trim', new THREE.CylinderGeometry(1.08, 1.08, .16, 64), [0, 14.68, 3.52], [Math.PI / 2, 0, 0])
  b.ring('bronze', [0, 14.68, 3.65], 1.12, .045)
  for (const side of [-1, 1]) {
    const stem: THREE.Vector3[] = []
    for (let i = 0; i < 13; i++) {
      const a = -1.3 + i / 12 * 2.5
      const x = side * Math.cos(a) * 1.48, y = 14.68 + Math.sin(a) * 1.45
      stem.push(new THREE.Vector3(x, y, 3.56))
      for (const leaf of [-1, 1]) b.sphere('trim', [x + side * leaf * .1, y + .02, 3.61], [.115, .24, .07], [0, 0, -side * (a + leaf * .6)])
    }
    b.tube('trim', stem, .045)
    // Low curling foliage fills the corners without exceeding the sloped roof.
    for (let i = 0; i < 17; i++) {
      const x = side * (2.2 + i * .38), y = 13.55 + .28 * Math.sin(i * .6)
      b.sphere('trim', [x, y, 3.52], [.26, .1, .07], [0, 0, side * Math.cos(i * .6) * .38])
    }
  }
  for (const side of [-1, 1]) {
    b.box('trim', [-3.65 + side * .42, 14.25, 3.59], [.8, 1.03, .15], [0, side * -.12, side * -.1])
    for (let i = 0; i < 5; i++) b.box('stone', [-3.65 + side * .42, 13.95 + i * .16, 3.69], [.6, .025, .045], [0, 0, side * -.1])
  }
  b.ring('trim', [3.65, 14.25, 3.59], .64, .055)
  b.ring('trim', [3.65, 14.25, 3.59], .64, .045, [0, Math.PI / 3, 0])
  b.ring('trim', [3.65, 14.25, 3.59], .64, .04, [Math.PI / 3, 0, .3])
  b.box('trim', [3.65, 13.55, 3.58], [1.1, .13, .24])
  // Stone anthemion at the apex and small corner acroteria.
  for (const [x, y, scale] of [[0, top + .1, .9], [-11.55, base + .18, .55], [11.55, base + .18, .55]]) {
    b.box('trim', [x, y + .08, 3.4], [.75 * scale, .16, .6])
    for (let i = -3; i <= 3; i++) {
      const a = i * .29
      b.sphere('trim', [x + Math.sin(a) * .45 * scale, y + .35 + Math.cos(a) * .3 * scale, 3.4], [.085 * scale, .4 * scale, .08], [0, 0, -a])
    }
  }
}

function stair(b: ArchitecturalGeometry) {
  for (let i = 0; i < 10; i++) {
    const top = (i + 1) * .2, z = 9.65 - i * .6, width = 26 - i * .22
    b.box('stone', [0, top / 2, z], [width, top, .61])
    b.box('trim', [0, top - .025, z + .28], [width + .05, .06, .09])
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < 10; i++) {
      const z = 9.65 - i * .6, top = (i + 1) * .2
      b.box('stone', [side * 11.55, top + .14, z], [.68, .28, .62])
      baluster(b, side * 11.55, top + .28, z)
    }
    b.beam('trim', [side * 11.55, 1.38, 9.95], [side * 11.55, 3.38, 3.95], .25, .8)
    for (const [z, y] of [[9.8, .2], [3.95, 2]]) {
      b.box('stone', [side * 11.55, y + .6, z], [.94, 1.2, .94])
      b.box('trim', [side * 11.55, y + 1.26, z], [1.1, .14, 1.1])
      urn(b, side * 11.55, y + 1.33, z, .8)
    }
  }
  // A portico landing meets the highest tread without a gap.
  b.box('trim', [0, 1.94, 2.0], [23.2, .12, 4.1])
}

export function buildExteriorGeometry(lite = false) {
  const b = new ArchitecturalGeometry()
  b.box('masonry', [0, .96, -4.2], [44.6, 1.92, 16.4])
  b.box('trim', [0, 1.99, -4.2], [44.9, .14, 16.7])
  for (const side of [-1, 1]) {
    b.box('masonry', [side * 6.725, 6.8, -5.5], [8.95, 9.6, 14.2])
    wing(b, side)
  }
  // Lintel and spandrels above the open central entrance; no solid wall across the doors.
  const front = new THREE.Shape()
  front.moveTo(-2.25, 11.65); front.lineTo(2.25, 11.65); front.lineTo(2.25, 7.45)
  front.absarc(0, 7.45, 2.25, 0, Math.PI, false); front.closePath()
  b.add('masonry', new THREE.ExtrudeGeometry(front, { depth: .6, bevelEnabled: false, curveSegments: 32 }), [0, 0, 1])
  b.box('masonry', [0, 10.71, -5.5], [4.5, 1.88, 14.2])
  for (const x of [-2.5, 2.5]) {
    b.box('trim', [x, 4.76, 1.95], [.5, 5.52, .9])
    b.box('trim', [x, 2.18, 2.02], [.7, .36, 1.04])
    b.box('trim', [x, 7.4, 2.02], [.76, .25, 1.05])
  }
  archStones(b, 0, 7.45, 1.99, 2.25, .5, 23)
  const fan = new THREE.Shape()
  fan.moveTo(-2.18, 7.45); fan.lineTo(2.18, 7.45); fan.absarc(0, 7.45, 2.18, 0, Math.PI, false); fan.closePath()
  b.add('glass', new THREE.ShapeGeometry(fan), [0, 0, 1.93])
  for (let i = 1; i < 10; i++) {
    const a = i / 10 * Math.PI
    b.beam('bronze', [0, 7.45, 2.01], [Math.cos(a) * 2.18, 7.45 + Math.sin(a) * 2.18, 2.01], .035, .07)
  }
  for (const r of [.65, 1.4, 2.18]) b.ring('bronze', [0, 7.45, 2.01], r, .04, [0, 0, 0], Math.PI)
  EXTERIOR_COLUMNS.forEach(x => column(b, x, lite))
  // Continuous load-bearing entablature and deeply coffered porch ceiling.
  for (const [y, h, width, depth] of [[11.72, .14, 22.9, 4.3], [11.91, .24, 23.05, 4.5], [12.39, .72, 22.8, 4.3], [12.83, .16, 23.15, 4.65], [13.01, .2, 23.65, 4.9]]) {
    b.box('trim', [0, y, 1.28], [width, h, depth])
  }
  for (let i = 0; i < 58; i++) b.box('trim', [-11.1 + i * .39, 12.76, 3.53], [.18, .18, .34])
  b.box('shadow', [0, 11.62, 1.27], [21.5, .05, 3.3])
  for (let i = 0; i < 13; i++) {
    const x = -10.1 + i * 1.68
    b.box('trim', [x, 11.52, 1.27], [.13, .2, 3.3])
    for (const z of [.45, 2.1]) {
      b.box('stone', [x + .76, 11.6, z], [1.3, .1, 1.3])
      b.sphere('trim', [x + .76, 11.49, z], [.16, .06, .16])
    }
  }
  for (const z of [-.3, 1.28, 2.93]) b.box('trim', [0, 11.52, z], [21.5, .2, .13])
  pediment(b)
  stair(b)
  return b.finish()
}

/** Fit the whole elevation on wide screens; keep the central portico legible on phones. */
export function exteriorCameraStart(aspect: number, fov: number) {
  const width = aspect < .8 ? 28 : 49
  const distance = width / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)) * aspect)
  return new THREE.Vector3(0, 5.4, Math.max(37, distance + 3.8))
}

export function exteriorCameraRoute(aspect: number, fov: number) {
  const start = exteriorCameraStart(aspect, fov)
  return new THREE.CatmullRomCurve3([
    start, new THREE.Vector3(0, 4.8, Math.max(28, start.z * .72)), new THREE.Vector3(0, 3.8, 21),
    new THREE.Vector3(0, 3.5, 14), new THREE.Vector3(0, 4.3, 9.5), new THREE.Vector3(0, 4.8, 6.2),
  ])
}
