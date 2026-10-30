import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { getScenePhases, useSceneProgress } from './scene'
import type { MuseumTextures } from './textures'

export function MuseumLamp({
  x,
  z,
  textures,
}: {
  x: number
  z: number
  textures: MuseumTextures
}) {
  const progress = useSceneProgress()
  const light = useRef<THREE.PointLight>(null)
  const glowMaterial = useRef<THREE.SpriteMaterial>(null)
  const glow = useRef<THREE.Sprite>(null)

  const materials = useMemo(() => {
    return {
      metal: new THREE.MeshStandardMaterial({
        color: '#241c12',
        roughness: 0.4,
        metalness: 0.72,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: '#c9a35e',
        roughness: 0.3,
        metalness: 0.82,
        emissive: '#2a1c08',
        emissiveIntensity: 0.3,
      }),
    }
  }, [])

  useEffect(() => () => Object.values(materials).forEach(m => m.dispose()), [materials])

  useFrame(() => {
    const phases = getScenePhases(progress.current)
    const level = phases.lamp
    if (light.current) light.current.intensity = 22 * level
    if (glowMaterial.current) glowMaterial.current.opacity = 0.1 + level * 0.55
    if (glow.current) {
      const size = 1.7 + level * 1.1
      glow.current.scale.set(size, size, 1)
    }
  })

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.08, 0]} material={materials.metal} castShadow>
        <cylinderGeometry args={[0.24, 0.3, 0.16, 12]} />
      </mesh>
      <mesh position={[0, .38, 0]} material={materials.metal} castShadow><cylinderGeometry args={[.11, .2, .62, 16]} /></mesh>
      {[.7, 1.0, 3.75, 4.14].map(y => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.gold}><torusGeometry args={[.075, .025, 6, 16]} /></mesh>)}
      <mesh position={[0, 2.25, 0]} material={materials.metal} castShadow>
        <cylinderGeometry args={[0.045, 0.065, 4.4, 10]} />
      </mesh>
      <mesh position={[0, 4.38, 0]} material={materials.gold} castShadow>
        <cylinderGeometry args={[0.16, 0.1, 0.14, 10]} />
      </mesh>

      <group position={[0, 4.82, 0]}>
        <mesh>
          <boxGeometry args={[0.42, 0.66, 0.42]} />
          <meshBasicMaterial color="#ffe0a8" toneMapped={false} />
        </mesh>
        {[-0.24, 0.24].map((dx) =>
          [-0.24, 0.24].map((dz) => (
            <mesh key={`${dx}-${dz}`} position={[dx, 0, dz]} material={materials.gold}>
              <boxGeometry args={[0.045, 0.72, 0.045]} />
            </mesh>
          )),
        )}
        {[-0.26, 0.26].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.gold}>
            <boxGeometry args={[0.52, 0.04, 0.52]} />
          </mesh>
        ))}
        <mesh position={[0, 0.42, 0]} material={materials.gold} castShadow>
          <coneGeometry args={[0.36, 0.28, 4]} />
        </mesh>
        <mesh position={[0, 0.6, 0]} material={materials.gold}>
          <sphereGeometry args={[0.07, 10, 10]} />
        </mesh>
      </group>

      <pointLight
        ref={light}
        position={[0, 4.82, 0]}
        color="#ffb45e"
        intensity={0}
        distance={15}
        decay={2}
      />
      <sprite ref={glow} position={[0, 4.82, 0]} scale={[1.8, 1.8, 1]}>
        <spriteMaterial
          ref={glowMaterial}
          map={textures.glow}
          color="#ffbd72"
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  )
}
