import assert from 'node:assert/strict'
import * as THREE from 'three'
import { circularWallGeometry, portalWallGeometry, portalOpeningGeometry } from '../src/components/three/museumArchitecture.ts'
import { HALL_RADIUS, HALL_CENTER_Z, HALL_WALL_HEIGHT, HALL_BALCONY_INNER, HALL_STAIR_FIRST_Z, HALL_STAIR_DEPTH, createHallRoute, UPPER_INNER_RADIUS, UPPER_OUTER_RADIUS } from '../src/components/three/hallNavigation.ts'
import { GALLERY_ENTRANCE_Z } from '../src/components/three/galleryNavigation.ts'
const angles = [-.94, -.44, .44, .94]
const geometry = circularWallGeometry(HALL_RADIUS, HALL_WALL_HEIGHT, HALL_CENTER_Z, [...angles.flatMap(angle => [0, 5.2].map(floor => ({ angle, floor, radius: 1.62, spring: 2.65 }))), { angle: Math.PI, floor: 0, radius: 2.6, spring: 4.2 }])
const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
const wall = new THREE.Mesh(geometry, material); wall.updateMatrixWorld(true)
const ray = new THREE.Raycaster()
const fire = (angle, y) => { ray.set(new THREE.Vector3(0, y, HALL_CENTER_Z), new THREE.Vector3(Math.sin(angle), 0, -Math.cos(angle))); return ray.intersectObject(wall) }
for (let i = 0; i < 720; i++) {
  const angle = (i + .37) / 720 * Math.PI * 2
  const hits = fire(angle, 10.8)
  assert.ok(hits.length, `Missing wall at angle ${angle}`)
  assert.ok(Math.abs(hits[0].distance - HALL_RADIUS) < .003, 'Every wall sector shares one radius')
}
for (const angle of angles) for (const y of [1, 6.5]) assert.equal(fire(angle, y).length, 0, 'Both gallery floors retain their open arches')
assert.equal(fire(Math.PI, 1).length, 0, 'The entrance is a genuine opening in the shell')
assert.ok(fire(.44, 4.8).length, 'Masonry fills the spandrel between floors')
// Rays just above the wall must hit the matching dome, in every direction.
const roof = new THREE.Mesh(new THREE.SphereGeometry(HALL_RADIUS, 112, 40, 0, Math.PI * 2, 0, Math.PI / 2), material)
roof.scale.y = 10.5 / HALL_RADIUS; roof.position.set(0, HALL_WALL_HEIGHT, HALL_CENTER_Z); roof.updateMatrixWorld(true)
const pitch = Math.atan((HALL_WALL_HEIGHT + .3 - 4.1) / HALL_RADIUS)
for (let i = 0; i < 180; i++) {
  const a = i / 180 * Math.PI * 2
  ray.set(new THREE.Vector3(0, 4.1, HALL_CENTER_Z), new THREE.Vector3(Math.sin(a) * Math.cos(pitch), Math.sin(pitch), -Math.cos(a) * Math.cos(pitch)))
  assert.ok(ray.intersectObject(roof).length, 'Dome closes the full perimeter above the walls')
}
const lastTreadBack = HALL_STAIR_FIRST_Z - 25 * HALL_STAIR_DEPTH - HALL_STAIR_DEPTH / 2
assert.ok(Math.abs(lastTreadBack - (HALL_CENTER_Z - HALL_BALCONY_INNER)) < 1e-8, 'Staircase must meet the upper gallery without a gap')
const arrival = createHallRoute().getPointAt(0), landing = createHallRoute().getPointAt(1)
assert.ok(arrival.z < HALL_CENTER_Z + HALL_RADIUS - 3)
assert.ok(GALLERY_ENTRANCE_Z - 11 >= 7, 'Room entrance is far enough behind the starting view to be seen when turning around')
const landingRadius = Math.hypot(landing.x, HALL_CENTER_Z - landing.z)
assert.ok(landingRadius >= UPPER_INNER_RADIUS && landingRadius <= UPPER_OUTER_RADIUS)
for (const config of [{ width: 16, height: 14, spring: 3.4 }, { width: 12, height: 11.6, spring: 4.2 }]) {
  const portal = new THREE.Mesh(portalWallGeometry(config.width, config.height, 2.6, config.spring), material)
  portal.updateMatrixWorld(true)
  ray.set(new THREE.Vector3(0, 1, 3), new THREE.Vector3(0, 0, -1))
  assert.equal(ray.intersectObject(portal).length, 0, 'Return arch must be open')
  ray.set(new THREE.Vector3(4, 1, 3), new THREE.Vector3(0, 0, -1))
  assert.ok(ray.intersectObject(portal).length, 'Side masonry must close the room')
  const trigger = new THREE.Mesh(portalOpeningGeometry(2.6, config.spring), material); trigger.updateMatrixWorld(true)
  ray.set(new THREE.Vector3(0, 1, 3), new THREE.Vector3(0, 0, -1))
  assert.ok(ray.intersectObject(trigger).length, 'The entrance aperture has a clickable navigation surface')
  portal.geometry.dispose(); trigger.geometry.dispose()
}
geometry.dispose(); roof.geometry.dispose(); material.dispose()
console.log('Museum structure checks passed: 360° walls, matching roof, ten arch openings, entrance apertures, stair landing and click surfaces.')
