import { Suspense, useEffect, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { portraitViewport, PORTRAIT_WIDTH, PORTRAIT_HEIGHT } from './portraitFraming'

function engraving(title: string, sections: Array<[string, string]>) {
  const canvas = document.createElement('canvas'); canvas.width = 800; canvas.height = 1300
  const c = canvas.getContext('2d')!
  c.fillStyle = '#e5dcc5'; c.fillRect(0, 0, 800, 1300); c.strokeStyle = '#aa9160'; c.lineWidth = 3; c.strokeRect(30, 30, 740, 1240)
  c.fillStyle = '#8c7042'; c.font = '23px sans-serif'; c.fillText('THE CURATOR’S COLLECTION', 65, 105)
  c.fillStyle = '#244136'; c.font = '52px Georgia'; c.fillText(title, 65, 190)
  let y = 280
  for (const [label, body] of sections) {
    c.fillStyle = '#8c7042'; c.font = '24px sans-serif'; c.fillText(label, 65, y); y += 48
    c.fillStyle = '#244136'; c.font = '31px Georgia'; let line = ''
    for (const word of body.split(' ')) { if (c.measureText(line + word).width > 650 && line) { c.fillText(line, 65, y); y += 43; line = word + ' ' } else line += word + ' ' }
    c.fillText(line, 65, y); y += 100
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8; return texture
}
function Portrait({ src }: { src: string }) {
  const source = useTexture(src)
  const texture = useMemo(() => {
    const t = source.clone()
    const image = source.image as { width: number; height: number }
    const crop = portraitViewport(src, image.width, image.height)
    t.colorSpace = THREE.SRGBColorSpace
    t.repeat.set(...crop.repeat)
    t.offset.set(...crop.offset)
    t.needsUpdate = true
    return t
  }, [source, src])
  useEffect(() => () => texture.dispose(), [texture])
  return <mesh position={[0, 4.3, -7.27]}><planeGeometry args={[PORTRAIT_WIDTH, PORTRAIT_HEIGHT]} /><meshBasicMaterial map={texture} toneMapped={false} transparent /></mesh>
}
function nameplate() {
  const canvas = document.createElement('canvas'); canvas.width = 1400; canvas.height = 240
  const c = canvas.getContext('2d')!
  c.fillStyle = '#192e25'; c.fillRect(0, 0, 1400, 240)
  c.strokeStyle = '#c6aa70'; c.lineWidth = 4; c.strokeRect(12, 12, 1376, 216)
  c.textAlign = 'center'; c.fillStyle = '#f2e3bb'; c.font = '78px Georgia'; c.fillText('Kishore M', 700, 115)
  c.fillStyle = '#ceb982'; c.font = '28px sans-serif'; c.fillText('SOFTWARE ENGINEERING · AI & DATA SCIENCE · CHENNAI', 700, 185)
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8; return texture
}
export function PortraitAlcove({ endZ, stone, portraitSrc = '/images/kishore-portrait.jpeg' }: { endZ: number; stone: THREE.Texture; portraitSrc?: string }) {
  const panels = useMemo(() => [
    engraving('The foundations', [['EDUCATION · 2023–2027', 'B.Tech in Artificial Intelligence and Data Science, Chennai Institute of Technology.'], ['ACADEMIC RECORD', 'CGPA 8.74 / 10'], ['THE PRACTICE', 'Machine learning, generative AI, RAG systems and software engineering.']]),
    engraving('The journey', [['MICROSOFT · MAY–JULY 2026', 'Software Engineer Intern. Anomaly detection, monitoring and incident automation.'], ['RESEARCH · NOV–DEC 2024', 'Chennai Institute of Technology. Voice-controlled systems and chess AI.'], ['NEXT CHAPTER', 'Seeking software engineering and AI / ML engineering opportunities.']]),
    nameplate(),
  ], [])
  useEffect(() => () => panels.forEach(t => t.dispose()), [panels])
  return <group position={[0, 0, endZ]}>
    {/* The long gallery opens into a half-round portrait chamber. */}
    <mesh position={[0, 3, 0]} receiveShadow><cylinderGeometry args={[8, 8, 6, 80, 1, true, Math.PI / 2, Math.PI]} /><meshStandardMaterial map={stone} color="#b7ac94" roughness={.9} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 6, 0]}><sphereGeometry args={[8, 64, 24, Math.PI, Math.PI, 0, Math.PI / 2]} /><meshStandardMaterial map={stone} color="#b7ac94" roughness={.95} side={THREE.BackSide} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .008, 0]}><circleGeometry args={[8, 80]} /><meshStandardMaterial color="#b1a58c" roughness={.4} metalness={.1} /></mesh>
    {[6, 7.8].map(radius => <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]} position={[0, .018, 0]}><ringGeometry args={[radius, radius + .04, 100, 1, 0, Math.PI]} /><meshStandardMaterial color="#a88a50" metalness={.6} roughness={.4} /></mesh>)}
    <mesh position={[0, 6, .03]}><torusGeometry args={[7.92, .16, 10, 80, Math.PI]} /><meshStandardMaterial color="#c6b389" roughness={.45} /></mesh>
    <mesh position={[0, 4.3, -7.45]}><boxGeometry args={[4.1, 6.78, .24]} /><meshStandardMaterial color="#715933" metalness={.6} roughness={.4} /></mesh>
    <mesh position={[0, 4.3, -7.31]}><boxGeometry args={[3.85, 6.52, .04]} /><meshStandardMaterial color="#d1b374" metalness={.55} roughness={.3} /></mesh>
    <mesh position={[0, 4.3, -7.28]}><planeGeometry args={[PORTRAIT_WIDTH, PORTRAIT_HEIGHT]} /><meshBasicMaterial color="#17241f" toneMapped={false} /></mesh>
    <Suspense fallback={null}><Portrait key={portraitSrc} src={portraitSrc} /></Suspense>
    <mesh position={[0, .43, -7.1]}><boxGeometry args={[4.6, .62, .8]} /><meshStandardMaterial color="#d1c5a7" map={stone} roughness={.5} /></mesh>
    <mesh position={[0, .47, -6.68]}><planeGeometry args={[3.4, .55]} /><meshBasicMaterial map={panels[2]} toneMapped={false} /></mesh>
    {[-1, 1].map((side, i) => <group key={side} position={[side * 5.3, 3.5, -5.65]} rotation={[0, -side * .72, 0]}>
      <mesh><boxGeometry args={[2.8, 4.5, .12]} /><meshStandardMaterial color="#9b8050" metalness={.6} roughness={.4} /></mesh>
      <mesh position={[0, 0, .07]}><planeGeometry args={[2.6, 4.3]} /><meshBasicMaterial map={panels[i]} toneMapped={false} /></mesh>
    </group>)}
    <pointLight position={[0, 8.5, -4]} intensity={100} distance={20} color="#ffe2b1" />
    <pointLight position={[-5, 5, -3]} intensity={22} distance={10} color="#ffe2b1" />
    <pointLight position={[5, 5, -3]} intensity={22} distance={10} color="#ffe2b1" />
    {/* Gallery benches leave the centre aisle open. */}
    {[-1, 1].map(side => <group key={side} position={[side * 4.5, 0, -1.7]} rotation={[0, side * .4, 0]}>
      <mesh position={[0, .65, 0]}><boxGeometry args={[2.6, .18, .8]} /><meshStandardMaterial color="#4c3325" roughness={.7} /></mesh>
      {[-.95, .95].map(x => <mesh key={x} position={[x, .3, 0]}><boxGeometry args={[.15, .6, .65]} /><meshStandardMaterial color="#9a8051" metalness={.6} roughness={.5} /></mesh>)}
    </group>)}
  </group>
}

