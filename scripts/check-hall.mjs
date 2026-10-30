import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import * as THREE from 'three'
import { boardMount, constrainGroundPosition, constrainUpperPosition, createHallRoute, orbitLookTarget, sideStairRailPosition, stairHeight, UPPER_INNER_RADIUS, UPPER_OUTER_RADIUS, HALL_RADIUS, STAIR_WALK_RADIUS, STAIR_RAIL_HEIGHT, STAIR_RAIL_POST_COUNT, GALLERY_FLOOR } from '../src/components/three/hallNavigation.ts'

// Explore beyond each edge and ensure the camera remains on the balcony annulus.
for (let x = -30; x <= 30; x += 1) for (let z = -30; z <= 30; z += 1) {
  const position = constrainUpperPosition(new THREE.Vector3(x, 0, z))
  const radius = Math.hypot(position.x, 3 - position.z)
  assert.ok(radius >= UPPER_INNER_RADIUS - 1e-8 && radius <= UPPER_OUTER_RADIUS + 1e-8)
  assert.equal(position.y, 6.9)
  assert.ok(Math.abs(Math.atan2(position.x, 3 - position.z)) <= 1.35 + 1e-8)
}
// Entire plaque (including its brass backing) stays inside the curved wall.
for (const arch of [-.94, -.44, .44, .94]) {
  const mount = boardMount(arch, Math.sign(arch))
  const transform = new THREE.Matrix4().compose(new THREE.Vector3(...mount.position), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -mount.angle, 0)), new THREE.Vector3(1, 1, 1))
  for (const x of [-1.325, 1.325]) for (const z of [-.06, .06]) {
    const point = new THREE.Vector3(x, 0, z).applyMatrix4(transform)
    assert.ok(Math.hypot(point.x, 3 - point.z) < HALL_RADIUS, 'Board must not intersect the wall')
  }
}
const route = createHallRoute()
for (let i = 0; i <= 1000; i++) {
  const point = route.getPointAt(i / 1000)
  assert.ok([point.x, point.y, point.z].every(Number.isFinite))
  assert.ok(Math.hypot(point.x, point.z - 5) > 2.6, 'Route must clear the statue')
}
const sideStairSamples = Array.from({ length: 1001 }, (_, i) => route.getPointAt(i / 1000))
  .filter(point => point.y > 2.2 && Math.hypot(point.x, 3 - point.z) > STAIR_WALK_RADIUS - 1)
assert.ok(sideStairSamples.length > 10, 'Route must use the mirrored side stairs')
assert.equal(stairHeight(-23.2), 5.2)
assert.equal(stairHeight(5), 0)
for (const start of [[0, 2, 5], [.2, 2, 5.1], [1, 2, 4]]) {
  const position = constrainGroundPosition(new THREE.Vector3(...start))
  assert.ok(Math.hypot(position.x, position.z - 5) >= 2.6 - 1e-8)
}
const scene = await readFile(new URL('../src/components/three/HallScene.tsx', import.meta.url), 'utf8')
assert.ok(!scene.includes('<Html'), 'Hall signs must use scene depth rather than overlay HTML')
assert.ok(scene.includes('window.location.assign(room.path)'), 'Gallery boards must navigate')
console.log('Hall regression checks passed: balcony boundaries, wall-mounted boards, stair/ statue clearance, depth-tested labels and navigation.')
// The guided scroll tour visits the statue, five lower galleries, the east stair,
// five upper galleries, and terminates on the left side of the balcony.
const galleryStops = route.stops.filter(stop => stop.id.startsWith('room-'))
assert.equal(galleryStops.length, 10, 'The tour includes all five ground-floor and five upper-floor galleries')
assert.deepEqual(galleryStops.map(stop => stop.roomIndex), Array.from({ length: 10 }, (_, i) => i), 'Gallery visits remain in collection order')
assert.ok(galleryStops.every((stop, i) => stop.progress > (galleryStops[i - 1]?.progress ?? -1)), 'Each scroll stop advances along the circular tour')
for (const stop of [...route.stops.filter(stop => stop.view === 'stairs'), route.stops.find(stop => stop.id === 'upper')]) {
  const sample = route.sample(stop.progress)
  assert.ok(sample.position.distanceTo(stop.position) < 1e-7, `${stop.id} landing meets the actual route`)
}
const topOfEastStair = route.points.findLast(point => Math.hypot(point.x, 3 - point.z) <= STAIR_WALK_RADIUS + .01 && Math.abs(Math.atan2(point.x, 3 - point.z) - Math.PI / 2) < .03)
assert.ok(topOfEastStair && Math.abs(topOfEastStair.y - 6.9) < .1, 'The side staircase meets the 5.2m upper-floor walking surface')
assert.ok(scene.includes('Guardrail start={-Math.PI / 2} end={Math.PI / 2}'), 'The balustrade follows the perimeter instead of crossing the rotunda')
assert.ok(scene.includes('scroll.current.active = true') && scene.includes('heading.current.yaw -= dx * .004'), 'Pointer drag rotates the free camera through a full turn')
assert.ok(scene.includes('[-2.03, 2.03].map(offset =>'), 'Both curved stair flights have continuous inner and outer handrails')
assert.ok(!scene.includes('start={-1.38} length={2.76}') && !scene.includes('length: 48'), 'Only one balustrade is drawn along the upper slab edge')
for (const offset of [-2.03, 2.03]) for (const progress of [0, .25, .5, .75, 1]) {
  const left = sideStairRailPosition(-1, offset, progress)
  const right = sideStairRailPosition(1, offset, progress)
  assert.ok(Math.abs(left.x + right.x) < 1e-8 && Math.abs(left.z - right.z) < 1e-8, 'Stair rails mirror across the rotunda')
  assert.ok(Math.abs(left.y - right.y) < 1e-8, 'Stair rails rise evenly on both flights')
  if (progress === 1) assert.ok(Math.abs(left.y - (GALLERY_FLOOR + STAIR_RAIL_HEIGHT)) < 1e-8, 'Both stair handrails meet the upper gallery rail height')
}
assert.ok(STAIR_RAIL_POST_COUNT >= 20, 'Stair balusters stay closely spaced along the long flight')
const gallery = await readFile(new URL('../src/components/three/GalleryScene.tsx', import.meta.url), 'utf8')
assert.ok(gallery.includes('position={[side * 7.12, 4.45, z + 3.5]}'), 'Wall sconces sit between adjacent picture bays')
assert.ok(gallery.includes('{!lite && <pointLight position={[side * -.16, .38, .16]}'), 'Sconce lights are disabled in low-memory mode')
console.log('Tour and stair checks passed: all ten galleries, ordered camera stops, upper landing, clear central rotunda, both handrails and picture sconces.')

// Free-look remains stable while the tour moves: yaw/pitch are applied from a fresh route bearing, never from the previous rendered target.
const cameraPosition = new THREE.Vector3(6, 4, 10), tourBearing = new THREE.Vector3(-4, 7, -12)
const firstLook = orbitLookTarget(cameraPosition, tourBearing, .62, .31)
const secondLook = orbitLookTarget(cameraPosition, tourBearing, .62, .31)
assert.ok(firstLook.distanceTo(secondLook) < 1e-12, 'Repeated camera frames do not accumulate yaw or shake')
assert.ok(orbitLookTarget(cameraPosition, tourBearing, 0, .15).distanceTo(tourBearing) < 1e-12, 'The tour bearing is unchanged at neutral look')
