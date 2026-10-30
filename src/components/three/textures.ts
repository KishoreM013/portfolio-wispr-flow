import * as THREE from 'three'

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D is unavailable')
  return { canvas, ctx }
}

function finish(
  canvas: HTMLCanvasElement,
  repeatX = 1,
  repeatY = 1,
  srgb = true,
) {
  const texture = new THREE.CanvasTexture(canvas)
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeatX, repeatY)
  texture.anisotropy = 4
  return texture
}

function noise(ctx: CanvasRenderingContext2D, count: number, alpha: number) {
  for (let i = 0; i < count; i += 1) {
    const shade = Math.random() > 0.5 ? 255 : 0
    ctx.fillStyle = `rgba(${shade},${shade},${shade},${Math.random() * alpha})`
    const size = Math.random() * 2.2 + 0.4
    ctx.fillRect(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height, size, size)
  }
}

/** Warm ashlar stone with faint joints. */
export function createStoneTexture(repeatX = 2, repeatY = 2, base = '#b6a68a') {
  const { canvas, ctx } = makeCanvas(512, 512)
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 512, 512)

  const wash = ctx.createLinearGradient(0, 0, 512, 512)
  wash.addColorStop(0, 'rgba(255,246,225,0.16)')
  wash.addColorStop(0.5, 'rgba(90,72,48,0.04)')
  wash.addColorStop(1, 'rgba(54,42,28,0.2)')
  ctx.fillStyle = wash
  ctx.fillRect(0, 0, 512, 512)

  noise(ctx, 11000, 0.075)

  ctx.strokeStyle = 'rgba(58,46,30,0.2)'
  ctx.lineWidth = 2
  for (let row = 0; row < 4; row += 1) {
    const y = row * 128
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(512, y)
    ctx.stroke()
    const offset = row % 2 === 0 ? 0 : 128
    for (let x = offset; x <= 512; x += 256) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + 128)
      ctx.stroke()
    }
  }

  const shade = ctx.createLinearGradient(0, 0, 0, 512)
  shade.addColorStop(0, 'rgba(255,255,255,0.06)')
  shade.addColorStop(1, 'rgba(40,30,18,0.12)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, 512, 512)

  return finish(canvas, repeatX, repeatY)
}

/** Fluted column surface — vertical bands of light and shadow. */
export function createColumnTexture() {
  const { canvas, ctx } = makeCanvas(512, 512)
  ctx.fillStyle = '#b7a78c'
  ctx.fillRect(0, 0, 512, 512)
  noise(ctx, 7000, 0.06)

  for (let x = 0; x < 512; x += 32) {
    const band = ctx.createLinearGradient(x, 0, x + 32, 0)
    band.addColorStop(0, 'rgba(52,41,26,0.34)')
    band.addColorStop(0.2, 'rgba(255,247,228,0.18)')
    band.addColorStop(0.55, 'rgba(255,247,228,0.05)')
    band.addColorStop(0.8, 'rgba(52,41,26,0.18)')
    band.addColorStop(1, 'rgba(52,41,26,0.38)')
    ctx.fillStyle = band
    ctx.fillRect(x, 0, 32, 512)
  }

  const top = ctx.createLinearGradient(0, 0, 0, 512)
  top.addColorStop(0, 'rgba(255,255,255,0.1)')
  top.addColorStop(0.4, 'rgba(255,255,255,0)')
  top.addColorStop(1, 'rgba(40,30,18,0.2)')
  ctx.fillStyle = top
  ctx.fillRect(0, 0, 512, 512)

  return finish(canvas, 1, 2)
}