export function OpenBookAlcove({ endZ, stone, onOpen }: { endZ: number; stone: THREE.Texture; onOpen: () => void }) {
  const board = useMemo(() => engraving('UPCOMING', [['THE QUIET ARCHIVE', 'Essays, lyrics and unfinished pages.'], ['NEXT EXHIBITS', 'New writing and songs are being prepared for the collection.']]), [])
  useEffect(() => () => board.dispose(), [board])
  return <group position={[0, 0, endZ]}>
    <mesh position={[0, 3, 0]} receiveShadow><cylinderGeometry args={[8, 8, 6, 80, 1, true, Math.PI / 2, Math.PI]} /><meshStandardMaterial map={stone} color="#b7ac94" roughness={.9} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 6, 0]}><sphereGeometry args={[8, 64, 24, Math.PI, Math.PI, 0, Math.PI / 2]} /><meshStandardMaterial map={stone} color="#b7ac94" roughness={.95} side={THREE.BackSide} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .008, 0]}><circleGeometry args={[8, 80]} /><meshStandardMaterial color="#b1a58c" roughness={.4} metalness={.1} /></mesh>
    <mesh position={[0, 6, .03]}><torusGeometry args={[7.92, .16, 10, 80, Math.PI]} /><meshStandardMaterial color="#c6b389" roughness={.45} /></mesh>
    <group position={[0, 1.28, -2.3]} rotation={[0, 0, 0]} onClick={event => { event.stopPropagation(); onOpen() }} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
      <mesh position={[0, -.02, 0]} castShadow><boxGeometry args={[3.75, .16, 2.55]} /><meshStandardMaterial color="#633d25" roughness={.75} /></mesh>
      <mesh position={[0, .08, 0]}><boxGeometry args={[3.45, .05, 2.35]} /><meshStandardMaterial color="#9a6840" roughness={.7} /></mesh>
      {[-1, 1].map(side => {
        const tilt = side * .12
        return <group key={side} position={[side * .86, .17, 0]} rotation={[0, 0, tilt]}>
          <mesh position={[0, .02, 0]} castShadow><boxGeometry args={[1.62, .18, 2.18]} /><meshStandardMaterial color="#eee0bf" roughness={.92} /></mesh>
          <mesh position={[0, .12, 0]}><boxGeometry args={[1.5, .025, 2.04]} /><meshStandardMaterial color="#f8efd9" roughness={.95} /></mesh>
          <mesh position={[0, .145, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.36, 1.78]} /><meshBasicMaterial map={board} toneMapped={false} /></mesh>
          {[-.86, -.72, .72, .86].map(z => <mesh key={z} position={[0, .14, z]}><boxGeometry args={[1.42, .012, .012]} /><meshStandardMaterial color="#cdbd9d" roughness={1} /></mesh>)}
        </group>
      })}
      <mesh position={[0, .22, 0]} rotation={[0, 0, 0]} castShadow><boxGeometry args={[.14, .28, 2.2]} /><meshStandardMaterial color="#a87543" roughness={.62} /></mesh>
      <mesh position={[0, .39, 0]} rotation={[0, 0, 0]}><coneGeometry args={[.12, .18, 4]} /><meshStandardMaterial color="#c49a5b" metalness={.35} roughness={.45} /></mesh>
      <mesh position={[.05, .2, -.8]} rotation={[0, 0, -.06]}><boxGeometry args={[.035, .035, .65]} /><meshStandardMaterial color="#9e3730" roughness={.6} /></mesh>
    </group>
    <mesh position={[0, .68, -2.25]}><boxGeometry args={[4.7, .52, .9]} /><meshStandardMaterial color="#d1c5a7" map={stone} roughness={.5} /></mesh>
    <mesh position={[0, .71, -1.78]}><planeGeometry args={[3.8, .48]} /><meshBasicMaterial map={board} toneMapped={false} />
    </mesh>
    <pointLight position={[0, 7, -3]} intensity={100} distance={20} color="#ffe2b1" />
  </group>
}
