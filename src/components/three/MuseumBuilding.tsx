import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import type { MuseumTextures } from './textures'
import { getScenePhases, useSceneProgress } from './scene'
import { MuseumFacade } from './MuseumFacade'

type BuildingProps = {
  textures: MuseumTextures
  lite?: boolean
}

function useBuildingMaterials(textures: MuseumTextures) {
  const materials = useMemo(() => {
    return {
      stone: new THREE.MeshStandardMaterial({
        map: textures.wall,
        color: '#ffffff',
        roughness: 0.86,
        metalness: 0.02,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: '#ad9360',
        roughness: 0.43,
        metalness: 0.85,
        emissive: '#2a1c08',
        emissiveIntensity: 0.08,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: '#17120c',
        roughness: 0.52,
        metalness: 0.25,
      }),
      wood: new THREE.MeshStandardMaterial({
        map: textures.wood,
        color: '#ffffff',
        roughness: 0.42,
        metalness: 0.16,
      }),
      red: new THREE.MeshStandardMaterial({
        color: '#451111',
        roughness: 0.92,
        metalness: 0.02,
      }),
      marble: new THREE.MeshStandardMaterial({
        color: '#d9c9ad',
        roughness: 0.32,
        metalness: 0.04,
      }),
      corridor: new THREE.MeshStandardMaterial({
        map: textures.wall,
        color: '#6f5d46',
        roughness: 0.92,
        metalness: 0.01,
      }),
    }
  }, [textures])

  return materials
}