/** Dark, wet-looking paving for the courtyard. */
export function createGroundTexture() {
  const { canvas, ctx } = makeCanvas(512, 512)
  ctx.fillStyle = '#3b342b'
  ctx.fillRect(0, 0, 512, 512)
  noise(ctx, 12000, 0.12)

  ctx.strokeStyle = 'rgba(12,10,8,0.55)'
  ctx.lineWidth = 3
  for (let y = 0; y <= 512; y += 128) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(512, y)
    ctx.stroke()
  }
  for (let row = 0; row < 4; row += 1) {
    const offset = row % 2 === 0 ? 0 : 64
    for (let x = offset; x <= 512; x += 128) {
      ctx.beginPath()
      ctx.moveTo(x, row * 128)
      ctx.lineTo(x, row * 128 + 128)
      ctx.stroke()
    }
  }

  const sheen = ctx.createLinearGradient(0, 0, 512, 512)
  sheen.addColorStop(0, 'rgba(255,228,184,0.1)')
  sheen.addColorStop(0.45, 'rgba(255,255,255,0.02)')
  sheen.addColorStop(1, 'rgba(8,8,10,0.16)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, 512, 512)

  return finish(canvas, 8, 8)
}

/** Dusk gradient with a warm city glow on the horizon. */
export function createSkyTexture() {
  const { canvas, ctx } = makeCanvas(1024, 512)
  const sky = ctx.createLinearGradient(0, 0, 0, 512)
  sky.addColorStop(0, '#09121f')
  sky.addColorStop(0.32, '#17293c')
  sky.addColorStop(0.56, '#344657')
  sky.addColorStop(0.72, '#6c6261')
  sky.addColorStop(0.82, '#4b4645')
  sky.addColorStop(1, '#171b22')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, 1024, 512)

  const glow = ctx.createRadialGradient(512, 350, 20, 512, 350, 430)
  glow.addColorStop(0, 'rgba(224,195,159,0.17)')
  glow.addColorStop(0.35, 'rgba(186,155,128,0.08)')
  glow.addColorStop(1, 'rgba(40,24,18,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, 1024, 512)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

/** A glowing arched window, drawn with transparency around the arch. */
export function createWindowTexture() {
  const { canvas, ctx } = makeCanvas(128, 256)
  ctx.clearRect(0, 0, 128, 256)

  ctx.beginPath()
  ctx.moveTo(14, 246)
  ctx.lineTo(14, 82)
  ctx.arc(64, 82, 50, Math.PI, 0)
  ctx.lineTo(114, 246)
  ctx.closePath()

  const glass = ctx.createLinearGradient(0, 40, 0, 246)
  glass.addColorStop(0, '#fff1c9')
  glass.addColorStop(0.3, '#e6b86d')
  glass.addColorStop(0.72, '#8a5424')
  glass.addColorStop(1, '#2a170b')
  ctx.fillStyle = glass
  ctx.fill()

  ctx.strokeStyle = '#d7b273'
  ctx.lineWidth = 6
  ctx.stroke()

  ctx.strokeStyle = 'rgba(42,26,12,0.75)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(64, 34)
  ctx.lineTo(64, 246)
  ctx.moveTo(16, 140)
  ctx.lineTo(112, 140)
  ctx.moveTo(16, 196)
  ctx.lineTo(112, 196)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  spacing: number,
) {
  const chars = [...text]
  const widths = chars.map((char) => ctx.measureText(char).width)
  const total = widths.reduce((sum, width) => sum + width, 0) + spacing * (chars.length - 1)
  let x = centerX - total / 2
  chars.forEach((char, index) => {
    ctx.fillText(char, x, y)
    x += widths[index] + spacing
  })
}

/** Gold lettering on transparent background for the frieze. */
export function createFriezeTexture() {
  const { canvas, ctx } = makeCanvas(1024, 128)
  ctx.clearRect(0, 0, 1024, 128)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.font = '600 54px Georgia, "Times New Roman", serif'
  ctx.fillStyle = '#efd59a'
  ctx.shadowColor = 'rgba(233,205,142,0.55)'
  ctx.shadowBlur = 14
  drawSpacedText(ctx, 'MUSEUM OF KISHORE', 512, 66, 9)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

/** Circular gold medallion with a serif K. */
export function createMedallionTexture() {
  const { canvas, ctx } = makeCanvas(256, 256)
  ctx.clearRect(0, 0, 256, 256)

  const gold = ctx.createLinearGradient(30, 20, 226, 236)
  gold.addColorStop(0, '#f4e2b4')
  gold.addColorStop(0.4, '#c9a35e')
  gold.addColorStop(1, '#7c6134')
  ctx.fillStyle = gold
  ctx.beginPath()
  ctx.arc(128, 128, 118, 0, Math.PI * 2)
  ctx.fill()

  const inner = ctx.createRadialGradient(100, 90, 8, 128, 128, 94)
  inner.addColorStop(0, '#3d3120')
  inner.addColorStop(1, '#15110b')
  ctx.fillStyle = inner
  ctx.beginPath()
  ctx.arc(128, 128, 94, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = 'rgba(233,205,142,0.65)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(128, 128, 102, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = '#e9cd8e'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '600 96px Georgia, "Times New Roman", serif'
  ctx.fillText('K', 128, 138)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}


/** Dark oak with vertical grain for the entrance doors. */
export function createWoodTexture() {
  const { canvas, ctx } = makeCanvas(512, 512)
  const base = ctx.createLinearGradient(0, 0, 512, 0)
  base.addColorStop(0, '#2b1b0e')
  base.addColorStop(0.5, '#3a2412')
  base.addColorStop(1, '#25170c')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 512, 512)

  for (let i = 0; i < 90; i += 1) {
    const x = Math.random() * 512
    const width = Math.random() * 2.4 + 0.4
    ctx.strokeStyle = `rgba(${Math.random() > 0.5 ? '12,8,4' : '120,82,44'},${Math.random() * 0.18})`
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.moveTo(x, 0)
    for (let y = 0; y <= 512; y += 32) {
      ctx.lineTo(x + Math.sin(y * 0.018 + i) * (3 + Math.random() * 3), y)
    }
    ctx.stroke()
  }

  for (let i = 0; i < 4; i += 1) {
    const cx = 60 + Math.random() * 392
    const cy = 60 + Math.random() * 392
    ctx.strokeStyle = 'rgba(10,6,3,0.24)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(cx, cy, 10 + Math.random() * 18, 4 + Math.random() * 6, 0.2, 0, Math.PI * 2)
    ctx.stroke()
  }

  const sheen = ctx.createLinearGradient(0, 0, 0, 512)
  sheen.addColorStop(0, 'rgba(255,214,150,0.08)')
  sheen.addColorStop(0.5, 'rgba(255,255,255,0)')
  sheen.addColorStop(1, 'rgba(0,0,0,0.16)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, 512, 512)

  return finish(canvas, 1, 1)
}


/** Warm veined marble for the Main Hall floor, pedestal and statue. */
export function createMarbleTexture(repeatX = 1, repeatY = 1) {
  const { canvas, ctx } = makeCanvas(512, 512)
  const base = ctx.createLinearGradient(0, 0, 512, 512)
  base.addColorStop(0, '#efe6d5')
  base.addColorStop(0.45, '#dfd3bd')
  base.addColorStop(1, '#c9bba2')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 512, 512)
  noise(ctx, 5000, 0.05)

  for (let i = 0; i < 26; i += 1) {
    const startX = Math.random() * 512
    const startY = Math.random() * 512
    ctx.strokeStyle = `rgba(${Math.random() > 0.4 ? '112,96,74' : '250,244,228'},${0.08 + Math.random() * 0.14})`
    ctx.lineWidth = 0.6 + Math.random() * 2.4
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    let x = startX
    let y = startY
    for (let step = 0; step < 5; step += 1) {
      x += (Math.random() - 0.5) * 130
      y += 30 + Math.random() * 70
      ctx.quadraticCurveTo(x + (Math.random() - 0.5) * 40, y - 20, x, y)
    }
    ctx.stroke()
  }

  const sheen = ctx.createLinearGradient(0, 0, 0, 512)
  sheen.addColorStop(0, 'rgba(255,255,255,0.08)')
  sheen.addColorStop(1, 'rgba(40,30,18,0.08)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, 512, 512)

  return finish(canvas, repeatX, repeatY)
}

/** Gold-on-charcoal museum label for the Main Hall pedestal. */
export function createPlaqueTexture() {
  const { canvas, ctx } = makeCanvas(1024, 512)
  ctx.fillStyle = '#0d0a07'
  ctx.fillRect(0, 0, 1024, 512)

  const glow = ctx.createRadialGradient(512, 230, 20, 512, 230, 430)
  glow.addColorStop(0, 'rgba(201,163,94,0.16)')
  glow.addColorStop(1, 'rgba(201,163,94,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, 1024, 512)

  ctx.strokeStyle = '#c9a35e'
  ctx.lineWidth = 4
  ctx.strokeRect(18, 18, 988, 476)
  ctx.strokeStyle = 'rgba(233,205,142,0.3)'
  ctx.lineWidth = 1
  ctx.strokeRect(34, 34, 956, 444)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '500 26px "JetBrains Mono", monospace'
  ctx.fillStyle = '#e9cd8e'
  drawSpacedText(ctx, 'THE MUSEUM OF KISHORE', 512, 98, 8)

  ctx.font = '400 46px Georgia, "Times New Roman", serif'
  ctx.fillStyle = '#b9a98d'
  ctx.fillText('Welcome to', 512, 190)

  ctx.font = '600 76px Georgia, "Times New Roman", serif'
  ctx.fillStyle = '#f3ead9'
  ctx.fillText("Kishore's Portfolio", 512, 285)

  ctx.strokeStyle = 'rgba(201,163,94,0.55)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(352, 350)
  ctx.lineTo(672, 350)
  ctx.stroke()

  ctx.font = '400 25px "Inter", sans-serif'
  ctx.fillStyle = '#a7977d'
  ctx.fillText('AI · SOFTWARE · MUSIC · WRITING', 512, 398)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

/** Soft radial glow used for lamps, the moon and the doorway. */
export function createGlowTexture() {
  const { canvas, ctx } = makeCanvas(128, 128)
  const glow = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  glow.addColorStop(0, 'rgba(255,248,228,1)')
  glow.addColorStop(0.25, 'rgba(255,226,166,0.65)')
  glow.addColorStop(0.6, 'rgba(224,164,78,0.18)')
  glow.addColorStop(1, 'rgba(224,164,78,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, 128, 128)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

/** Gold lettering on dark background for room labels on archways. */
export function createRoomLabelTexture(name: string, number: string) {
  const { canvas, ctx } = makeCanvas(256, 128)
  ctx.fillStyle = '#0d0a07'
  ctx.fillRect(0, 0, 256, 128)

  const glow = ctx.createRadialGradient(128, 64, 10, 128, 64, 100)
  glow.addColorStop(0, 'rgba(201,163,94,0.12)')
  glow.addColorStop(1, 'rgba(201,163,94,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, 256, 128)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '600 48px Georgia, "Times New Roman", serif'
  ctx.fillStyle = '#e9cd8e'
  ctx.shadowColor = 'rgba(233,205,142,0.4)'
  ctx.shadowBlur = 8
  ctx.fillText(name, 128, 48)

  ctx.font = '400 16px "JetBrains Mono", monospace'
  ctx.fillStyle = '#a7977d'
  ctx.shadowBlur = 0
  ctx.fillText(number, 128, 92)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

export type MuseumTextures = {
  wall: THREE.Texture
  column: THREE.Texture
  steps: THREE.Texture
  ground: THREE.Texture
  sky: THREE.Texture
  window: THREE.Texture
  wood: THREE.Texture
  frieze: THREE.Texture
  medallion: THREE.Texture
  glow: THREE.Texture
}

export function createMuseumTextures(): MuseumTextures {
  return {
    wall: createStoneTexture(3, 2),
    column: createColumnTexture(),
    steps: createStoneTexture(4, 1, '#a9997c'),
    ground: createGroundTexture(),
    sky: createSkyTexture(),
    window: createWindowTexture(),
    wood: createWoodTexture(),
    frieze: createFriezeTexture(),
    medallion: createMedallionTexture(),
    glow: createGlowTexture(),
  }
}
