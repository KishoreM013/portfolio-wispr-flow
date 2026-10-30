import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import * as THREE from 'three'
import { exhibitPlacement, clampGalleryProgress, maxGalleryProgress, galleryCameraZ, focusAtProgress, galleryEndZ, EXHIBIT_FRAME_DEPTH, EXHIBIT_ARTWORK_OFFSET } from '../src/components/three/galleryNavigation.ts'

for (let count = 0; count <= 30; count++) {
  const max = maxGalleryProgress(count)
  assert.equal(clampGalleryProgress(-100, count), 0)
  assert.equal(clampGalleryProgress(100, count), max)
  assert.ok(max > 0, 'Every gallery permits walking to the portrait alcove')
  assert.ok(Math.abs(galleryCameraZ(max) - (galleryEndZ(count) - .2)) < 1e-8, 'Scroll endpoint reaches the portrait chamber')
  assert.ok(galleryCameraZ(max) - (galleryEndZ(count) - 7.27) > 6, 'Camera stops safely in front of the portrait')
  for (let i = 0; i < count; i++) {
    const { side, z } = exhibitPlacement(i)
    assert.equal(side, i % 2 ? 1 : -1)
    const stop = Math.floor(i / 2)
    assert.ok(galleryCameraZ(stop) > z + 6, 'Camera remains in front of displays')
    if (i % 2) assert.equal(z, exhibitPlacement(i - 1).z, 'One exhibit on each wall at a paired stop')
    if (i >= 2) assert.equal(exhibitPlacement(i - 2).z - z, 7, 'Display pairs have consistent aisle spacing')
  }
  for (let p = -2; p < max + 2; p += .05) for (const side of [0, 1]) {
    const index = focusAtProgress(p, count, side)
    assert.ok(index >= 0 && index <= Math.max(0, count - 1), 'Scrolling cannot select a missing exhibit')
  }
}
console.log('Gallery checks passed: alternating walls, paired placement, spacing, scroll bounds, odd/empty collections and camera clearance.')

// Regression for blank brass exhibits: a visitor ray must hit the image first.
for (let index = 0; index < 12; index++) {
  const placement = exhibitPlacement(index)
  const group = new THREE.Group()
  group.position.set(placement.side * 7.65, 3.5, placement.z)
  group.rotation.y = placement.rotation
  const backing = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.2, EXHIBIT_FRAME_DEPTH), new THREE.MeshBasicMaterial())
  const artwork = new THREE.Mesh(new THREE.PlaneGeometry(4.95, 3.85), new THREE.MeshBasicMaterial())
  artwork.position.z = EXHIBIT_ARTWORK_OFFSET
  group.add(backing, artwork); group.updateMatrixWorld(true)
  const target = artwork.getWorldPosition(new THREE.Vector3())
  const origin = new THREE.Vector3(0, 3.5, placement.z + 6)
  const raycaster = new THREE.Raycaster(origin, target.clone().sub(origin).normalize())
  const hits = raycaster.intersectObjects([backing, artwork])
  assert.equal(hits[0]?.object, artwork, `Exhibit ${index}: artwork must not be hidden by the brass backing`)
  backing.geometry.dispose(); backing.material.dispose(); artwork.geometry.dispose(); artwork.material.dispose()
}
console.log('Artwork visibility regression passed: image is in front of its backing on both walls at every tested display position.')

// Keep the curator portrait in the end alcove; gallery frames must always use exhibit artwork.
const galleryScene = await readFile(new URL('../src/components/three/GalleryScene.tsx', import.meta.url), 'utf8')
const basementScene = await readFile(new URL('../src/components/three/BasementScene.tsx', import.meta.url), 'utf8')
const roomPage = await readFile(new URL('../src/pages/RoomPage.tsx', import.meta.url), 'utf8')
const portraitAlcove = await readFile(new URL('../src/components/three/PortraitAlcove.tsx', import.meta.url), 'utf8')
assert.ok(galleryScene.includes('texture={generatedTexture}') && !galleryScene.includes('portraitPath'), 'Gallery displays always show artwork generated from the selected exhibit')
assert.ok(basementScene.includes('texture={artwork[index]}') && !basementScene.includes('portraitPath'), 'Basement displays always show their exhibit artwork')
assert.ok(!roomPage.includes('personalPortraits'), 'Room navigation does not inject portraits into exhibit frames')
assert.ok(portraitAlcove.includes("/images/kishore-portrait.jpeg"), 'The curator portrait remains in the final gallery alcove')
console.log('Portrait placement regression passed: project and room art stays in exhibit frames; the personal portrait remains at the gallery end.')
