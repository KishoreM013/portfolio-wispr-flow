import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { SceneBoundary, SceneFallback } from '../SceneBoundary'
import { createExhibitArtwork } from './exhibitArtwork'
import { ExhibitArtifact } from './ExhibitArtifact'
import { FramedArtwork } from './FramedArtwork'
import { createColumnTexture, createMarbleTexture, createStoneTexture } from './textures'
import type { Exhibit } from '../../data/collection'

const ROTUNDA_RADIUS = 29.2
const WALL_HEIGHT = 11.6
const DOME_RISE = 10.5

function BasementColumn({ angle, materials }: { angle: number; materials: { ivory: THREE.Material; marble: THREE.Material; brass: THREE.Material } }) {
  const position: [number, number, number] = [Math.sin(angle) * (ROTUNDA_RADIUS - .75), 0, -Math.cos(angle) * (ROTUNDA_RADIUS - .75)]
  return <group position={position} rotation={[0, -angle, 0]}>
    <mesh position={[0, .16, 0]} material={materials.marble}><boxGeometry args={[1.15, .32, 1.15]} /></mesh>
    <mesh position={[0, .38, 0]} material={materials.ivory}><boxGeometry args={[.94, .13, .94]} /></mesh>
    <mesh position={[0, WALL_HEIGHT / 2, 0]} material={materials.ivory} castShadow><cylinderGeometry args={[.32, .43, WALL_HEIGHT - .8, 32]} /></mesh>
    {[.52, WALL_HEIGHT - .45].map(y => <mesh key={y} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.brass}><torusGeometry args={[.4, .035, 8, 32]} /></mesh>)}
    <mesh position={[0, WALL_HEIGHT - .2, 0]} material={materials.ivory}><boxGeometry args={[1.1, .28, 1.1]} /></mesh>
    <mesh position={[0, WALL_HEIGHT, 0]} material={materials.marble}><boxGeometry args={[1.3, .13, 1.3]} /></mesh>
  </group>
}

