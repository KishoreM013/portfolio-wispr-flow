import { MuseumPortal } from './MuseumPortal'
import { circularWallGeometry } from './museumArchitecture'
import { SkillsDome } from './SkillsDome'
import { SceneBoundary, SceneFallback } from '../SceneBoundary'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { skills, featuredSkillIds, categoryColors, levels, type Skill } from '../../data/skills'
import { createGlowTexture, createMarbleTexture, createStoneTexture } from './textures'
import { ratingOrbit, skillOrbitAngle, skillsWalkPosition, SKILLS_SYSTEM_HEIGHT, SKILLS_ROOM_RADIUS, SKILLS_DOME_SPRING, SKILLS_DOME_RISE, SKILLS_DEFAULT_PITCH, skillBubbleScale } from './skillsRoomLayout'

type PlanetariumProps = { paused: boolean; mobile: boolean; reduced: boolean; lite: boolean; step: number; centreKey: number; selectedId?: string; onSelect: (s: Skill) => void; onHover: (s: Skill | null) => void; onOpenCatalogue: () => void }
function skillGlyph(skill: Skill) {
  return { typescript: 'TS', javascript: 'JS', python: 'Py', cpp: 'C++', csharp: 'C#', htmlcss: '</>', java: 'J', pytorch: 'PT', genai: 'AI', rag: 'RAG', cuda: 'GPU', git: 'Git', dsa: 'DSA', ghidra: 'GH', songwriting: '♪', walking: 'W', 'problem-solving': 'PS', debugging: 'DB', communication: 'COM', teamwork: 'TW' }[skill.id] || skill.name.slice(0, 2)
}
export function SkillLogo({ skill }: { skill: Skill }) {
  return <span aria-hidden="true">{skillGlyph(skill)}</span>
}
function labelTexture(lines: string[], color = '#ecd6a0', background?: string) {
  const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = lines.length > 1 ? 240 : 160
  const c = canvas.getContext('2d')!
  if (background) { c.fillStyle = background; c.fillRect(0, 0, canvas.width, canvas.height) }
  c.textAlign = 'center'; c.fillStyle = color; c.shadowColor = '#050a13'; c.shadowBlur = 10
  lines.forEach((line, i) => { c.font = `${i ? 40 : 54}px ${i ? 'sans-serif' : 'Georgia'}`; c.fillText(line, 320, lines.length > 1 ? 90 + i * 90 : 95, 600) })
  const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}
