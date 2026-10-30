import * as THREE from 'three'
import { createStoneTexture } from './textures'

function canvasTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export function createExteriorTextures() {
  const grain = document.createElement('canvas')
  grain.width = grain.height = 512
  const g = grain.getContext('2d')!
  g.fillStyle = '#ded7c8'
  g.fillRect(0, 0, 512, 512)
  // Deterministic limestone grain: no stretched masonry pattern on carved trim.
  let seed = 1892
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
  for (let i = 0; i < 16000; i++) {
    const shade = random() > .6 ? '255,251,237' : '92,80,60'
    g.fillStyle = `rgba(${shade},${random() * .12})`
    const size = .3 + random() * 1.5
    g.fillRect(random() * 512, random() * 512, size, size)
  }
  // Very faint mineral streaks provide age without making the stone look tiled.
  for (let i = 0; i < 80; i++) {
    const x = random() * 512, y = random() * 512
    const wash = g.createRadialGradient(x, y, 0, x, y, 30 + random() * 60)
    wash.addColorStop(0, 'rgba(123,107,79,.025)'); wash.addColorStop(1, 'rgba(123,107,79,0)')
    g.fillStyle = wash; g.fillRect(0, 0, 512, 512)
  }
  const limestone = canvasTexture(grain)
  limestone.wrapS = limestone.wrapT = THREE.RepeatWrapping
  const masonry = createStoneTexture(1, 1, '#c4b9a2')

  const inscription = document.createElement('canvas')
  inscription.width = 2048; inscription.height = 128
  const text = inscription.getContext('2d')!
  text.textAlign = 'center'; text.textBaseline = 'middle'
  text.font = '500 78px Georgia, "Times New Roman", serif'
  text.letterSpacing = '12px'
  text.fillStyle = '#f0e5cb'
  text.fillText('MUSEUM OF KISHORE', 1024, 70)
  text.fillStyle = '#554531'
  text.fillText('MUSEUM OF KISHORE', 1024, 68)

  const glassCanvas = document.createElement('canvas')
  glassCanvas.width = 128; glassCanvas.height = 256
  const glass = glassCanvas.getContext('2d')!
  const glow = glass.createLinearGradient(0, 0, 0, 256)
  glow.addColorStop(0, '#4e4633'); glow.addColorStop(.35, '#bda470'); glow.addColorStop(.75, '#e2cfa3'); glow.addColorStop(1, '#967d4e')
  glass.fillStyle = glow; glass.fillRect(0, 0, 128, 256)
  for (let x = 4; x < 128; x += 8) {
    glass.fillStyle = 'rgba(55,39,20,.11)'; glass.fillRect(x, 0, 2, 256)
  }
  return { limestone, masonry, inscription: canvasTexture(inscription), glass: canvasTexture(glassCanvas) }
}