function BasementDome({ materials }: { materials: { ivory: THREE.Material; brass: THREE.Material } }) {
  const ribs = useMemo(() => Array.from({ length: 24 }, (_, i) => {
    const angle = i / 24 * Math.PI * 2
    const points = Array.from({ length: 41 }, (_, j) => {
      const t = j / 40 * Math.PI / 2
      return new THREE.Vector3(Math.cos(angle) * Math.cos(t) * (ROTUNDA_RADIUS - .15), WALL_HEIGHT + Math.sin(t) * DOME_RISE - .08, Math.sin(angle) * Math.cos(t) * (ROTUNDA_RADIUS - .15))
    })
    return new THREE.CatmullRomCurve3(points)
  }), [])
  return <>
    <mesh position={[0, WALL_HEIGHT, 0]} scale={[1, DOME_RISE / ROTUNDA_RADIUS, 1]}><sphereGeometry args={[ROTUNDA_RADIUS, 112, 40, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#41483f" roughness={.95} side={THREE.BackSide} /></mesh>
    {ribs.map((rib, i) => <mesh key={i} material={materials.brass}><tubeGeometry args={[rib, 32, .065, 7, false]} /></mesh>)}
    {[.2, .4, .62, .84, 1.06, 1.28].map(t => <mesh key={t} position={[0, WALL_HEIGHT + Math.sin(t) * DOME_RISE - .08, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.ivory}><torusGeometry args={[Math.cos(t) * (ROTUNDA_RADIUS - .15), .09, 8, 144]} /></mesh>)}
    <pointLight position={[0, WALL_HEIGHT + DOME_RISE - .2, 0]} color="#dbe4dc" intensity={320} distance={52} />
  </>
}

function BasementChandelier({ materials }: { materials: { ivory: THREE.Material; brass: THREE.Material } }) {
  return <group position={[0, 14.5, 0]}>
    <mesh position={[0, 7.52, 0]} material={materials.brass}><cylinderGeometry args={[.5, .5, .15, 32]} /></mesh>
    <mesh position={[0, 3.75, 0]} material={materials.brass}><cylinderGeometry args={[.04, .04, 7.5, 8]} /></mesh>
    {[1.7, 2.5].map((radius, level) => <group key={radius} position={[0, -level * .8, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.brass}><torusGeometry args={[radius, .055, 10, 72]} /></mesh>
      {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[Math.cos(i / 14 * Math.PI * 2) * radius, .42, Math.sin(i / 14 * Math.PI * 2) * radius]} material={materials.ivory}><octahedronGeometry args={[.09]} /></mesh>)}
    </group>)}
    <pointLight position={[0, -.6, 0]} intensity={110} color="#ffcd88" distance={28} />
  </group>
}

function BasementCamera({ exhibits, selected, onBrowse, reduced }: { exhibits: Exhibit[]; selected: number; onBrowse: (index: number) => void; reduced: boolean }) {
  const { gl } = useThree()
  const state = useRef({ target: -1, current: -1 })
  const arrival = useRef(true)
  const heading = useRef({ yaw: 0, pitch: .04 })
  const destination = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    if (arrival.current) return
    state.current.target = selected
  }, [selected])

  useEffect(() => {
    const canvas = gl.domElement
    const root = canvas.closest('.museum-gallery') || canvas.parentElement
    const advance = (direction: number) => {
      if (!exhibits.length) return
      const next = THREE.MathUtils.clamp(state.current.target + direction, 0, exhibits.length - 1)
      arrival.current = false
      state.current.target = next
      onBrowse(next)
    }
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || (event.target instanceof HTMLElement && event.target.closest('.gallery-exhibit-card,nav,a,button,[role="dialog"]'))) return
      event.preventDefault()
      advance(event.deltaY > 0 ? 1 : -1)
    }
    let drag: { x: number; y: number; mode: 'look' | 'walk' } | null = null
    let distance = 0
    const down = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType !== 'touch') return
      drag = { x: event.clientX, y: event.clientY, mode: event.pointerType === 'touch' ? 'walk' : 'look' }
      distance = 0
      canvas.setPointerCapture(event.pointerId)
      canvas.style.cursor = 'grabbing'
    }
    const move = (event: PointerEvent) => {
      if (!drag) return
      const dx = event.clientX - drag.x
      const dy = event.clientY - drag.y
      distance += Math.abs(dx) + Math.abs(dy)
      if (drag.mode === 'walk') {
        if (Math.abs(dy) > 18) {
          advance(dy > 0 ? -1 : 1)
          drag.x = event.clientX
          drag.y = event.clientY
        }
      } else {
        heading.current.yaw -= dx * .004
        heading.current.pitch = THREE.MathUtils.clamp(heading.current.pitch - dy * .003, -.65, .8)
        drag.x = event.clientX
        drag.y = event.clientY
      }
    }
    const up = () => { drag = null; canvas.style.cursor = 'grab' }
    const click = (event: MouseEvent) => { if (distance > 8) { event.stopImmediatePropagation(); distance = 0 } }
    const keydown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('button,a,input,textarea,[role="dialog"]')) return
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') { event.preventDefault(); advance(1) }
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') { event.preventDefault(); advance(-1) }
      if (event.key.toLowerCase() === 'r') { heading.current.yaw = 0; heading.current.pitch = .04 }
    }
    root?.addEventListener('wheel', wheel as EventListener, { passive: false })
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('click', click, true)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    window.addEventListener('blur', up)
    window.addEventListener('keydown', keydown)
    return () => {
      root?.removeEventListener('wheel', wheel as EventListener)
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('click', click, true)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      window.removeEventListener('blur', up)
      window.removeEventListener('keydown', keydown)
      canvas.style.cursor = ''
    }
  }, [gl, exhibits.length, onBrowse])

  useFrame(({ camera }, dt) => {
    const motion = state.current
    motion.current = reduced ? motion.target : THREE.MathUtils.damp(motion.current, motion.target, 6, Math.min(dt, .05))
    if (motion.current < 0) {
      camera.position.set(0, 3.5, 0)
      camera.lookAt(0, 3.5, -11)
      return
    }
    const angle = Math.PI * 2 * motion.current / Math.max(exhibits.length, 1)
    destination.set(Math.sin(angle) * 16.5, 3.5, -Math.cos(angle) * 16.5)
    camera.position.lerp(destination, reduced ? 1 : 1 - Math.exp(-7 * dt))
    const { yaw, pitch } = heading.current
    look.set(
      camera.position.x + Math.sin(angle + yaw) * 11,
      camera.position.y + Math.sin(pitch) * 11,
      camera.position.z - Math.cos(angle + yaw) * 11,
    )
    camera.lookAt(look)
  })
  return null
}

