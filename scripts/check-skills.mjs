import assert from 'node:assert/strict'
import * as THREE from 'three'
import { readFile } from 'node:fs/promises'
import { ratingOrbit, skillOrbitAngle, skillsWalkPosition, SKILLS_ROOM_RADIUS, SKILLS_WALK_RADIUS, SKILLS_SYSTEM_HEIGHT, SKILLS_DOME_SPRING, SKILLS_DOME_RISE, SKILLS_DEFAULT_PITCH, skillBubbleScale, skillDomePoint } from '../src/components/three/skillsRoomLayout.ts'
import { skills } from '../src/data/skills.ts'
for (let stars = 1; stars <= 5; stars++) {
  assert.ok(ratingOrbit(stars) + 1 < SKILLS_WALK_RADIUS, 'Orbit must stay clear of the visitor walkway')
  if (stars < 5) assert.ok(ratingOrbit(stars) > ratingOrbit(stars + 1), 'Higher proficiency belongs closer to the sun')
  const peers = skills.filter(s => s.stars === stars)
  const angles = peers.map((_, i) => skillOrbitAngle(i, peers.length, stars))
  assert.equal(new Set(angles).size, peers.length, 'Skills of the same level occupy distinct positions')
  if (peers.length > 1) assert.ok(2 * ratingOrbit(stars) * Math.sin(Math.PI / peers.length) > .38, 'Skill planets must not intersect')
}
for (let angle = -30; angle <= 30; angle += .01) {
  const [x, y, z] = skillsWalkPosition(angle)
  assert.ok([x, y, z].every(Number.isFinite))
  assert.ok(Math.abs(Math.hypot(x, z) - SKILLS_WALK_RADIUS) < 1e-8)
  assert.ok(Math.hypot(x, z) < SKILLS_ROOM_RADIUS - 2, 'Camera stays safely inside the circular room')
}
const scene = await readFile(new URL('../src/components/three/PlanetariumScene.tsx', import.meta.url), 'utf8')
assert.ok(!scene.includes('<Html'), 'Planet labels must respect scene depth')
assert.ok(scene.includes('paused || reduced || mobile'), 'Reduced-motion and phone presentations must be static')
console.log('Skills room checks passed: orbit/rating mapping, planet spacing, circular walkway clearance, depth-aware labels and static phone/reduced-motion modes.')

assert.ok(SKILLS_ROOM_RADIUS * 2 >= 40, 'The planetarium must retain its grand-hall proportions')
assert.ok(SKILLS_SYSTEM_HEIGHT < 2, 'The planetary display must remain lowered')
assert.ok(SKILLS_SYSTEM_HEIGHT - .48 - .28 > .18, 'Planet labels stay above the low exhibition stage')
for (const mobile of [false, true]) for (let angle = -10; angle < 10; angle += .1) {
  const [x, y, z] = skillsWalkPosition(angle, mobile)
  assert.ok(y > SKILLS_SYSTEM_HEIGHT + 1, 'Visitor viewpoint stays above the planets to separate near and far orbits')
  assert.ok(Math.hypot(x, z) < SKILLS_ROOM_RADIUS - 2, 'Both phone and desktop viewpoints retain wall clearance')
}
console.log('Grand-hall layout checks passed: lowered installation, clear labels, elevated view and phone/desktop wall clearance.')

assert.ok(skillBubbleScale(true, false) > skillBubbleScale(false, true))
assert.ok(skillBubbleScale(false, true) > skillBubbleScale(false, false))
assert.equal(skillBubbleScale(false, false), 1)
assert.ok(SKILLS_SYSTEM_HEIGHT - .19 * skillBubbleScale(true, false) > .18, 'Expanded sphere clears the marble stage')
assert.ok(SKILLS_SYSTEM_HEIGHT - .48 - (skillBubbleScale(true, false) - 1) * .22 - .28 > .18, 'Expanded label clears the stage')
for (const mobile of [false, true]) {
  const camera = new THREE.PerspectiveCamera(mobile ? 78 : 70, mobile ? 390 / 844 : 1440 / 900, .1, 110)
  camera.position.set(...skillsWalkPosition(0, mobile))
  camera.lookAt(0, camera.position.y + Math.sin(SKILLS_DEFAULT_PITCH) * 12, camera.position.z - Math.cos(SKILLS_DEFAULT_PITCH) * 12)
  camera.updateMatrixWorld()
  const roof = new THREE.Vector3(...skillDomePoint(Math.PI, .7)).project(camera)
  assert.ok(Math.abs(roof.x) < 1 && roof.y > -.8 && roof.y < .8 && roof.z < 1, 'Architectural roof is in the initial view on phone and desktop')
  for (let angle = -Math.PI * 2; angle <= Math.PI * 2; angle += .05) {
    const position = skillsWalkPosition(angle, mobile)
    assert.ok(position[1] < SKILLS_DOME_SPRING, 'Circular walk stays below the roof and cornice')
  }
}
assert.ok(SKILLS_DOME_RISE > 0 && SKILLS_DOME_SPRING > 7)
console.log('Roof and hover checks passed: visible ceiling framing on phone/desktop, bounded circular walk and enlarged bubble/label floor clearance.')
