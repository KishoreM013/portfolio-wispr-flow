import { MuseumPortal } from './MuseumPortal'
import { circularFloorWithOpening, circularWallGeometry } from './museumArchitecture'
import { SceneBoundary, SceneFallback } from '../SceneBoundary'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { HallView } from './hallNavigation'
import { orbitLookTarget } from './hallNavigation'
export type { HallView } from './hallNavigation'
import { boardMount, constrainGroundPosition, constrainUpperPosition, createHallRoute, EYE_HEIGHT, HALL_RADIUS, HALL_WALL_HEIGHT, HALL_BALCONY_INNER, STAIR_BOTTOM_ANGLE, STAIR_STEPS, STAIR_WALK_RADIUS, STAIR_RAIL_HEIGHT, STAIR_RAIL_POST_COUNT, GALLERY_FLOOR, roomAngle, sideStairHeight, sideStairRailPosition } from './hallNavigation'
import { rooms } from '../../data/museum'
import { profile } from '../../data/collection'
import { createMarbleTexture, createStoneTexture, createColumnTexture, createPlaqueTexture } from './textures'

type Materials = { stone: THREE.MeshStandardMaterial; ivory: THREE.MeshStandardMaterial; marble: THREE.MeshStandardMaterial; brass: THREE.MeshStandardMaterial; walnut: THREE.MeshStandardMaterial; dark: THREE.MeshStandardMaterial; plaster: THREE.MeshStandardMaterial; burgundy: THREE.MeshStandardMaterial }
const CENTER_Z = 3
const ARCH_ANGLES = [-.94, -.44, .44, .94]
const BASEMENT_ENTRY_ANGLE = 2.775
const BASEMENT_ARCH_RADIUS = 1.85
const BASEMENT_ARCH_SPRING = 2.65
const polar = (radius: number, angle: number, y = 0): [number, number, number] => [radius * Math.sin(angle), y, CENTER_Z - radius * Math.cos(angle)]

function Block({ position, size, material }: { position: [number, number, number]; size: [number, number, number]; material: THREE.Material }) {
  return <mesh position={position} material={material} castShadow receiveShadow><boxGeometry args={size} /></mesh>
}