function BasementInterior({ exhibits, selected, onSelect, onBrowse, lite, reduced }: { exhibits: Exhibit[]; selected: number; onSelect: (index: number) => void; onBrowse: (index: number) => void; lite: boolean; reduced: boolean }) {
  const artwork = useMemo(() => exhibits.map((exhibit, index) => createExhibitArtwork(exhibit, index)), [exhibits])
  const textures = useMemo(() => ({ marble: createMarbleTexture(2, 2), stone: createStoneTexture(10, 2, '#4d554c'), column: createColumnTexture() }), [])
  const materials = useMemo(() => ({
    ivory: new THREE.MeshStandardMaterial({ map: textures.column, color: '#b8b8a2', roughness: .7 }),
    marble: new THREE.MeshStandardMaterial({ map: textures.marble, color: '#77796e', roughness: .45 }),
    brass: new THREE.MeshStandardMaterial({ color: '#927b4d', metalness: .7, roughness: .35 }),
  }), [textures])
  useEffect(() => () => { artwork.forEach(texture => texture.dispose()); Object.values(textures).forEach(texture => texture.dispose()); Object.values(materials).forEach(material => material.dispose()) }, [artwork, textures, materials])
  return <>
    <BasementCamera exhibits={exhibits} selected={selected} onBrowse={onBrowse} reduced={reduced} />
    <color attach="background" args={['#111816']} />
    <fog attach="fog" args={['#111816', 42, 145]} />
    <ambientLight intensity={.32} color="#b9c9c0" />
    <hemisphereLight args={['#879c93', '#160f0c', .9]} />
    <directionalLight position={[-12, 25, 18]} intensity={2} color="#d7ddc9" castShadow={!lite} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[ROTUNDA_RADIUS + .5, 144]} />
      {lite ? <meshStandardMaterial map={textures.marble} color="#5e6257" roughness={.65} /> : <MeshReflectorMaterial map={textures.marble} resolution={256} blur={[100, 30]} mixBlur={1} mixStrength={1.1} mirror={.18} color="#5e6257" roughness={.5} />}
    </mesh>
    {[3, 7, 13, 23.9, 28.3].map(radius => <mesh key={radius} position={[0, .015, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.brass}><ringGeometry args={[radius, radius + .035, 144]} /></mesh>)}
    <mesh position={[0, 4.92, 0]}><cylinderGeometry args={[ROTUNDA_RADIUS + .05, ROTUNDA_RADIUS + .05, .28, 144, 1, true]} /><meshStandardMaterial color="#77796e" roughness={.8} side={THREE.DoubleSide} /></mesh>
    <BasementDome materials={materials} />
    {Array.from({ length: 16 }, (_, i) => <BasementColumn key={i} angle={i / 16 * Math.PI * 2} materials={materials} />)}
    <BasementChandelier materials={materials} />
    <mesh position={[0, .12, 0]}><cylinderGeometry args={[3, 3, .24, 64]} /><meshStandardMaterial color="#292d28" roughness={.65} /></mesh>
    <mesh position={[0, .28, 0]}><cylinderGeometry args={[2.35, 2.35, .12, 64]} /><meshStandardMaterial color="#a88750" metalness={.6} roughness={.35} /></mesh>
    {exhibits.map((exhibit, index) => {
      const angle = Math.PI * 2 * index / exhibits.length
      const position: [number, number, number] = [Math.sin(angle) * 24.7, 4.1, -Math.cos(angle) * 24.7]
      return <group key={exhibit.id} position={position} rotation={[0, -angle, 0]} onClick={event => { event.stopPropagation(); onSelect(index) }} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
        <FramedArtwork texture={artwork[index]} active={selected === index} />
        <group position={[0, -2.35, .1]}><ExhibitArtifact id={exhibit.id} /></group>
        <pointLight position={[0, 0, 1]} intensity={selected === index ? 16 : 7} distance={8} color="#d7bd7b" />
      </group>
    })}
  </>
}

export function BasementScene({ exhibits, selected, onSelect, onBrowse, lite, reduced }: { exhibits: Exhibit[]; selected: number; onSelect: (index: number) => void; onBrowse: (index: number) => void; lite: boolean; reduced: boolean }) {
  return <SceneBoundary><Canvas fallback={<SceneFallback />} dpr={[1, lite ? 1 : 1.25]} camera={{ position: [0, 2.8, 27], fov: 58, far: 160 }} gl={{ antialias: !lite }}>
    <BasementInterior exhibits={exhibits} selected={selected} onSelect={onSelect} onBrowse={onBrowse} lite={lite} reduced={reduced} />
  </Canvas></SceneBoundary>
}