function Doors({
  textures,
  wood,
  gold,
  stone,
  marble,
  corridor,
  red,
}: {
  textures: MuseumTextures
  wood: THREE.Material
  gold: THREE.Material
  stone: THREE.Material
  marble: THREE.Material
  corridor: THREE.Material
  red: THREE.Material
}) {
  const progress = useSceneProgress()
  const left = useRef<THREE.Group>(null)
  const right = useRef<THREE.Group>(null)
  const light = useRef<THREE.PointLight>(null)
  const beam = useRef<THREE.SpotLight>(null)
  const beamTarget = useRef<THREE.Object3D>(null)
  const glowMaterial = useRef<THREE.SpriteMaterial>(null)
  const glow = useRef<THREE.Sprite>(null)

  useEffect(() => {
    if (beam.current && beamTarget.current) {
      beam.current.target = beamTarget.current
      beam.current.target.updateMatrixWorld()
    }
  }, [])

  useFrame(() => {
    const phases = getScenePhases(progress.current)
    const angle = phases.doors * 1.94
    if (left.current) left.current.rotation.y = angle
    if (right.current) right.current.rotation.y = -angle
    if (light.current) light.current.intensity = phases.doors * 6 + phases.beam * 5
    if (beam.current) beam.current.intensity = phases.beam * 80
    if (glowMaterial.current) glowMaterial.current.opacity = 0.08 + phases.doors * 0.35
    if (glow.current) {
      const size = 2.6 + phases.doors * 3.8
      glow.current.scale.set(size, size, 1)
    }
  })

  const panelTrim = (side: number) => (
    <>
      {[-1.77, -.48, 1.22].map((y, index) => (
        <group key={y} position={[side * 1.1, y, .09]}>
          <mesh material={gold}><boxGeometry args={[1.77, index === 2 ? 1.8 : 1.04, .045]} /></mesh>
          <mesh position={[0, 0, .03]} material={wood}><boxGeometry args={[1.66, index === 2 ? 1.69 : .93, .055]} /></mesh>
          <mesh position={[0, 0, .067]} material={wood}><boxGeometry args={[1.43, index === 2 ? 1.47 : .71, .055]} /></mesh>
        </group>
      ))}

    </>
  )

  return (
    <group>
      {/* a deep, warm corridor glimpsed through the doors */}
      <mesh position={[0, 2.06, -2.9]} material={marble} receiveShadow>
        <boxGeometry args={[4.4, 0.12, 10.2]} />
      </mesh>
      <mesh position={[0, 2.145, -2.9]} material={red} receiveShadow>
        <boxGeometry args={[2.2, 0.02, 10]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={`wall-${side}`}
          position={[side * 2.185, 4.65, -3.9]}
          rotation={[0, side * (Math.PI / 2), 0]}
          material={corridor}
          receiveShadow
        >
          <planeGeometry args={[8, 5.3]} />
        </mesh>
      ))}
      <mesh position={[0, 7.285, -3.9]} rotation={[Math.PI / 2, 0, 0]} material={corridor} receiveShadow>
        <planeGeometry args={[4.4, 8]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`wainscot-${side}`} position={[side * 2.16, 2.78, -3.9]} material={wood}>
          <boxGeometry args={[0.05, 1.3, 8]} />
        </mesh>
      ))}
      {[-1, 1].map((side) =>
        [-1, -3, -5, -7].map((z) => (
          <mesh key={`${side}-${z}`} position={[side * 2.12, 4.7, z]} material={gold} castShadow>
            <boxGeometry args={[0.1, 5.2, 0.1]} />
          </mesh>
        )),
      )}
      {[-1, 1].map((side) => (
        <mesh key={`rail-${side}`} position={[side * 2.15, 7.24, -3.9]} material={gold}>
          <boxGeometry args={[0.09, 0.09, 8]} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <mesh key={`chair-${side}`} position={[side * 2.15, 3.42, -3.9]} material={gold}>
          <boxGeometry args={[0.05, 0.05, 8]} />
        </mesh>
      ))}
      {[-1.6, -3.9, -6.2].map((z) => (
        <mesh key={`beam-${z}`} position={[0, 7.18, z]} material={gold}>
          <boxGeometry args={[4.4, 0.13, 0.16]} />
        </mesh>
      ))}
      <mesh position={[0, 4.7, -8.02]} material={stone} receiveShadow>
        <boxGeometry args={[4.6, 5.4, 0.2]} />
      </mesh>
      <mesh position={[0, 5.1, -7.88]} material={gold}>
        <torusGeometry args={[1.16, 0.04, 8, 48]} />
      </mesh>
      <mesh position={[0, 5.1, -7.9]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={textures.medallion} transparent toneMapped={false} />
      </mesh>
      <pointLight position={[0, 5.4, -7.4]} color="#ffcf8a" intensity={4.5} distance={7} decay={2} />
      <pointLight position={[0, 5.6, -3.2]} color="#ffcf8a" intensity={3.5} distance={7} decay={2} />
      <pointLight position={[0, 5.6, -5.6]} color="#ffcf8a" intensity={3.5} distance={7} decay={2} />
      <pointLight position={[0, 5, 1.6]} color="#ffcf8a" intensity={3} distance={7} decay={2} />

      <group ref={left} position={[-2.25, 4.85, 2.27]}>
        <mesh position={[1.1, 0, 0]} material={wood} castShadow>
          <boxGeometry args={[2.18, 5.2, 0.14]} />
        </mesh>
        {panelTrim(1)}
        <mesh position={[2.01, -0.05, 0.12]} material={gold}>
          <boxGeometry args={[0.055, 0.62, 0.055]} />
        </mesh>
        <mesh position={[2.01, 0.3, 0.12]} material={gold}>
          <sphereGeometry args={[0.06, 12, 12]} />
        </mesh>
      </group>

      <group ref={right} position={[2.25, 4.85, 2.27]}>
        <mesh position={[-1.1, 0, 0]} material={wood} castShadow>
          <boxGeometry args={[2.18, 5.2, 0.14]} />
        </mesh>
        {panelTrim(-1)}
        <mesh position={[-2.01, -0.05, 0.12]} material={gold}>
          <boxGeometry args={[0.055, 0.62, 0.055]} />
        </mesh>
        <mesh position={[-2.01, 0.3, 0.12]} material={gold}>
          <sphereGeometry args={[0.06, 12, 12]} />
        </mesh>
      </group>

      <mesh position={[0, 7.55, 2.26]} material={gold} castShadow>
        <boxGeometry args={[5.25, 0.22, 0.24]} />
      </mesh>
      {[-2.55, 2.55].map((x) => (
        <mesh key={x} position={[x, 4.85, 2.26]} material={gold} castShadow>
          <boxGeometry args={[0.18, 5.55, 0.24]} />
        </mesh>
      ))}

      <pointLight position={[0, 8.5, 6]} color="#ffd7a0" intensity={10} distance={12} decay={2} />
      <pointLight ref={light} position={[0, 4.3, 1.55]} color="#ffd8a0" distance={20} decay={2} intensity={0} />
      <spotLight
        ref={beam}
        position={[0, 4.9, 1.2]}
        color="#ffd39a"
        intensity={0}
        distance={28}
        angle={0.55}
        penumbra={1}
        decay={2}
      />
      <object3D ref={beamTarget} position={[0, 0.6, 12]} />

      <sprite ref={glow} position={[0, 4.7, 2.55]} scale={[3.2, 3.2, 1]}>
        <spriteMaterial
          ref={glowMaterial}
          map={textures.glow}
          color="#ffd9a0"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  )
}

export function MuseumBuilding({ textures, lite = false }: BuildingProps) {
  const m = useBuildingMaterials(textures)
  useEffect(() => () => Object.values(m).forEach(material => material.dispose()), [m])

  return (
    <group>
      <MuseumFacade textures={textures} lite={lite} />
      <Doors textures={textures} wood={m.wood} gold={m.gold} stone={m.stone} marble={m.marble} corridor={m.corridor} red={m.red} />
      {[-2.95, 2.95].map((x) => (
        <group key={x} position={[x, 6.1, 2.3]}>
          <mesh material={m.dark} castShadow><boxGeometry args={[.28, .95, .1]} /></mesh>
          <mesh position={[0, .17, .2]} material={m.gold}><boxGeometry args={[.08, .65, .32]} /></mesh>
          <mesh position={[0, .55, .35]}><boxGeometry args={[.24, .45, .24]} /><meshBasicMaterial color="#ffe2b3" toneMapped={false} /></mesh>
          {[-.15, .15].map(dx => <mesh key={dx} position={[dx, .55, .49]} material={m.dark}><boxGeometry args={[.035, .52, .035]} /></mesh>)}
          <mesh position={[0, .88, .35]} material={m.dark}><coneGeometry args={[.28, .22, 4]} /></mesh>
          <pointLight position={[0, .55, .6]} color="#ffcf90" intensity={6} distance={6} decay={2} />
        </group>
      ))}
    </group>
  )
}