/** Drag, touch, wheel and keyboard exploration, bounded to the museum floor. */
function Camera({ view, interactive, zoom, onScrollStage }: { view: HallView; interactive: boolean; zoom: number; onScrollStage?: (view: HallView) => void }) {
  const { camera, gl } = useThree()
  const scroll = useRef({ active: false, target: 0, current: 0, stage: 'arrival' as HallView })
  const route = useMemo(createHallRoute, [])
  const routePoint = useMemo(() => new THREE.Vector3(), [])
  const keys = useRef(new Set<string>())
  const pointerTravel = useRef(0)
  const heading = useRef({ yaw: 0, pitch: .15, distance: 24 })
  const target = useMemo(() => new THREE.Vector3(), [])
  const tourLook = useMemo(() => new THREE.Vector3(), [])
  const destination = useMemo(() => new THREE.Vector3(), [])
  const forward = useMemo(() => new THREE.Vector3(), [])
  const right = useMemo(() => new THREE.Vector3(), [])
  useEffect(() => {
    heading.current.yaw = 0
    heading.current.pitch = view === 'upper' ? -.04 : .15
    const poses: Record<HallView, THREE.Vector3> = {
      arrival: route.stops.find(stop => stop.id === 'arrival')!.position,
      ground: route.stops.find(stop => stop.id === 'room-0')!.position,
      statue: route.stops.find(stop => stop.id === 'statue')!.position,
      stairs: route.stops.find(stop => stop.id === 'stairs')!.position,
      upper: route.stops.find(stop => stop.id === 'upper')!.position,
    }
    const nearest = (position: THREE.Vector3) => {
      let result = 0, distance = Infinity
      for (let i = 0; i <= 200; i++) {
        const candidate = route.getPointAt(i / 200).distanceToSquared(position)
        if (candidate < distance) { distance = candidate; result = i / 200 }
      }
      return result
    }
    // Both forward and return journeys follow the same verified clear route.
    const start = nearest(camera.position)
    scroll.current = { active: true, current: start, target: nearest(poses[view]), stage: view }
  }, [view, interactive, route, camera])
  useEffect(() => {
    const canvas = gl.domElement
    let drag: { x: number; y: number; touch: boolean; mode: 'pending' | 'look' | 'walk' } | null = null
    const isInput = (e: KeyboardEvent) => (e.target instanceof HTMLElement && !!e.target.closest('button,a,input,textarea,[role="dialog"]'))
    const nearestProgress = () => {
      let nearest = 0, distance = Infinity
      for (let i = 0; i <= 100; i++) {
        route.getPointAt(i / 100, routePoint)
        const candidate = routePoint.distanceToSquared(camera.position)
        if (candidate < distance) { distance = candidate; nearest = i / 100 }
      }
      return nearest
    }
    let lastScrollStep = 0
    const walkToNextRoom = (pixels: number) => {
      const now = performance.now()
      if (now - lastScrollStep < 220) return
      lastScrollStep = now
      const direction = Math.sign(pixels)
      const stops = route.stops
      if (!scroll.current.active) {
        const nearest = nearestProgress()
        scroll.current.current = nearest
        scroll.current.target = nearest
        scroll.current.active = true
      }
      let current = stops.reduce((best, stop, index) => Math.abs(stop.progress - scroll.current.target) < Math.abs(stops[best].progress - scroll.current.target) ? index : best, 0)
      if (Math.abs(stops[current].progress - scroll.current.target) > .002) current = stops.findIndex(stop => stop.progress > scroll.current.target + .002) - (direction < 0 ? 1 : 0)
      const next = THREE.MathUtils.clamp(current + direction, 0, stops.length - 1)
      scroll.current.active = true
      scroll.current.target = stops[next].progress
    }
    const walk = (pixels: number) => {
      if (!scroll.current.active) {
        const nearest = nearestProgress()
        scroll.current.current = nearest; scroll.current.target = nearest; scroll.current.active = true
      }
      scroll.current.target = THREE.MathUtils.clamp(scroll.current.target + pixels / 3600, 0, 1)
    }
    const down = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType !== 'touch') return
      pointerTravel.current = 0
      drag = { x: e.clientX, y: e.clientY, touch: e.pointerType === 'touch', mode: e.pointerType === 'touch' ? 'pending' : 'look' }
      canvas.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y
      if (drag.mode === 'pending') {
        if (Math.hypot(dx, dy) < 6) return
        drag.mode = Math.abs(dx) > Math.abs(dy) ? 'look' : 'walk'
      }
      pointerTravel.current += Math.abs(dx) + Math.abs(dy)
      if (drag.mode === 'walk') walk(-dy * 4)
      else {
        scroll.current.active = true
        heading.current.yaw -= dx * .004
        heading.current.pitch = THREE.MathUtils.clamp(heading.current.pitch + dy * .003, -.5, .8)
      }
      drag.x = e.clientX; drag.y = e.clientY
    }
    const up = () => { drag = null }
    const click = (e: MouseEvent) => { if (pointerTravel.current > 6) { e.stopImmediatePropagation(); pointerTravel.current = 0 } }
    const keydown = (e: KeyboardEvent) => {
      if (isInput(e) || !['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase())) return
      e.preventDefault(); scroll.current.active = false; keys.current.add(e.key.toLowerCase())
    }
    const keyup = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase())
    const blur = () => { keys.current.clear(); drag = null }
    const wheel = (e: WheelEvent) => {
      // Leave native scrolling and browser zoom available in overlays and on controls.
      if (e.ctrlKey || (e.target instanceof HTMLElement && e.target.closest('a,button,input,select,[role="dialog"],.palace-directory'))) return
      e.preventDefault()
      const pixels = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1)
      walkToNextRoom(THREE.MathUtils.clamp(pixels, -240, 240))
    }
    const wheelTarget = canvas.parentElement
    canvas.addEventListener('click', click, true); canvas.addEventListener('pointerdown', down); window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up)
    wheelTarget?.addEventListener('wheel', wheel, { passive: false }); window.addEventListener('keydown', keydown); window.addEventListener('keyup', keyup); window.addEventListener('blur', blur)
    return () => { canvas.removeEventListener('click', click, true); canvas.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); wheelTarget?.removeEventListener('wheel', wheel); window.removeEventListener('keydown', keydown); window.removeEventListener('keyup', keyup); window.removeEventListener('blur', blur) }
  }, [gl, interactive, view, camera, route, routePoint])
  useFrame((_, dt) => {
    const nextFov = THREE.MathUtils.clamp(58 / zoom, 32, 68)
    if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - nextFov) > 0.05) {
      camera.fov = THREE.MathUtils.damp(camera.fov, nextFov, 8, Math.min(dt, .05))
      camera.updateProjectionMatrix()
    }
    if (scroll.current.active) {
      const state = scroll.current
      state.current = interactive ? THREE.MathUtils.damp(state.current, state.target, 5, Math.min(dt, .05)) : state.target
      route.sample(state.current, destination, tourLook)
      camera.position.lerp(destination, interactive ? 1 - Math.exp(-Math.min(dt, .05) * 7) : 1)
      orbitLookTarget(camera.position, tourLook, heading.current.yaw, heading.current.pitch, target)
      const activeStop = route.stops.reduce((nearest, stop) => Math.abs(stop.progress - state.current) < Math.abs(nearest.progress - state.current) ? stop : nearest, route.stops[0])
      if (activeStop.view !== state.stage && Math.abs(activeStop.progress - state.current) < .035) { state.stage = activeStop.view; onScrollStage?.(activeStop.view) }
    } else {
      const h = heading.current
      const speed = Math.min(dt, .05) * 4
      forward.set(-Math.sin(h.yaw), 0, -Math.cos(h.yaw)); right.set(Math.cos(h.yaw), 0, -Math.sin(h.yaw))
      if (keys.current.has('w') || keys.current.has('arrowup')) camera.position.addScaledVector(forward, speed)
      if (keys.current.has('s') || keys.current.has('arrowdown')) camera.position.addScaledVector(forward, -speed)
      if (keys.current.has('a')) camera.position.addScaledVector(right, -speed)
      if (keys.current.has('d')) camera.position.addScaledVector(right, speed)
      if (keys.current.has('arrowleft')) h.yaw += speed * .3
      if (keys.current.has('arrowright')) h.yaw -= speed * .3
      if (keys.current.size) {
        const onUpperFloor = camera.position.y > 6.8 && camera.position.z < -21.1
        if (onUpperFloor && (Math.abs(camera.position.x) > 3.1 || camera.position.z < -21.4)) constrainUpperPosition(camera.position)
        else {
          constrainGroundPosition(camera.position)
          camera.position.y = THREE.MathUtils.damp(camera.position.y, EYE_HEIGHT, 8, Math.min(dt, .05))
        }
      }
    }
    const h = heading.current
    if (!scroll.current.active) target.set(camera.position.x - Math.sin(h.yaw) * 15, camera.position.y + Math.sin(h.pitch) * 15, camera.position.z - Math.cos(h.yaw) * Math.cos(h.pitch) * 15)
    camera.lookAt(target)
  })
  return null
}
function Arc({ radius, y, thickness = .08, material, start = 0, length = Math.PI }: { radius: number; y: number; thickness?: number; material: THREE.Material; start?: number; length?: number }) {
  return <group position={[0, y, CENTER_Z]} rotation={[-Math.PI / 2, 0, 0]}><mesh rotation={[0, 0, start]} material={material} receiveShadow><torusGeometry args={[radius, thickness, 8, 144, length]} /></mesh></group>
}
function CurvedBand({ inner, outer, y, material, depth = .25 }: { inner: number; outer: number; y: number; material: THREE.Material; depth?: number }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.absarc(0, 0, outer, 0, Math.PI, false)
    shape.lineTo(-inner, 0)
    shape.absarc(0, 0, inner, Math.PI, 0, true)
    shape.closePath()
    const result = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 96 })
    result.rotateX(-Math.PI / 2)
    return result
  }, [inner, outer, depth])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <mesh geometry={geometry} position={[0, y, CENTER_Z]} material={material} castShadow receiveShadow />
}
function Column({ position, materials, height = 10.7 }: { position: [number, number, number]; materials: Materials; height?: number }) {
  return <group position={position}>
    <Block position={[0, .16, 0]} size={[1.15, .32, 1.15]} material={materials.marble} />
    <Block position={[0, .38, 0]} size={[.94, .13, .94]} material={materials.ivory} />
    <mesh position={[0, height / 2, 0]} material={materials.ivory} castShadow><cylinderGeometry args={[.32, .43, height - .8, 32]} /></mesh>
    {[.52, height - .45].map(y => <mesh key={y} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.brass}><torusGeometry args={[.4, .035, 8, 32]} /></mesh>)}
    <Block position={[0, height - .2, 0]} size={[1.1, .28, 1.1]} material={materials.ivory} />
    <Block position={[0, height, 0]} size={[1.3, .13, 1.3]} material={materials.marble} />
    {[-1, 1].map(side => <mesh key={side} position={[side * .35, height - .42, .05]} material={materials.ivory}><torusGeometry args={[.18, .075, 8, 20]} /></mesh>)}
  </group>
}
function Guardrail({ start, end, radius, materials }: { start: number; end: number; radius: number; materials: Materials }) {
  const postMesh = useRef<THREE.InstancedMesh>(null)
  const postGeometry = useMemo(() => new THREE.LatheGeometry([[.055, 0], [.07, .08], [.072, .18], [.048, .34], [.05, .52], [.07, .78], [.08, 1]].map(([x, y]) => new THREE.Vector2(x, y)), 12), [])
  const spacing = .82
  const count = Math.ceil((end - start) * radius / spacing) + 1
  const dummy = useMemo(() => new THREE.Object3D(), [])
  useEffect(() => {
    const mesh = postMesh.current
    if (!mesh) return
    for (let i = 0; i < count; i++) {
      const angle = THREE.MathUtils.lerp(start, end, i / (count - 1))
      dummy.position.set(...polar(radius, angle, GALLERY_FLOOR))
      dummy.scale.set(1, STAIR_RAIL_HEIGHT, 1)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [count, start, end, radius, dummy])
  useEffect(() => () => postGeometry.dispose(), [postGeometry])
  return <group>
    <instancedMesh ref={postMesh} args={[postGeometry, materials.ivory, count]} castShadow receiveShadow />
    <Arc radius={radius} y={GALLERY_FLOOR + .23} thickness={.055} material={materials.brass} start={start} length={end - start} />
    <Arc radius={radius} y={GALLERY_FLOOR + .68} thickness={.045} material={materials.ivory} start={start} length={end - start} />
    <Arc radius={radius} y={GALLERY_FLOOR + STAIR_RAIL_HEIGHT} thickness={.085} material={materials.marble} start={start} length={end - start} />
  </group>
}
/** The apse is built around real arch openings, rather than hiding a solid wall. */
function GalleryWall({ material }: { material: THREE.Material }) {
  const geometry = useMemo(() => circularWallGeometry(HALL_RADIUS, HALL_WALL_HEIGHT, CENTER_Z, [
    ...ARCH_ANGLES.flatMap(angle => [0, 5.2].map(floor => ({ angle, floor, radius: 1.62, spring: 2.65 }))),
    { angle: 0, floor: 0, radius: 1.62, spring: 2.65 },
    { angle: 0, floor: 5.2, radius: 1.62, spring: 2.65 },
    { angle: BASEMENT_ENTRY_ANGLE, floor: 0, radius: BASEMENT_ARCH_RADIUS, spring: BASEMENT_ARCH_SPRING },
    { angle: Math.PI, floor: 0, radius: 2.6, spring: 4.2 },
  ]), [])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <mesh geometry={geometry} material={material} castShadow receiveShadow />
}
function OpenArch({ index, materials }: { index: number; materials: Materials }) {
  const room = rooms[index]
  const [hovered, setHovered] = useState(false)
  const boardTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024; canvas.height = 800
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#14231c'; ctx.fillRect(0, 0, 1024, 800)
    ctx.strokeStyle = '#d4b879'; ctx.lineWidth = 5; ctx.strokeRect(20, 20, 984, 760)
    ctx.fillStyle = '#d4b879'; ctx.font = '26px sans-serif'; ctx.textAlign = 'center'
    ctx.fillText(`${String(index + 1).padStart(2, '0')} / ${index < 5 ? 'GROUND FLOOR' : 'UPPER GALLERY'}`, 512, 145)
    ctx.fillStyle = '#fff1ce'; ctx.font = '100px Georgia'
    const words = room.name.split(' ')
    const lines: string[] = []; let line = ''
    for (const word of words) { const next = line ? `${line} ${word}` : word; if (ctx.measureText(next).width > 880 && line) { lines.push(line); line = word } else line = next }
    if (line) lines.push(line)
    lines.forEach((text, i) => ctx.fillText(text, 512, 340 + i * 80))
    ctx.fillStyle = '#e6ce99'; ctx.font = '30px sans-serif'; ctx.fillText('ENTER GALLERY →', 512, 665)
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8
    return texture
  }, [index, room.name])
  useEffect(() => () => { boardTexture.dispose(); document.body.style.cursor = '' }, [boardTexture])
  const angle = roomAngle(index)
  const y = index < 5 ? 0 : 5.2
  const boardSide = angle < 0 ? -1 : 1
  const mount = boardMount(angle, boardSide)
  const mountLocal = new THREE.Vector3(...mount.position).sub(new THREE.Vector3(...polar(HALL_RADIUS, angle))).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
  const accent = ['#81a9d4', '#b8b08d', '#c0a37d', '#ab9bbd', '#98b8ab', '#c6b88d', '#b59a72', '#a8a8c6', '#a7ad9a', '#b28f76'][index]
  return <group position={polar(HALL_RADIUS, angle, y)} rotation={[0, -angle, 0]}>
    {/* Recessed stone reveals, a vaulted passage, and a lit exhibit beyond. */}
    {[-1, 1].map(side => <group key={side}>
      <Block position={[side * 1.8, 1.35, .12]} size={[.3, 2.7, .42]} material={materials.marble} />
      <Block position={[side * 1.8, .18, .2]} size={[.5, .36, .55]} material={materials.ivory} />
      <Block position={[side * 1.8, 2.64, .2]} size={[.5, .2, .6]} material={materials.ivory} />
      <Block position={[side * 1.75, 1.3, -2.8]} size={[.25, 2.65, 5.7]} material={materials.stone} />
      <Block position={[side * 1.59, .2, -2.8]} size={[.07, .38, 5.7]} material={materials.marble} />
    </group>)}
    <mesh position={[0, 2.65, -2.8]} rotation={[Math.PI / 2, 0, 0]} material={materials.stone} receiveShadow><cylinderGeometry args={[1.63, 1.63, 5.7, 40, 1, true, Math.PI / 2, Math.PI]} /></mesh>
    <Block position={[0, .015, -2.8]} size={[3.25, .03, 5.8]} material={materials.marble} />
    {[-1.38, 1.38].map(x => <Block key={x} position={[x, .04, -2.8]} size={[.025, .012, 5.7]} material={materials.brass} />)}
    {Array.from({ length: 17 }, (_, i) => <mesh key={i} position={[Math.cos(i / 16 * Math.PI) * 1.8, 2.67 + Math.sin(i / 16 * Math.PI) * 1.8, .1]} rotation={[0, 0, i / 16 * Math.PI - Math.PI / 2]} material={i === 8 ? materials.brass : materials.ivory} castShadow><boxGeometry args={[.31, .33, .5]} /></mesh>)}
    <mesh position={[0, 2.67, .32]} material={materials.brass}><torusGeometry args={[1.6, .025, 8, 64, Math.PI]} /></mesh>
    {[-1.7, -3.5].map(z => <mesh key={z} position={[0, 2.65, z]} material={materials.ivory}><torusGeometry args={[1.62, .055, 8, 48, Math.PI]} /></mesh>)}
    <Block position={[0, 2.15, -5.7]} size={[3.7, 4.4, .2]} material={materials.dark} />
    <Block position={[0, 1.9, -5.52]} size={[1.6, 2.1, .1]} material={materials.brass} />
    <mesh position={[0, 1.9, -5.45]}><planeGeometry args={[1.5, 2]} /><meshStandardMaterial color={accent} roughness={.85} /></mesh>
    <Block position={[0, .35, -4.4]} size={[.9, .7, .9]} material={materials.marble} />
    <mesh position={[0, 1, -4.4]}><icosahedronGeometry args={[.4, 1]} /><meshStandardMaterial color={accent} metalness={.3} roughness={.4} /></mesh>
    <pointLight position={[0, 3.3, -3]} intensity={14} color={accent} distance={8} />
    <pointLight position={[boardSide * 4.5, 3.1, 1]} intensity={hovered ? 12 : 6} color="#ffd28d" distance={5} />
    {/* Text is depth-tested WebGL geometry: walls and floors naturally hide it. */}
    <group position={[mountLocal.x, 2.15, mountLocal.z]} rotation={[0, angle - mount.angle, 0]} onClick={event => { event.stopPropagation(); window.location.assign(room.path) }} onPointerOver={event => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }} onPointerOut={() => { setHovered(false); document.body.style.cursor = '' }}>
      <Block position={[0, 0, 0]} size={[2.65, 2.15, .12]} material={materials.brass} />
      <mesh position={[0, 0, .065]}>
        <planeGeometry args={[2.5, 2]} />
        <meshBasicMaterial map={boardTexture} toneMapped={false} depthTest depthWrite />
      </mesh>
    </group>
  </group>
}
function Dome({ materials, lite }: { materials: Materials; lite: boolean }) {
  const radius = HALL_RADIUS, spring = HALL_WALL_HEIGHT, rise = 10.5
  const ribs = useMemo(() => Array.from({ length: 24 }, (_, i) => {
    const angle = i / 24 * Math.PI * 2
    return new THREE.CatmullRomCurve3(Array.from({ length: 41 }, (_, j) => {
      const t = j / 40 * Math.PI / 2
      return new THREE.Vector3(Math.cos(angle) * Math.cos(t) * (radius - .15), spring + Math.sin(t) * rise - .08, CENTER_Z + Math.sin(angle) * Math.cos(t) * (radius - .15))
    }))
  }), [radius, spring, rise])
  return <>
    <mesh position={[0, spring, CENTER_Z]} scale={[1, rise / radius, 1]}><sphereGeometry args={[radius, 112, 40, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#aaa28b" roughness={.95} side={THREE.BackSide} /></mesh>
    {ribs.map((rib, i) => <mesh key={i} material={materials.brass}><tubeGeometry args={[rib, 48, .065, 7, false]} /></mesh>)}
    {[.2, .4, .62, .84, 1.06, 1.28].map(t => <mesh key={t} position={[0, spring + Math.sin(t) * rise - .08, CENTER_Z]} rotation={[-Math.PI / 2, 0, 0]} material={materials.ivory}><torusGeometry args={[Math.cos(t) * (radius - .15), .09, 8, 144]} /></mesh>)}
    <mesh position={[0, spring + rise - .12, CENTER_Z]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[2.2, 64]} /><meshBasicMaterial color="#e2d8b7" /></mesh>
    <mesh position={[0, spring + rise - .16, CENTER_Z]} rotation={[-Math.PI / 2, 0, 0]} material={materials.brass}><torusGeometry args={[2.25, .13, 10, 80]} /></mesh>
    <pointLight position={[0, 17, CENTER_Z]} color="#dde3dc" intensity={lite ? 48 : 250} distance={52} />
  </>
}
function Chandelier({ materials, lite }: { materials: Materials; lite: boolean }) {
  return <group position={[0, 13.3, CENTER_Z]}>
    <mesh position={[0, 8.74, 0]} material={materials.brass}><cylinderGeometry args={[.72, .62, .2, 32]} /></mesh>
    <mesh position={[0, 4.45, 0]} material={materials.brass}><cylinderGeometry args={[.07, .09, 8.65, 12]} /></mesh>
    {[{ radius: 3.1, level: -.4, lamps: 16 }, { radius: 4.75, level: -1.35, lamps: 20 }, { radius: 6.15, level: -2.3, lamps: 24 }].map(({ radius, level, lamps }) => <group key={radius} position={[0, level, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.brass}><torusGeometry args={[radius, .095, 12, 120]} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.marble}><torusGeometry args={[radius - .18, .065, 8, 120]} /></mesh>
      {Array.from({ length: lamps }, (_, i) => <group key={i} position={[Math.cos(i / lamps * Math.PI * 2) * radius, 0, Math.sin(i / lamps * Math.PI * 2) * radius]}>
        <mesh position={[0, .18, 0]} material={materials.brass}><cylinderGeometry args={[.08, .12, .3, 8]} /></mesh>
        <mesh position={[0, .43, 0]} scale={[.16, .31, .16]}><sphereGeometry args={[.38, 10, 8]} /><meshBasicMaterial color="#fff0c8" toneMapped={false} /></mesh>
        <mesh position={[0, -.25, 0]} material={materials.ivory}><octahedronGeometry args={[.1]} /></mesh>
        <mesh position={[Math.cos(i / lamps * Math.PI * 2) * .25, -.08, Math.sin(i / lamps * Math.PI * 2) * .25]} material={materials.brass}>
          <torusGeometry args={[.23, .035, 6, 16, Math.PI]} />
        </mesh>
      </group>)}
    </group>)}
    <mesh position={[0, -2.7, 0]} scale={[.88, 1.15, .88]} material={materials.brass}><octahedronGeometry args={[1, 1]} /></mesh>
    <pointLight position={[0, -1.9, 0]} intensity={lite ? 32 : 170} color="#ffcd88" distance={48} decay={2} />
  </group>
}
function Statue() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/marble_bust_01/marble_bust_01_1k.gltf`)
  const model = useMemo(() => scene.clone(true), [scene])
  useEffect(() => { model.traverse(child => { if (child instanceof THREE.Mesh) { child.castShadow = true; child.receiveShadow = true } }) }, [model])
  return (
    <group position={[0, 0, 5]}>
      <mesh position={[0, 1.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.9, 2.8, 20]} />
        <meshStandardMaterial color="#d8ccb4" roughness={0.52} />
      </mesh>
      <mesh position={[0, 0.72, 0]} scale={[1.15, 0.72, 0.62]} castShadow receiveShadow>
        <sphereGeometry args={[1, 20, 12]} />
        <meshStandardMaterial color="#d8ccb4" roughness={0.52} />
      </mesh>
      <primitive object={model} scale={4.6} position={[0, 3.05, 0]} />
    </group>
  )
}
export type CuratorBoardId = 'education' | 'experience'
function CuratorBoard({ side, title, eyebrow, lines, accent, materials, id, onClick }: { side: number; title: string; eyebrow: string; lines: Array<[string, string]>; accent: string; materials: Materials; id: CuratorBoardId; onClick?: (id: CuratorBoardId) => void }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 900; canvas.height = 760
    const context = canvas.getContext('2d')!
    context.fillStyle = '#14231d'; context.fillRect(0, 0, canvas.width, canvas.height)
    context.strokeStyle = '#d1ae68'; context.lineWidth = 9; context.strokeRect(22, 22, canvas.width - 44, canvas.height - 44)
    context.strokeStyle = `${accent}aa`; context.lineWidth = 2; context.strokeRect(43, 43, canvas.width - 86, canvas.height - 86)
    context.textAlign = 'center'
    context.fillStyle = '#d8bd7d'; context.font = '24px sans-serif'; context.fillText(eyebrow, 450, 100)
    context.fillStyle = '#fff0c9'; context.font = 'bold 58px Georgia'; context.fillText(title, 450, 178)
    context.fillStyle = accent; context.fillRect(170, 214, 560, 4)
    context.textAlign = 'left'
    let y = 290
    for (const [heading, body] of lines) {
      context.fillStyle = '#e7ca8a'; context.font = 'bold 23px sans-serif'; context.fillText(heading, 105, y)
      context.fillStyle = '#f6ead0'; context.font = '25px Georgia'
      const words = body.split(' '); let line = ''; let row = 0
      for (const word of words) {
        const next = line ? `${line} ${word}` : word
        if (context.measureText(next).width > 680 && line) { context.fillText(line, 105, y + 39 + row * 32); line = word; row++ } else line = next
      }
      if (line) context.fillText(line, 105, y + 39 + row * 32)
      y += 132 + row * 16
    }
    context.textAlign = 'center'; context.fillStyle = '#c9ae72'; context.font = '18px sans-serif'
    context.fillText('THE CURATOR · THE MUSEUM OF KISHORE', 450, 704)
    const result = new THREE.CanvasTexture(canvas)
    result.colorSpace = THREE.SRGBColorSpace
    result.anisotropy = 1
    return result
  }, [accent, eyebrow, lines, title])
  useEffect(() => () => texture.dispose(), [texture])
  return <group position={[side * 4.25, 2.05, 5.1]} onClick={event => { event.stopPropagation(); onClick?.(id) }} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
    <mesh position={[0, 0, -.12]} castShadow><boxGeometry args={[3.8, 3.45, .22]} /><meshStandardMaterial color="#241b14" roughness={.5} /></mesh>
    <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[3.58, 3.23, .12]} /><meshStandardMaterial color="#b18a4d" metalness={.7} roughness={.32} /></mesh>
    <mesh position={[0, 0, .08]}><planeGeometry args={[3.38, 3.03]} /><meshBasicMaterial map={texture} toneMapped={false} depthTest depthWrite /></mesh>
    <pointLight position={[0, 0, .5]} intensity={10} color={accent} distance={5} />
    <mesh position={[0, -1.84, 0]} material={materials.brass}><cylinderGeometry args={[.24, .32, .35, 20]} /></mesh>
    <mesh position={[0, -1.42, 0]} material={materials.brass}><cylinderGeometry args={[.06, .08, 1.05, 16]} /></mesh>
  </group>
}
function BasementEntrance({ materials }: { materials: Materials }) {
  const signTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1000
    canvas.height = 760
    const context = canvas.getContext('2d')!
    context.fillStyle = '#17231f'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.strokeStyle = '#c9a968'
    context.lineWidth = 9
    context.strokeRect(24, 24, canvas.width - 48, canvas.height - 48)
    context.textAlign = 'center'
    context.fillStyle = '#d6bd7d'
    context.font = '30px sans-serif'
    context.fillText('B1  ·  LOWER LEVEL', canvas.width / 2, 145)
    context.fillStyle = '#f4e7c7'
    context.font = 'bold 82px Georgia'
    context.fillText('BASEMENT', canvas.width / 2, 300)
    context.fillStyle = '#d6bd7d'
    context.font = '42px Georgia'
    context.fillText('(FAILED PROJECTS)', canvas.width / 2, 385)
    context.strokeStyle = '#8c794f'; context.lineWidth = 2
    context.beginPath(); context.moveTo(150, 445); context.lineTo(850, 445); context.stroke()
    context.font = '27px sans-serif'
    context.fillText('EXPERIMENTS  ·  DEAD ENDS  ·  LESSONS', canvas.width / 2, 515)
    context.fillStyle = '#f4e7c7'; context.font = '26px sans-serif'
    context.fillText('ENTER THE ARCHIVE  ↓', canvas.width / 2, 635)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])
  useEffect(() => () => signTexture.dispose(), [signTexture])
  return <group position={polar(HALL_RADIUS, BASEMENT_ENTRY_ANGLE)} rotation={[0, -BASEMENT_ENTRY_ANGLE, 0]} onClick={event => { event.stopPropagation(); window.location.assign('/basement') }} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
    {/* The open voussoir arch matches the gallery entrances; the stairs visibly descend through the floor. */}
    {[-1, 1].map(side => <group key={side}>
      <Block position={[side * 1.98, 1.32, 0]} size={[.34, 2.64, .48]} material={materials.marble} />
      <Block position={[side * 1.98, .18, .08]} size={[.54, .36, .62]} material={materials.ivory} />
      <Block position={[side * 1.98, 2.67, .08]} size={[.56, .2, .62]} material={materials.ivory} />
    </group>)}
    {Array.from({ length: 17 }, (_, i) => {
      const a = i / 16 * Math.PI
      return <mesh key={i} position={[Math.cos(a) * 1.98, BASEMENT_ARCH_SPRING + Math.sin(a) * 1.98, .02]} rotation={[0, 0, a - Math.PI / 2]} material={i === 8 ? materials.brass : materials.ivory} castShadow><boxGeometry args={[.36, .38, .56]} /></mesh>
    })}
    <Block position={[3.34, 2.2, .13]} size={[2.48, 1.96, .18]} material={materials.brass} />
    <mesh position={[3.34, 2.2, .235]}><planeGeometry args={[2.3, 1.78]} /><meshBasicMaterial map={signTexture} toneMapped={false} /></mesh>
    {/* The stairwell stays open to view; slim rails mark the descent without boxing it in. */}
    {Array.from({ length: 8 }, (_, i) => <group key={`descent-${i}`} position={[0, -i * .17 - .085, .7 + i * .48]}>
      <Block position={[0, 0, 0]} size={[3.56 - i * .055, .17, .54]} material={materials.marble} />
      <Block position={[0, .086, .02]} size={[3.3 - i * .055, .018, .48]} material={materials.burgundy} />
    </group>)}
    {[-1, 1].map(side => <group key={`descent-rail-${side}`}>
      {Array.from({ length: 7 }, (_, i) => {
        const start = new THREE.Vector3(side * 1.83, -i * .17 + .92, .7 + i * .48)
        const end = new THREE.Vector3(side * 1.83, -(i + 1) * .17 + .92, .7 + (i + 1) * .48)
        const direction = end.clone().sub(start)
        return <mesh key={i} position={start.clone().add(end).multiplyScalar(.5)} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())} material={materials.brass}><cylinderGeometry args={[.055, .055, direction.length() + .02, 8]} /></mesh>
      })}
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[side * 1.83, -i * .34 + .43, .7 + i * .96]} material={materials.ivory}><cylinderGeometry args={[.045, .055, .9, 8]} /></mesh>)}
    </group>)}
    <Block position={[0, -1.3, 5.72]} size={[2.6, .12, .3]} material={materials.marble} />
    <mesh position={[0, -.94, 5.86]}><planeGeometry args={[2.35, .9]} /><meshBasicMaterial color="#101a17" /></mesh>
    <pointLight position={[0, 1.55, 3.8]} intensity={18} color="#c5d7c1" distance={8} />
    <pointLight position={[3.45, 2.1, .34]} intensity={10} color="#ffd99c" distance={5} />
  </group>
}
function Interior({ lite, view, interactive, zoom, onView, navigationKey, onScrollStage, onCuratorBoardClick }: { lite: boolean; view: HallView; interactive: boolean; zoom: number; onView: (view: HallView) => void; navigationKey: number; onScrollStage?: (view: HallView) => void; onCuratorBoardClick?: (id: CuratorBoardId) => void }) {
  const camera = useThree(state => state.camera)
  const textures = useMemo(() => ({ marble: createMarbleTexture(2, 2), wall: createStoneTexture(10, 2, '#c4b59c'), column: createColumnTexture(), plaque: createPlaqueTexture() }), [])
  const floorGeometry = useMemo(() => circularFloorWithOpening(HALL_RADIUS + .5, CENTER_Z, BASEMENT_ENTRY_ANGLE, 4.2, 6.3, HALL_RADIUS), [])
  const materials = useMemo<Materials>(() => ({
    stone: new THREE.MeshStandardMaterial({ map: textures.wall, bumpMap: textures.wall, bumpScale: .035, color: '#c2ae8f', roughness: .92, side: THREE.DoubleSide }),
    ivory: new THREE.MeshStandardMaterial({ map: textures.column, color: '#dfd1b7', roughness: .58 }),
    marble: new THREE.MeshStandardMaterial({ map: textures.marble, bumpMap: textures.marble, bumpScale: .012, color: '#b8ab96', roughness: .3 }),
    brass: new THREE.MeshStandardMaterial({ color: '#ac8749', metalness: .72, roughness: .33 }),
    walnut: new THREE.MeshStandardMaterial({ color: '#271b14', roughness: .48 }),
    dark: new THREE.MeshStandardMaterial({ color: '#16201e', roughness: .44 }),
    plaster: new THREE.MeshStandardMaterial({ color: '#a9a28a', roughness: .95 }),
    burgundy: new THREE.MeshStandardMaterial({ color: '#32151b', roughness: 1 }),
  }), [textures])
  useEffect(() => () => { Object.values(textures).forEach(t => t.dispose()); Object.values(materials).forEach(m => m.dispose()); floorGeometry.dispose() }, [textures, materials, floorGeometry])
  return <>
    <Camera key={navigationKey} view={view} interactive={interactive} zoom={zoom} onScrollStage={onScrollStage} />
    <fog attach="fog" args={['#171c1b', 70, 150]} />
    <ambientLight intensity={.32} color="#d6c5a9" />
    <hemisphereLight args={['#c3d2dc', '#45321f', .9]} />
    <directionalLight position={[-12, 25, 18]} intensity={2.3} color="#f8e4c2" castShadow={!lite} shadow-mapSize={[1024, 1024]} shadow-camera-left={-36} shadow-camera-right={36} shadow-camera-top={36} shadow-camera-bottom={-36} shadow-bias={-.0003} />
    <pointLight position={[2, 9, 9]} intensity={110} distance={50} color="#ffe0ac" />
    <mesh geometry={floorGeometry} position={[0, 0, CENTER_Z]} receiveShadow>
      {lite ? <meshStandardMaterial map={textures.marble} color="#726e61" roughness={.55} /> : <MeshReflectorMaterial map={textures.marble} resolution={256} blur={[100, 30]} mixBlur={1} mixStrength={1.2} mirror={.22} color="#787466" roughness={.4} metalness={.18} />}
    </mesh>
    {/* Inlaid concentric marble bands replace the flat checkerboard floor. */}
    {[3, 7, 13].map(radius => <mesh key={radius} position={[0, .015, CENTER_Z]} rotation={[-Math.PI / 2, 0, 0]} material={materials.brass}><ringGeometry args={[radius, radius + .035, 144]} /></mesh>)}
    {Array.from({ length: 24 }, (_, i) => {
      const theta = i / 24 * Math.PI * 2, radialAngle = theta + Math.PI / 2
      if (Math.abs(Math.atan2(Math.sin(radialAngle - BASEMENT_ENTRY_ANGLE), Math.cos(radialAngle - BASEMENT_ENTRY_ANGLE))) < .09) return null
      return <mesh key={i} position={[0, .012, CENTER_Z]} rotation={[-Math.PI / 2, 0, theta]} material={materials.dark}><ringGeometry args={[7, HALL_RADIUS, 1, 1, 0, .002]} /></mesh>
    })}
    {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[Math.sin(i / 16 * Math.PI * 2) * 4.3, .018, CENTER_Z - Math.cos(i / 16 * Math.PI * 2) * 4.3]} rotation={[-Math.PI / 2, 0, -i / 16 * Math.PI * 2]} material={i % 2 ? materials.marble : materials.dark}><circleGeometry args={[.65, 4]} /></mesh>)}
    {/* Continuous semicircular apse and curved upper gallery. */}
    <GalleryWall material={materials.stone} />
    <MuseumPortal position={[0, 0, CENTER_Z + HALL_RADIUS - .25]} rotation={Math.PI} destination="/" title="Museum Gate" caption="Return to the courtyard →" stone={textures.wall} radius={2.6} spring={4.2} wallWidth={12} wallHeight={HALL_WALL_HEIGHT} closedDoor />
    <BasementEntrance materials={materials} />
    {/* Continuous cornices tie the full perimeter to the wall and dome. */}
    {[10.9, 11.25, 11.5].map(y => <Arc key={y} radius={HALL_RADIUS - .12} y={y} thickness={y === 11.25 ? .2 : .1} material={materials.ivory} length={Math.PI * 2} />)}
    <Arc radius={HALL_RADIUS - .3} y={11.05} thickness={.065} material={materials.brass} length={Math.PI * 2} />
    <CurvedBand inner={HALL_BALCONY_INNER} outer={HALL_RADIUS + .05} y={4.92} depth={.28} material={materials.marble} />
    {/* A single matched balustrade follows the slab edge and ends at both stair openings. */}
    <Guardrail start={-Math.PI / 2} end={Math.PI / 2} radius={HALL_BALCONY_INNER} materials={materials} />
    {/* Real piers under the balcony carry the slab; perimeter columns meet the cornice. */}
    {[-1.48, -1.18, -.7, -.16, .16, .7, 1.18, 1.48].map(a => <group key={`pier${a}`} position={polar(HALL_BALCONY_INNER + .2, a)} rotation={[0, -a, 0]}><Column position={[0, 0, 0]} materials={materials} height={4.92} /></group>)}
    {[-2.95, -2.6, -1.18, -.7, -.18, .18, .7, 1.18, 2.6, 2.95].map(a => <group key={`column${a}`} position={polar(HALL_RADIUS - .12, a)} rotation={[0, -a, 0]}><Column position={[0, 0, 0]} materials={materials} height={11.3} /></group>)}
    <Dome materials={materials} lite={lite} /><Chandelier materials={materials} lite={lite} />
    {/* Mirrored side stairs keep the central rotunda open for the collection. */}
    <group onClick={e => { e.stopPropagation(); onView(camera.position.y > GALLERY_FLOOR + 1 ? 'stairs' : 'upper') }} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
      {[-1, 1].map(side => <group key={side}>
        {Array.from({ length: STAIR_STEPS }, (_, i) => {
          const angle = THREE.MathUtils.lerp(STAIR_BOTTOM_ANGLE, Math.PI / 2, i / (STAIR_STEPS - 1))
          const height = Math.max(.18, sideStairHeight(angle) + .01)
          const position = polar(STAIR_WALK_RADIUS, side * angle, height / 2)
          const stepAngle = side * angle - Math.sign(side) * Math.PI / 2
          return <group key={i} position={position} rotation={[0, stepAngle, 0]}>
            <Block position={[0, 0, 0]} size={[4.2, height, .78]} material={materials.marble} />
            <Block position={[0, height / 2 + .012, .02]} size={[3.1, .025, .72]} material={materials.burgundy} />
          </group>
        })}
        {[-2.03, 2.03].map(offset => {
          const count = STAIR_RAIL_POST_COUNT - 1
          const points = Array.from({ length: count + 1 }, (_, i) => sideStairRailPosition(side as -1 | 1, offset, i / count))
          return <group key={offset}>
            {points.slice(1).map((end, i) => {
              const start = points[i], direction = end.clone().sub(start)
              return <mesh key={i} position={start.clone().add(end).multiplyScalar(.5)} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())} material={materials.brass}><cylinderGeometry args={[.075, .075, direction.length() + .02, 8]} /></mesh>
            })}
            {Array.from({ length: STAIR_RAIL_POST_COUNT }, (_, i) => {
              const railPoint = sideStairRailPosition(side as -1 | 1, offset, i / (STAIR_RAIL_POST_COUNT - 1))
              const foot = railPoint.clone().add(new THREE.Vector3(0, -STAIR_RAIL_HEIGHT / 2, 0))
              return <mesh key={i} position={foot} material={materials.marble}><cylinderGeometry args={[.045, .06, STAIR_RAIL_HEIGHT, 8]} /></mesh>
            })}
          </group>
        })}
      </group>)}
    </group>
    {rooms.filter(room => room.id !== 'basement').map((_, i) => <OpenArch key={i} index={i} materials={materials} />)}
    {/* Museum sculpture, with a circular stepped marble plinth. */}
    <group position={[0, 0, 5]} onClick={() => onView('statue')}>
      {[{ r: 1.9, h: .18, y: .09 }, { r: 1.65, h: .18, y: .27 }, { r: 1.15, h: .16, y: .43 }].map(({ r, h, y }) => <mesh key={r} position={[0, y, 0]} material={materials.dark} castShadow receiveShadow><cylinderGeometry args={[r, r, h, 64]} /></mesh>)}
      <Block position={[0, 1.3, 0]} size={[1.8, 1.6, 1.6]} material={materials.marble} />
      <Block position={[0, 2.16, 0]} size={[2.05, .13, 1.85]} material={materials.brass} />
      <mesh position={[0, 1.4, .81]}><planeGeometry args={[1.4, .68]} /><meshBasicMaterial map={textures.plaque} /></mesh>
    </group>
    <Suspense fallback={null}><Statue /></Suspense>
    <CuratorBoard
      side={-1}
      title="EDUCATION"
      eyebrow="THE FOUNDATIONS"
      id="education"
      onClick={onCuratorBoardClick}
      accent="#8eb6b0"
      materials={materials}
      lines={[
        ['CHENNAI INSTITUTE OF TECHNOLOGY', 'B.Tech in Artificial Intelligence and Data Science'],
        ['2023 — 2027', `${profile.cgpa} CGPA · Generative AI · Deep learning · Software engineering`],
      ]}
    />
    <CuratorBoard
      side={1}
      title="EXPERIENCE"
      eyebrow="THE PRACTICE"
      id="experience"
      onClick={onCuratorBoardClick}
      accent="#d2a765"
      materials={materials}
      lines={[
        ['MICROSOFT · MAY — JULY 2026', 'Software Engineer Intern · Anomaly detection, monitoring and automation'],
        ['RESEARCH · NOV — DEC 2024', 'Research Intern · Voice interfaces, chess AI and deep learning'],
      ]}
    />
  </>
}
export function HallScene({ lite = false, interactive = true, zoom = 1, view = 'arrival', onView, navigationKey = 0, onScrollStage, onCuratorBoardClick }: { lite?: boolean; interactive?: boolean; zoom?: number; view?: HallView; onView: (view: HallView) => void; navigationKey?: number; onScrollStage?: (view: HallView) => void; onCuratorBoardClick?: (id: CuratorBoardId) => void }) {
  return <SceneBoundary><Canvas fallback={<SceneFallback />} shadows={!lite} dpr={lite ? [0.7, 0.85] : [1, 1.25]} camera={{ position: [0, 4.1, 27], fov: 58, far: 160 }} gl={{ antialias: !lite }} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.1 }}>
    <color attach="background" args={['#171c1b']} /><Interior lite={lite} view={view} interactive={interactive} zoom={zoom} onView={onView} navigationKey={navigationKey} onScrollStage={onScrollStage} onCuratorBoardClick={onCuratorBoardClick} />
  </Canvas></SceneBoundary>
}
