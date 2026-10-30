import { SceneBoundary, SceneFallback } from '../SceneBoundary'
import { useMediaQuery } from '../../hooks/useDevice'
import { createContext, useContext, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import {
  createColumnTexture,
  createMarbleTexture,
  createStoneTexture,
} from './textures'

type ProgressRef = { current: number }
const CorridorProgressContext = createContext<ProgressRef | null>(null)
function useCorridorProgress() {
  const progress = useContext(CorridorProgressContext)
  if (!progress) throw new Error('useCorridorProgress must be used inside CorridorScene')
  return progress
}

type CorridorSceneProps = {
  progressRef: ProgressRef
  lite?: boolean
  interactive?: boolean
}

type CorridorTextures = {
  wall: THREE.Texture
  column: THREE.Texture
  marble: THREE.Texture
}

function useCorridorMaterials(textures: CorridorTextures) {
  return useMemo(
    () => ({
      wall: new THREE.MeshStandardMaterial({
        map: textures.wall,
        color: '#a8947a',
        roughness: 0.9,
        metalness: 0.02,
      }),
      column: new THREE.MeshStandardMaterial({
        map: textures.column,
        color: '#c9b89d',
        roughness: 0.75,
        metalness: 0.03,
      }),
      marble: new THREE.MeshStandardMaterial({
        map: textures.marble,
        color: '#ffffff',
        roughness: 0.35,
        metalness: 0.05,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: '#c9a35e',
        roughness: 0.3,
        metalness: 0.82,
        emissive: '#2a1c08',
        emissiveIntensity: 0.25,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: '#0f0c08',
        roughness: 0.85,
        metalness: 0.05,
      }),
      glow: new THREE.MeshBasicMaterial({
        color: '#ffd9a0',
        transparent: true,
        opacity: 0.15,
        toneMapped: false,
        depthWrite: false,
      }),
    }),
    [textures],
  )
}

function CorridorCamera({ interactive }: { interactive: boolean }) {
  const progress = useCorridorProgress()
  const camera = useThree((state) => state.camera)
  const pointer = useThree((state) => state.pointer)
  const initialized = useRef(false)

  useFrame((_, delta) => {
    const p = progress.current
    const startZ = 0.5
    const endZ = -22
    const currentZ = startZ + (endZ - startZ) * p

    const swayX = interactive ? pointer.x * 0.2 : 0
    const swayY = interactive ? pointer.y * 0.08 : 0
    const desired = new THREE.Vector3(swayX, 1.6 + swayY, currentZ)
    const desiredLook = new THREE.Vector3(swayX * 0.1, 1.5 + swayY * 0.1, currentZ - 5)

    if (!initialized.current) {
      camera.position.copy(desired)
      camera.lookAt(desiredLook)
      initialized.current = true
    } else {
      camera.position.lerp(desired, 1 - Math.exp(-8 * delta))
      camera.lookAt(desiredLook.x, desiredLook.y, desiredLook.z)
    }
  })

  return null
}

function CorridorLights({ materials }: { materials: ReturnType<typeof useCorridorMaterials> }) {
  const progress = useCorridorProgress()
  const pointLightRef = useRef<THREE.PointLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)

  const positions = [-1, 1].flatMap((side) =>
    [0, 1, 2, 3, 4, 5, 6].map((i) => [side * 3.2, 2.8, -2 - i * 3.5] as [number, number, number])
  )

  useFrame(() => {
    const p = progress.current
    if (pointLightRef.current) pointLightRef.current.intensity = p * 120
    if (ambientRef.current) ambientRef.current.intensity = 0.15 + p * 0.2
  })

  return (
    <>
      {positions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, -0.25, 0.05]} material={materials.gold}>
            <boxGeometry args={[0.06, 0.5, 0.06]} />
          </mesh>
          <mesh position={[0, 0.1, 0.05]}>
            <sphereGeometry args={[0.14, 12, 10]} />
            <meshBasicMaterial color="#ffd9a0" toneMapped={false} />
          </mesh>
          <pointLight position={[0, 0.1, 0.15]} color="#ffb45e" intensity={8} distance={8} decay={2} />
        </group>
      ))}
      <pointLight
        ref={pointLightRef}
        position={[0, 1.8, -20]}
        color="#ffd9a0"
        intensity={0}
        distance={15}
        decay={2}
      />
      <ambientLight ref={ambientRef} intensity={0.15} color="#ffd9a0" />
    </>
  )
}

