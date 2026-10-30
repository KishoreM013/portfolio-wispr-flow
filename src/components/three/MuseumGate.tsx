import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { getScenePhases, useSceneProgress } from './scene'
import type { MuseumTextures } from './textures'
import { ArchitecturalGeometry } from './exteriorArchitecture'

const HALF_WIDTH = 10.1

function GateHalf({ side, bronze, gold }: { side: 1 | -1; bronze: THREE.Material; gold: THREE.Material }) {
  const progress = useSceneProgress()
  const group = useRef<THREE.Group>(null)
  const geometry = useMemo(() => {
    const b = new ArchitecturalGeometry()
    for (let i = 0; i < 13; i++) {
      const x = -side * (.35 + i * .79)
      b.box('bronze', [x, 1.62, 0], [.052, 3.12, .07])
      b.add('trim', new THREE.ConeGeometry(.085, .3, 6), [x, 3.3, 0])
      for (const dir of [-1, 1]) b.sphere('trim', [x + dir * .075, 3.16, 0], [.035, .12, .035], [0, 0, dir * -.45])
      b.box('trim', [x, 1.72, .015], [.14, .14, .09], [0, 0, Math.PI / 4])
      if (i === 12) continue
      // Mirrored, hand-forged C-scrolls fill the lower iron panels.
      const center = x - side * .395
      for (const dir of [-1, 1]) {
        const points = Array.from({ length: 25 }, (_, j) => {
          const t = j / 24, angle = t * Math.PI * 2.5, radius = .26 * (1 - .82 * t)
          return new THREE.Vector3(center + dir * Math.cos(angle) * radius, .85 + Math.sin(angle) * radius * 1.3, .005)
        })
        b.tube('bronze', points, .026, 24)
      }
      b.ring('bronze', [center, 2.44, 0], .28, .027)
      b.box('bronze', [center, 2.78, 0], [.035, .76, .055])
    }
    for (const y of [.34, 1.35, 1.72, 3.15]) b.box('bronze', [-side * 5.03, y, 0], [9.7, y === 3.15 ? .12 : .075, .12])
    for (const y of [1.29, 3.22]) b.box('trim', [-side * 5.03, y, .015], [9.7, .03, .055])
    b.box('bronze', [-side * 9.94, 1.65, 0], [.15, 3.3, .16])
    // Raised central oval cartouche and radiating bars.
    const cx = -side * 5.03
    b.ring('trim', [cx, 2.32, .04], .64, .045)
    b.ring('bronze', [cx, 2.32, .04], .54, .032)
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2
      b.beam('trim', [cx + Math.cos(a) * .18, 2.32 + Math.sin(a) * .18, .045], [cx + Math.cos(a) * .52, 2.32 + Math.sin(a) * .52, .045], .025, .03)
    }
    return b.finish()
  }, [side])
  useEffect(() => () => Object.values(geometry).forEach(g => g.dispose()), [geometry])
  useFrame(() => {
    if (group.current) group.current.rotation.y = -side * getScenePhases(progress.current).gate * 1.9
  })
  return <group ref={group} position={[side * HALF_WIDTH, 0, 13]}>
    <mesh geometry={geometry.bronze} material={bronze} castShadow />
    <mesh geometry={geometry.trim} material={gold} castShadow />
  </group>
}

export function MuseumGate({ textures }: { textures: MuseumTextures }) {
  const materials = useMemo(() => {
    return {
      stone: new THREE.MeshStandardMaterial({
        map: textures.wall,
        color: '#b8aa90',
        roughness: 0.88,
        metalness: 0.02,
      }),
      bronze: new THREE.MeshStandardMaterial({
        color: '#16120c',
        roughness: 0.42,
        metalness: 0.7,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: '#a0916a',
        roughness: 0.52,
        metalness: 0.8,
        emissive: '#241806',
        emissiveIntensity: 0.04,
      }),
    }
  }, [textures])

  useEffect(() => () => Object.values(materials).forEach(m => m.dispose()), [materials])
  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 10.7, 0, 13]}>
          <mesh position={[0, 2.2, 0]} material={materials.stone} castShadow receiveShadow>
            <boxGeometry args={[1.3, 4.4, 1.3]} />
          </mesh>
          <mesh position={[0, 0.18, 0]} material={materials.stone} castShadow receiveShadow>
            <boxGeometry args={[1.62, 0.36, 1.62]} />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0, .65 + i * .47, .02]} material={materials.stone} castShadow><boxGeometry args={[i % 2 ? 1.39 : 1.47, .43, 1.39]} /></mesh>)}
          <mesh position={[0, 4.29, 0]} material={materials.stone} castShadow><boxGeometry args={[1.42, .15, 1.42]} /></mesh>
          <mesh position={[0, 4.46, 0]} material={materials.stone} castShadow>
            <boxGeometry args={[1.52, 0.16, 1.52]} />
          </mesh>
          <mesh position={[0, 4.75, 0]} material={materials.gold} castShadow>
            <sphereGeometry args={[0.26, 18, 18]} />
          </mesh>
          <mesh position={[0, 2.5, .73]}><planeGeometry args={[.8, .8]} /><meshBasicMaterial map={textures.medallion} transparent toneMapped={false} /></mesh>
        </group>
      ))}

      {[-1, 1].map((side) => (
        <group key={`wall-${side}`} position={[side * 17.95, 0, 13]}>
          <mesh position={[0, 0.7, 0]} material={materials.stone} castShadow receiveShadow>
            <boxGeometry args={[12.9, 1.4, 0.72]} />
          </mesh>
          <mesh position={[0, 1.45, 0]} material={materials.gold} castShadow>
            <boxGeometry args={[13, 0.1, 0.8]} />
          </mesh>
          {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[-6.15 + i * .425, 2.15, 0]} material={materials.bronze} castShadow><boxGeometry args={[.045, 1.4, .055]} /></mesh>)}
          <mesh position={[0, 2.75, 0]} material={materials.bronze}><boxGeometry args={[12.9, .07, .09]} /></mesh>
        </group>
      ))}

      <GateHalf side={-1} bronze={materials.bronze} gold={materials.gold} />
      <GateHalf side={1} bronze={materials.bronze} gold={materials.gold} />
    </group>
  )
}
