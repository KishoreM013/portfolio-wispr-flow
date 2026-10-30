import { useMemo } from 'react'
import * as THREE from 'three'
import { SKILLS_DOME_RISE, SKILLS_DOME_SPRING, SKILLS_ROOM_RADIUS, skillDomePoint } from './skillsRoomLayout'

/** Shallow architectural dome: the ceiling and its coffers are visible from the aisle. */
export function SkillsDome({ lite }: { lite: boolean }) {
  const ribs = useMemo(() => Array.from({ length: lite ? 12 : 20 }, (_, i) => {
    const angle = i / (lite ? 12 : 20) * Math.PI * 2
    return new THREE.CatmullRomCurve3(Array.from({ length: 33 }, (_, j) => new THREE.Vector3(...skillDomePoint(angle, j / 32 * Math.PI / 2))))
  }), [lite])
  return <group>
    <mesh position={[0, SKILLS_DOME_SPRING, 0]} scale={[1, SKILLS_DOME_RISE / SKILLS_ROOM_RADIUS, 1]} receiveShadow>
      <sphereGeometry args={[SKILLS_ROOM_RADIUS, 96, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#304552" roughness={.93} side={THREE.BackSide} />
    </mesh>
    {ribs.map((curve, i) => <mesh key={i}><tubeGeometry args={[curve, 40, .07, 7, false]} /><meshStandardMaterial color="#b7a06b" metalness={.35} roughness={.5} /></mesh>)}
    {[.22, .45, .69, .93, 1.17].map(t => <mesh key={t} position={[0, SKILLS_DOME_SPRING + Math.sin(t) * SKILLS_DOME_RISE - .1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[(SKILLS_ROOM_RADIUS - .18) * Math.cos(t), .07, 8, 128]} />
      <meshStandardMaterial color="#b7a06b" metalness={.3} roughness={.55} />
    </mesh>)}
    {[{ y: SKILLS_DOME_SPRING - .25, r: SKILLS_ROOM_RADIUS - .28, width: .18 }, { y: SKILLS_DOME_SPRING - .05, r: SKILLS_ROOM_RADIUS - .15, width: .13 }].map(({ y, r, width }) => <mesh key={y} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[r, width, 10, 144]} /><meshStandardMaterial color="#c4b68d" roughness={.5} /></mesh>)}
    <mesh position={[0, SKILLS_DOME_SPRING + SKILLS_DOME_RISE - .13, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.8, 64]} /><meshBasicMaterial color="#e2d3a7" toneMapped={false} />
    </mesh>
    <mesh position={[0, SKILLS_DOME_SPRING + SKILLS_DOME_RISE - .17, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[1.85, .11, 10, 64]} /><meshStandardMaterial color="#b69b60" metalness={.5} roughness={.4} /></mesh>
    <pointLight position={[0, 11.4, 0]} intensity={180} distance={38} color="#e8dfc5" />
  </group>
}