function skillBoardTexture() {
  const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 900
  const c = canvas.getContext('2d')!
  c.fillStyle = '#12251f'; c.fillRect(0, 0, canvas.width, canvas.height)
  c.strokeStyle = '#c9a968'; c.lineWidth = 10; c.strokeRect(22, 22, canvas.width - 44, canvas.height - 44)
  c.fillStyle = '#f0d79d'; c.textAlign = 'center'; c.font = 'bold 42px Georgia'; c.fillText('THE SKILLS ORRERY', 600, 82)
  c.font = '22px sans-serif'; c.fillStyle = '#a9c5b2'; c.fillText('TOUCH THE SUN FOR THE FULL CATALOGUE', 600, 120)
  c.textAlign = 'left'; c.font = '24px sans-serif'
  skills.forEach((skill, i) => {
    const column = i % 3, row = Math.floor(i / 3), x = 70 + column * 375, y = 175 + row * 57
    c.fillStyle = categoryColors[skill.category]; c.fillText(`${'★'.repeat(skill.stars)}${'☆'.repeat(5 - skill.stars)}`, x, y)
    c.fillStyle = '#e8dfc8'; c.fillText(skill.name, x + 120, y)
  })
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4
  return texture
}
function RoomCamera({ step, centreKey, reduced }: { step: number; centreKey: number; reduced: boolean }) {
  const { gl, camera, size } = useThree()
  const walk = useRef({ target: 0, current: 0 })
  const previousStep = useRef(0)
  const heading = useRef({ yaw: 0, pitch: SKILLS_DEFAULT_PITCH })
  const look = useMemo(() => new THREE.Vector3(), [])
  useEffect(() => { walk.current.target += (step - previousStep.current) * Math.PI / 4; previousStep.current = step; heading.current.yaw = 0 }, [step])
  useEffect(() => { walk.current.target = Math.round(walk.current.current / (Math.PI * 2)) * Math.PI * 2; heading.current.yaw = 0; heading.current.pitch = SKILLS_DEFAULT_PITCH }, [centreKey])
  useEffect(() => {
    const canvas = gl.domElement, root = canvas.closest('.skills-room') || canvas.parentElement
    let drag: { x: number; y: number; touch: boolean; mode: 'pending' | 'look' | 'walk' } | null = null, distance = 0
    const walkBy = (pixels: number) => { walk.current.target += pixels * .0018 }
    const wheel = (e: WheelEvent) => {
      if (e.ctrlKey || (e.target instanceof HTMLElement && e.target.closest('button,a,nav,[role="dialog"],.gallery-exhibit-card,.skills-rating-key'))) return
      e.preventDefault(); walkBy(THREE.MathUtils.clamp(e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1), -240, 240))
    }
    const down = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType !== 'touch') return
      drag = { x: e.clientX, y: e.clientY, touch: e.pointerType === 'touch', mode: e.pointerType === 'touch' ? 'pending' : 'look' }; distance = 0; canvas.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y
      if (drag.mode === 'pending') { if (Math.hypot(dx, dy) < 6) return; drag.mode = Math.abs(dx) > Math.abs(dy) ? 'look' : 'walk' }
      distance += Math.abs(dx) + Math.abs(dy)
      if (drag.mode === 'walk') walkBy(-dy * 2)
      else { heading.current.yaw -= dx * .004; if (!drag.touch) heading.current.pitch = THREE.MathUtils.clamp(heading.current.pitch - dy * .003, -.5, .75) }
      drag.x = e.clientX; drag.y = e.clientY
    }
    const up = () => { drag = null }
    const click = (e: MouseEvent) => { if (distance > 8) { e.stopImmediatePropagation(); distance = 0 } }
    const key = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('button,a,input,textarea,[role="dialog"]')) return
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') { e.preventDefault(); walkBy(75) }
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') { e.preventDefault(); walkBy(-75) }
      if (e.key.toLowerCase() === 'a') heading.current.yaw += .12
      if (e.key.toLowerCase() === 'd') heading.current.yaw -= .12
      if (e.key.toLowerCase() === 'r') { heading.current.yaw = 0; heading.current.pitch = SKILLS_DEFAULT_PITCH }
    }
    root?.addEventListener('wheel', wheel as EventListener, { passive: false }); canvas.addEventListener('pointerdown', down); canvas.addEventListener('click', click, true)
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up); window.addEventListener('blur', up); window.addEventListener('keydown', key)
    return () => { root?.removeEventListener('wheel', wheel as EventListener); canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('click', click, true); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); window.removeEventListener('blur', up); window.removeEventListener('keydown', key) }
  }, [gl])
  useFrame((_, dt) => {
    walk.current.current = reduced ? walk.current.target : THREE.MathUtils.damp(walk.current.current, walk.current.target, 5, Math.min(dt, .05))
    camera.position.set(...skillsWalkPosition(walk.current.current, size.width < 640))
    const yaw = walk.current.current + heading.current.yaw, pitch = heading.current.pitch
    look.set(camera.position.x - Math.sin(yaw) * Math.cos(pitch) * 12, camera.position.y + Math.sin(pitch) * 12, camera.position.z - Math.cos(yaw) * Math.cos(pitch) * 12)
    camera.lookAt(look)
  })
  return null
}
function Planet({ skill, angle: start, paused, active, reduced, onSelect, onHover }: { skill: Skill; angle: number; paused: boolean; active: boolean; reduced: boolean; onSelect: (s: Skill) => void; onHover: (s: Skill | null) => void }) {
  const group = useRef<THREE.Group>(null), angle = useRef(start)
  const bubble = useRef<THREE.Group>(null), label = useRef<THREE.Sprite>(null)
  const [hovered, setHovered] = useState(false)
  const radius = ratingOrbit(skill.stars), color = categoryColors[skill.category]
  const texture = useMemo(() => labelTexture([active || hovered ? skill.name : skillGlyph(skill), `${'★'.repeat(skill.stars)}${'☆'.repeat(5 - skill.stars)}`], color), [skill, color, active, hovered])
  useEffect(() => () => texture.dispose(), [texture])
  useEffect(() => () => { document.body.style.cursor = '' }, [])
  useFrame((_, dt) => {
    if (!paused) angle.current += Math.min(dt, .05) * .024
    group.current?.position.set(Math.sin(angle.current) * radius, SKILLS_SYSTEM_HEIGHT, Math.cos(angle.current) * radius)
    const targetScale = skillBubbleScale(hovered, active)
    if (bubble.current) {
      const scale = reduced ? targetScale : THREE.MathUtils.damp(bubble.current.scale.x, targetScale, 10, Math.min(dt, .05))
      bubble.current.scale.setScalar(scale)
      if (label.current) label.current.position.y = -.48 - Math.max(0, scale - 1) * .22
    }
  })
  return <group ref={group} position={[Math.sin(start) * radius, SKILLS_SYSTEM_HEIGHT, Math.cos(start) * radius]} onClick={e => { e.stopPropagation(); onSelect(skill) }} onPointerOver={e => { e.stopPropagation(); if (e.pointerType === 'mouse') { setHovered(true); onHover(skill) }; document.body.style.cursor = 'pointer' }} onPointerOut={event => {
    const stillInside = event.intersections.some(hit => {
      let object: THREE.Object3D | null = hit.object
      while (object) { if (object === group.current) return true; object = object.parent }
      return false
    })
    if (stillInside) return
    setHovered(false); onHover(null); document.body.style.cursor = ''
  }}>
    <group ref={bubble}>
    <mesh><sphereGeometry args={[.19, 24, 20]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.28} metalness={.25} roughness={.4} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.27, .012, 6, 24]} /><meshBasicMaterial color={color} transparent opacity={.6} /></mesh>
    </group>
    <sprite ref={label} position={[0, -.48, 0]} scale={active || hovered ? [1.5, .56, 1] : [.72, .36, 1]}><spriteMaterial map={texture} transparent depthTest depthWrite={false} toneMapped={false} /></sprite>
  </group>
}
function Observatory(props: PlanetariumProps) {
  const { mobile, paused, reduced, lite, selectedId, onSelect, onHover, onOpenCatalogue } = props
  const assets = useMemo(() => ({ stone: createStoneTexture(8, 2, '#797f79'), wallGeometry: circularWallGeometry(SKILLS_ROOM_RADIUS, SKILLS_DOME_SPRING, 0, [{ angle: Math.PI, floor: 0, radius: 2.6, spring: 3.4 }]), marble: createMarbleTexture(2, 2), glow: createGlowTexture(), name: labelTexture(['Kishore M', 'A universe of practice'], '#fff0c6'), board: skillBoardTexture(), levels: levels.map((name, i) => labelTexture([name, `${5 - i} STARS`], '#ecd5a0', '#142329')) }), [])
  useEffect(() => () => { assets.stone.dispose(); assets.wallGeometry.dispose(); assets.marble.dispose(); assets.glow.dispose(); assets.name.dispose(); assets.board.dispose(); assets.levels.forEach(t => t.dispose()) }, [assets])
  const stars = useMemo(() => { const p = new Float32Array((mobile ? 180 : 600) * 3); for (let i = 0; i < p.length; i += 3) { const a = i * 2.399, y = .15 + (Math.sin(i * 9.7) + 1) * .35; const r = Math.sqrt(1 - y * y) * (SKILLS_ROOM_RADIUS - .3); p[i] = Math.sin(a) * r; p[i + 1] = SKILLS_DOME_SPRING + y * SKILLS_DOME_RISE - .2; p[i + 2] = Math.cos(a) * r } return p }, [mobile])
  const shown = mobile ? skills.filter(s => featuredSkillIds.slice(0, 7).includes(s.id) || s.id === selectedId) : skills
  return <>
    <RoomCamera step={props.step} centreKey={props.centreKey} reduced={reduced} />
    <color attach="background" args={['#111d24']} /><ambientLight intensity={.6} color="#c9d5d0" /><hemisphereLight args={['#bcceda', '#453c2b', .9]} />
    <directionalLight position={[0, 16, 12]} intensity={1.9} color="#f3dfb8" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[SKILLS_ROOM_RADIUS, 96]} /><meshStandardMaterial map={assets.marble} color="#777966" roughness={.4} metalness={.12} /></mesh>
    <mesh geometry={assets.wallGeometry}><meshStandardMaterial map={assets.stone} color="#8b948d" roughness={.9} side={THREE.DoubleSide} /></mesh>
    <MuseumPortal position={[0, 0, SKILLS_ROOM_RADIUS - .25]} rotation={Math.PI} destination="/hall" title="The Grand Rotunda" caption="Return to the Main Hall →" stone={assets.stone} wallWidth={12} wallHeight={SKILLS_DOME_SPRING} />
    <SkillsDome lite={lite} />
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[stars, 3]} /></bufferGeometry><pointsMaterial color="#ece4d2" size={mobile ? .05 : .035} transparent opacity={.9} depthWrite={false} /></points>
    {[.3, 1.2, SKILLS_DOME_SPRING - .4].map(y => <mesh key={y} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[SKILLS_ROOM_RADIUS - .25, .09, 8, 144]} /><meshStandardMaterial color="#b49a62" metalness={.6} roughness={.4} /></mesh>)}
    {Array.from({ length: 20 }, (_, i) => i / 20 * Math.PI * 2).map(a => <group key={a} position={[Math.sin(a) * (SKILLS_ROOM_RADIUS - .55), 0, Math.cos(a) * (SKILLS_ROOM_RADIUS - .55)]}>
      <mesh position={[0, SKILLS_DOME_SPRING / 2, 0]}><cylinderGeometry args={[.32, .42, SKILLS_DOME_SPRING, 24]} /><meshStandardMaterial map={assets.stone} color="#c1bda5" roughness={.6} /></mesh>
      <mesh position={[0, SKILLS_DOME_SPRING - .2, 0]}><boxGeometry args={[1.15, .35, 1.15]} /><meshStandardMaterial color="#c9b888" roughness={.5} /></mesh>
      <pointLight position={[0, 7, 0]} intensity={lite ? 14 : 22} distance={14} color="#f4d3a0" />
    </group>)}
    {levels.map((_, i) => {
      const wallAngle = Math.PI - .7 + i * .35, wallRadius = SKILLS_ROOM_RADIUS - .35
      return <group key={i}>
        <mesh position={[0, SKILLS_SYSTEM_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[ratingOrbit(5 - i), .016, 8, 144]} /><meshBasicMaterial color="#b39862" transparent opacity={.65} /></mesh>
        <group position={[Math.sin(wallAngle) * wallRadius, 3.8, Math.cos(wallAngle) * wallRadius]} rotation={[0, Math.PI + wallAngle, 0]}>
          <mesh><boxGeometry args={[3.6, 1.6, .1]} /><meshStandardMaterial color="#a98c52" metalness={.6} roughness={.4} /></mesh>
          <mesh position={[0, 0, .065]}><planeGeometry args={[3.4, 1.42]} /><meshBasicMaterial map={assets.levels[i]} toneMapped={false} /></mesh>
        </group>
      </group>
    })}
    {/* A low exhibition stage grounds the orrery within the larger hall. */}
    <mesh position={[0, .09, 0]} receiveShadow><cylinderGeometry args={[8.65, 8.8, .18, 112]} /><meshStandardMaterial map={assets.marble} color="#a49b82" roughness={.5} /></mesh>
    {[8.65, 11, 18, 21.8].map(radius => <mesh key={radius} position={[0, radius === 8.65 ? .19 : .015, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[radius, radius + .045, 144]} /><meshStandardMaterial color="#af945a" metalness={.6} roughness={.4} /></mesh>)}
    <pointLight position={[0, 9, 0]} intensity={130} distance={38} color="#d9d7c3" />
    <mesh position={[0, .56, 0]}><cylinderGeometry args={[1.35, 1.5, .95, 64]} /><meshStandardMaterial map={assets.marble} color="#b1a68b" roughness={.5} /></mesh>
    <group position={[0, SKILLS_SYSTEM_HEIGHT, 0]} onClick={e => { e.stopPropagation(); onOpenCatalogue() }} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.cos(i * Math.PI / 6) * .86, Math.sin(i * Math.PI / 6) * .86, 0]} rotation={[0, 0, i * Math.PI / 6]}><boxGeometry args={[.34, .07, .08]} /><meshBasicMaterial color="#f0bd62" /></mesh>)}
      <mesh><sphereGeometry args={[.58, 40, 32]} /><meshStandardMaterial color="#ffcf7e" emissive="#ffb84c" emissiveIntensity={1.7} roughness={.9} /></mesh>
    </group>
    <sprite position={[0, SKILLS_SYSTEM_HEIGHT, 0]} scale={[3.4, 3.4, 1]}><spriteMaterial map={assets.glow} color="#ffc36e" opacity={.3} transparent blending={THREE.AdditiveBlending} depthWrite={false} /></sprite>
    <sprite position={[0, SKILLS_SYSTEM_HEIGHT + 1.1, 0]} scale={[3, 1.12, 1]}><spriteMaterial map={assets.name} transparent depthWrite={false} toneMapped={false} /></sprite>
    <pointLight position={[0, SKILLS_SYSTEM_HEIGHT + 1, 0]} color="#ffd192" intensity={45} distance={20} />
    <group position={[Math.sin(.72) * (SKILLS_ROOM_RADIUS - .32), 4.35, Math.cos(.72) * (SKILLS_ROOM_RADIUS - .32)]} rotation={[0, Math.PI + .72, 0]}>
      <mesh position={[0, 0, -.06]}><boxGeometry args={[8.4, 5.9, .18]} /><meshStandardMaterial color="#9b7c48" metalness={.6} roughness={.38} /></mesh>
      <mesh position={[0, 0, .055]}><boxGeometry args={[8.08, 5.58, .08]} /><meshStandardMaterial color="#d4c29b" roughness={.8} /></mesh>
      <mesh position={[0, 0, .105]}><planeGeometry args={[7.82, 5.32]} /><meshBasicMaterial map={assets.board} toneMapped={false} /></mesh>
      <pointLight position={[0, 0, .8]} intensity={8} distance={10} color="#f2d29a" />
    </group>
    {shown.map(skill => { const peers = shown.filter(s => s.stars === skill.stars); return <Planet key={skill.id} skill={skill} active={skill.id === selectedId} angle={skillOrbitAngle(peers.indexOf(skill), peers.length, skill.stars)} paused={paused || reduced || mobile} reduced={reduced} onSelect={onSelect} onHover={onHover} /> })}
  </>
}
export function PlanetariumScene(props: PlanetariumProps) {
  return <SceneBoundary><Canvas fallback={<SceneFallback />} dpr={[1, props.lite ? 1 : 1.5]} camera={{ position: skillsWalkPosition(0, props.mobile), fov: props.mobile ? 78 : 70, far: 110 }} gl={{ antialias: true }}><Observatory {...props} /></Canvas></SceneBoundary>
}
