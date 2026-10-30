import { SceneBoundary, SceneFallback } from '../SceneBoundary'
import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { createExhibitArtwork } from './exhibitArtwork'
import { MuseumPortal } from './MuseumPortal'
import { FramedArtwork } from './FramedArtwork'
import { ExhibitArtifact } from './ExhibitArtifact'
import { OpenBookAlcove, PortraitAlcove } from './PortraitAlcove'
import type { Exhibit } from '../../data/collection'
import { createMarbleTexture, createStoneTexture } from './textures'
import { clampGalleryProgress, exhibitPlacement, focusAtProgress, galleryCameraZ, maxGalleryProgress, galleryLength, galleryEndZ, GALLERY_ENTRANCE_Z } from './galleryNavigation'

type GalleryProps = { exhibits: Exhibit[]; selected: number; onSelect: (index: number) => void; onBrowse: (index: number) => void; navigationKey: number; onEndChange?: (atEnd: boolean) => void; onBookClick?: () => void; writing?: boolean; lite: boolean; reduced: boolean }
function GalleryCamera({ exhibits, selected, onBrowse, navigationKey, reduced, onEndChange }: GalleryProps) {
  const { gl } = useThree()
  const progress = useRef({ target: Math.floor(selected / 2), current: Math.floor(selected / 2), manual: false })
  const heading = useRef({ yaw: 0, pitch: .058 })
  const atEnd = useRef(false)
  const selectedRef = useRef(selected)
  selectedRef.current = selected
  const destination = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(0, 3.3, 0), [])
  useEffect(() => { progress.current.target = Math.floor(selectedRef.current / 2); progress.current.manual = true }, [navigationKey])
  useEffect(() => {
    const canvas = gl.domElement
    const root = canvas.closest('.museum-gallery') || canvas.parentElement
    const advance = (pixels: number) => {
      progress.current.manual = false
      progress.current.target = clampGalleryProgress(progress.current.target + pixels / 850, exhibits.length)
    }
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || (event.target instanceof HTMLElement && event.target.closest('.gallery-exhibit-card,nav,a,button,[role="dialog"]'))) return
      if (!maxGalleryProgress(exhibits.length)) return
      event.preventDefault()
      advance(THREE.MathUtils.clamp(event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1), -240, 240))
    }
    let drag: { x: number; y: number; touch: boolean; mode: 'pending' | 'look' | 'walk' } | null = null
    let distance = 0
    const down = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType !== 'touch') return
      drag = { x: event.clientX, y: event.clientY, touch: event.pointerType === 'touch', mode: event.pointerType === 'touch' ? 'pending' : 'look' }
      distance = 0
      canvas.setPointerCapture(event.pointerId)
      canvas.style.cursor = 'grabbing'
    }
    const move = (event: PointerEvent) => {
      if (!drag) return
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y
      if (drag.mode === 'pending') {
        if (Math.hypot(dx, dy) < 6) return
        drag.mode = Math.abs(dx) > Math.abs(dy) ? 'look' : 'walk'
      }
      distance += Math.abs(dx) + Math.abs(dy)
      if (drag.mode === 'walk') advance(-dy * 2)
      else {
        heading.current.yaw -= dx * .004
        if (!drag.touch) heading.current.pitch = THREE.MathUtils.clamp(heading.current.pitch - dy * .003, -.65, .8)
      }
      drag.x = event.clientX; drag.y = event.clientY
    }
    const up = () => { drag = null; canvas.style.cursor = 'grab' }
    const click = (event: MouseEvent) => { if (distance > 8) { event.stopImmediatePropagation(); distance = 0 } }
    const keydown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('button,a,input,textarea,[role="dialog"]')) return
      if (event.key.toLowerCase() === 'a') { event.preventDefault(); heading.current.yaw += .12 }
      if (event.key.toLowerCase() === 'd') { event.preventDefault(); heading.current.yaw -= .12 }
      if (event.key.toLowerCase() === 'r') { heading.current.yaw = 0; heading.current.pitch = .058 }
    }
    root?.addEventListener('wheel', wheel as EventListener, { passive: false })
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('click', click, true)
    window.addEventListener('keydown', keydown); window.addEventListener('blur', up); window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up)
    return () => { canvas.style.cursor = ''; window.removeEventListener('keydown', keydown); window.removeEventListener('blur', up); root?.removeEventListener('wheel', wheel as EventListener); canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('click', click, true); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up) }
  }, [gl, exhibits.length])
  useFrame(({ camera }, dt) => {
    const state = progress.current
    state.current = reduced ? state.target : THREE.MathUtils.damp(state.current, state.target, 5, Math.min(dt, .05))
    destination.set(0, 2.6, galleryCameraZ(state.current))
    camera.position.copy(destination)
    const { yaw, pitch } = heading.current
    look.set(camera.position.x - Math.sin(yaw) * Math.cos(pitch) * 12, camera.position.y + Math.sin(pitch) * 12, camera.position.z - Math.cos(yaw) * Math.cos(pitch) * 12)
    camera.lookAt(look)
    const ending = state.current > maxGalleryProgress(exhibits.length) - .65
    if (ending !== atEnd.current) { atEnd.current = ending; onEndChange?.(ending) }
    if (state.manual && Math.abs(state.current - state.target) > .02) return
    state.manual = false
    const focus = focusAtProgress(state.current, exhibits.length, selectedRef.current % 2)
    if (focus !== selectedRef.current) { selectedRef.current = focus; onBrowse(focus) }
  })
  return null
}
function ExhibitDisplay({ exhibit, index, active, onSelect, lite }: { exhibit: Exhibit; index: number; active: boolean; onSelect: (index: number) => void; lite: boolean }) {
  const { side, z, rotation } = exhibitPlacement(index)
  const generatedTexture = useMemo(() => createExhibitArtwork(exhibit, index), [exhibit, index])
  useEffect(() => () => { generatedTexture.dispose(); document.body.style.cursor = '' }, [generatedTexture])
  return <group position={[side * 7.65, 3.5, z]} rotation={[0, rotation, 0]} onClick={event => { event.stopPropagation(); onSelect(index) }} onPointerOver={event => { event.stopPropagation(); document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
    <FramedArtwork texture={generatedTexture} active={active} />
    <ExhibitArtifact id={exhibit.id} />
    <pointLight position={[0, 2, 1.2]} intensity={lite ? 2 : active ? 12 : 7} color="#ffe0a7" distance={6} decay={2} />
  </group>
}
function GalleryInterior(props: GalleryProps) {
  const { exhibits, selected, onSelect, lite } = props
  const length = galleryLength(exhibits.length)
  const centerZ = GALLERY_ENTRANCE_Z - length / 2
  const textures = useMemo(() => ({ marble: createMarbleTexture(3, 3), stone: createStoneTexture(4, 2, '#aea58f') }), [])
  useEffect(() => () => Object.values(textures).forEach(t => t.dispose()), [textures])
  return <>
    <GalleryCamera {...props} />
    <color attach="background" args={['#18201b']} /><fog attach="fog" args={['#18201b', 25, 65]} />
    <ambientLight intensity={.65} color="#ddcfb3" /><hemisphereLight args={['#d3e2dc', '#443424', .8]} />
    <directionalLight position={[0, 10, 8]} intensity={2} color="#f3d9ac" />
    <mesh position={[0, 0, centerZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[16, length]} />{lite ? <meshStandardMaterial map={textures.marble} color="#827c6b" roughness={.4} /> : <MeshReflectorMaterial resolution={256} map={textures.marble} color="#827c6b" roughness={.4} mirror={.2} mixStrength={1} blur={[120, 40]} mixBlur={1} />}</mesh>
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * 8, 3, centerZ]}><boxGeometry args={[.4, 6, length]} /><meshStandardMaterial map={textures.stone} roughness={.9} /></mesh>
      <mesh position={[side * 7.77, .5, centerZ]}><boxGeometry args={[.12, 1, length]} /><meshStandardMaterial color="#27372d" roughness={.5} /></mesh>
      <mesh position={[side * 7.7, 1.05, centerZ]}><boxGeometry args={[.05, .045, length]} /><meshStandardMaterial color="#ad8c50" metalness={.6} roughness={.4} /></mesh>
    </group>)}
    <mesh position={[0, 6, centerZ]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[8, 8, length, 64, 1, true, Math.PI / 2, Math.PI]} /><meshStandardMaterial map={textures.stone} color="#b4b19a" side={THREE.DoubleSide} roughness={.9} /></mesh>
    {Array.from({ length: Math.ceil(length / 7) }, (_, i) => GALLERY_ENTRANCE_Z - 4 - i * 7).map(z => <group key={z}>
      <mesh position={[0, 6, z]}><torusGeometry args={[7.9, .09, 8, 80, Math.PI]} /><meshStandardMaterial color="#bba573" metalness={.3} roughness={.5} /></mesh>
      {!lite && <pointLight position={[0, 5.7, z]} intensity={24} color="#f5d5a3" distance={13} decay={2} />}
      {[-1, 1].map(side => <group key={side} position={[side * 7.12, 4.45, z + 3.5]}>
        <mesh position={[side * -.16, .14, 0]} rotation={[0, 0, -.2 * side]}><boxGeometry args={[.13, .45, .11]} /><meshStandardMaterial color="#66553a" metalness={.48} roughness={.5} /></mesh>
        <mesh position={[side * -.16, .4, 0]}><sphereGeometry args={[.11, 10, 8]} /><meshBasicMaterial color="#ffe6b4" toneMapped={false} /></mesh>
        {!lite && <pointLight position={[side * -.16, .38, .16]} intensity={7} color="#ffd7a0" distance={4.8} decay={2} />}
      </group>)}
    </group>)}
    <MuseumPortal position={[0, 0, GALLERY_ENTRANCE_Z]} rotation={Math.PI} destination="/hall" title="The Grand Rotunda" caption="Return to the Main Hall →" stone={textures.stone} />
    {props.writing ? <OpenBookAlcove endZ={galleryEndZ(exhibits.length)} stone={textures.stone} onOpen={props.onBookClick || (() => undefined)} /> : <PortraitAlcove endZ={galleryEndZ(exhibits.length)} stone={textures.stone} />}
    {exhibits.map((exhibit, index) => <ExhibitDisplay key={exhibit.id} exhibit={exhibit} index={index} active={index === selected} onSelect={onSelect} lite={lite} />)}
  </>
}
export function GalleryScene(props: GalleryProps) {
  return <SceneBoundary><Canvas fallback={<SceneFallback />} dpr={props.lite ? [.7, .85] : [1, 1.5]} camera={{ position: [0, 2.6, 11], fov: 74 }} gl={{ antialias: !props.lite }}><GalleryInterior {...props} /></Canvas></SceneBoundary>
}