function CorridorRoom({ materials, lite, isMobile }: { materials: ReturnType<typeof useCorridorMaterials>; lite: boolean; isMobile: boolean }) {
  const simple = lite || isMobile
  const corridorLength = 24
  const segmentCount = 8

  return (
    <>
      {/* Floor - reflective marble */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -corridorLength / 2]} receiveShadow>
        <planeGeometry args={[6.4, corridorLength]} />
        {simple ? (
          <meshStandardMaterial map={materials.marble.map} color="#b9a98c" roughness={0.35} metalness={0.08} />
        ) : (
          <MeshReflectorMaterial
            blur={[200, 60]}
            resolution={512}
            mixBlur={1}
            mixStrength={16}
            roughness={0.5}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#4a3d2e"
            metalness={0.3}
            mirror={0.4}
          />
        )}
      </mesh>

      {/* Red carpet runner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, -corridorLength / 2]} receiveShadow>
        <planeGeometry args={[1.8, corridorLength - 2]} />
        <meshStandardMaterial color="#461212" roughness={0.94} metalness={0.01} />
      </mesh>
      {/* Gold trim on carpet edges */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[side * 0.92, 0.012, -corridorLength / 2]}
          receiveShadow
        >
          <planeGeometry args={[0.035, corridorLength - 2]} />
          <meshBasicMaterial color="#c9a35e" toneMapped={false} />
        </mesh>
      ))}

      {/* Left wall */}
      <mesh position={[-3.2, 3, -corridorLength / 2]} material={materials.wall} receiveShadow>
        <boxGeometry args={[0.5, 6, corridorLength]} />
      </mesh>

      {/* Right wall */}
      <mesh position={[3.2, 3, -corridorLength / 2]} material={materials.wall} receiveShadow>
        <boxGeometry args={[0.5, 6, corridorLength]} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 6, -corridorLength / 2]} material={materials.dark} receiveShadow>
        <boxGeometry args={[6.4, 0.4, corridorLength]} />
      </mesh>

      {/* Gold ceiling trim */}
      <mesh position={[0, 5.8, -corridorLength / 2]} material={materials.gold}>
        <boxGeometry args={[6.8, 0.08, corridorLength]} />
      </mesh>

      {/* Columns along corridor */}
      {Array.from({ length: segmentCount + 1 }).map((_, i) => {
        const z = -2 - i * (corridorLength / segmentCount)
        return (
          <group key={i} position={[0, 0, z]}>
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * 2.9, 2.5, 0]} material={materials.column} castShadow receiveShadow>
                <cylinderGeometry args={[0.22, 0.28, 5, 16]} />
              </mesh>
            ))}
            {/* Arch connecting columns */}
            <mesh position={[0, 5.1, 0]} material={materials.gold}>
              <torusGeometry args={[2.9, 0.05, 8, 24, Math.PI]} />
            </mesh>
          </group>
        )
      })}

      {/* Door frame at end of corridor */}
      <DoorFrame materials={materials} />

      {/* Entrance arch behind (where we came from) */}
      <group position={[0, 0, 2]}>
        <mesh position={[0, 2.1, 0]} material={materials.gold}>
          <torusGeometry args={[1.6, 0.06, 8, 24, Math.PI]} />
        </mesh>
      </group>
    </>
  )
}

function DoorFrame({ materials }: { materials: ReturnType<typeof useCorridorMaterials> }) {
  const progress = useCorridorProgress()
  const doorRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (doorRef.current) {
      const p = progress.current
      const targetRotation = p > 0.7 ? -Math.PI / 3 : 0
      doorRef.current.rotation.y += (targetRotation - doorRef.current.rotation.y) * 0.05
    }
  })

  return (
    <group position={[0, 0, -23]}>
      {/* Door frame sides */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.35, 1.25, 0.26]} material={materials.column} castShadow receiveShadow>
          <boxGeometry args={[0.3, 2.5, 0.2]} />
        </mesh>
      ))}
      {/* Door frame top */}
      <mesh position={[0, 2.6, 0.26]} material={materials.column} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.3, 0.2]} />
      </mesh>
      {/* Gold arch over door */}
      <mesh position={[0, 2.75, 0.27]} material={materials.gold} castShadow>
        <torusGeometry args={[1.35, 0.05, 8, 24, Math.PI]} />
      </mesh>

      {/* The door itself - slightly ajar when progress > 0.8 */}
      <group ref={doorRef} position={[0, 1.25, 0.38]}>
        <mesh material={materials.dark} castShadow receiveShadow>
          <boxGeometry args={[2.4, 2.5, 0.08]} />
        </mesh>
        <mesh position={[0, 0, -0.06]} material={materials.gold} castShadow>
          <boxGeometry args={[2.5, 2.6, 0.02]} />
        </mesh>
        {/* Door handle */}
        <mesh position={[0.9, -0.3, 0.07]} material={materials.gold} castShadow>
          <sphereGeometry args={[0.08, 8, 6]} />
        </mesh>
      </group>

      {/* Glow spilling from door */}
      <mesh position={[0, 1.2, -0.15]} material={materials.glow}>
        <planeGeometry args={[3, 2.8]} />
      </mesh>
    </group>
  )
}

function CorridorContent({ lite, isMobile, interactive }: { lite: boolean; isMobile: boolean; interactive: boolean }) {
  const textures = useMemo<CorridorTextures>(
    () => ({
      wall: createStoneTexture(2.5, 2, '#8a785f'),
      column: createColumnTexture(),
      marble: createMarbleTexture(1.5, 1.5),
    }),
    [],
  )
  const materials = useCorridorMaterials(textures)

  return (
    <>
      <fog attach="fog" args={['#08070d', 15, 40]} />
      <ambientLight intensity={0.2} color="#8a7d6a" />
      <hemisphereLight args={['#5a4d3a', '#1a1208', 0.4]} />
      <CorridorCamera interactive={interactive} />
      <CorridorLights materials={materials} />
      <CorridorRoom materials={materials} lite={lite} isMobile={isMobile} />
    </>
  )
}

export function CorridorScene({ progressRef, lite = false, interactive = true }: CorridorSceneProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <SceneBoundary><Canvas
      fallback={<SceneFallback />}
      shadows={!lite}
      dpr={lite ? [1, 1] : [1, 1.5]}
      camera={{
        position: [0, 1.6, 0.5],
        fov: isMobile ? 55 : 45,
        near: 0.1,
        far: 60,
      }}
      gl={{
        antialias: !lite,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        gl.shadowMap.type = THREE.PCFShadowMap
      }}
    >
      <color attach="background" args={['#08070d']} />
      <CorridorProgressContext.Provider value={progressRef}>
        <CorridorContent lite={lite} isMobile={isMobile} interactive={interactive} />
      </CorridorProgressContext.Provider>
    </Canvas></SceneBoundary>
  )
}
