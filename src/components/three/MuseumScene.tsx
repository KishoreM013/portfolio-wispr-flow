import { SceneBoundary, SceneFallback } from '../SceneBoundary'
import { useMediaQuery } from '../../hooks/useDevice'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MuseumBuilding } from './MuseumBuilding'
import { MuseumGate } from './MuseumGate'
import { MuseumLamp } from './MuseumLamp'
import { exteriorCameraRoute, exteriorCameraStart } from './exteriorArchitecture'
import {
  SceneProgressContext,
  getScenePhases,
  useSceneProgress,
  type ProgressRef,
} from './scene'
import { createMuseumTextures, type MuseumTextures } from './textures'

type MuseumSceneProps = {
  progressRef: ProgressRef
  lite?: boolean
  interactive?: boolean
}

function CameraRig({
  isMobile,
  interactive,
}: {
  isMobile: boolean
  interactive: boolean
}) {
  const progress = useSceneProgress()
  const camera = useThree((state) => state.camera)
  const pointer = useThree((state) => state.pointer)
  const initialized = useRef(false)
  const size = useThree(state => state.size)
  const aspect = size.width / Math.max(1, size.height)

  const curve = useMemo(() => exteriorCameraRoute(aspect, isMobile ? 55 : 45), [aspect, isMobile])

  const targetRef = useRef(new THREE.Vector3())
  const lookRef = useRef(new THREE.Vector3(0, 8.25, 0))

  useFrame((_, delta) => {
    const phases = getScenePhases(progress.current)
    const target = targetRef.current, look = lookRef.current
    curve.getPoint(phases.approach, target)

    const lookHeight = THREE.MathUtils.lerp(8.25, 5.1, phases.approach)
    if (interactive) {
      const sway = 1 - phases.approach * 0.8
      target.x += pointer.x * 0.34 * sway
      target.y += pointer.y * 0.14 * sway
      look.x = pointer.x * 0.18 * sway
      look.y = lookHeight + pointer.y * 0.08 * sway
    } else {
      look.x = 0
      look.y = lookHeight
    }

    if (!initialized.current) {
      camera.position.copy(target)
      initialized.current = true
    } else {
      camera.position.lerp(target, 1 - Math.exp(-6 * delta))
    }
    camera.lookAt(look)
  })

  return null
}

function WarmSpot({
  position,
  target,
  intensity,
  color = '#ffd39a',
  angle = 0.5,
  penumbra = 1,
  distance = 32,
  castShadow = false,
}: {
  position: [number, number, number]
  target: [number, number, number]
  intensity: number
  color?: string
  angle?: number
  penumbra?: number
  distance?: number
  castShadow?: boolean
}) {
  const light = useRef<THREE.SpotLight>(null)
  const targetRef = useRef<THREE.Object3D>(null)

  useEffect(() => {
    if (light.current && targetRef.current) {
      light.current.target = targetRef.current
      light.current.target.updateMatrixWorld()
    }
  }, [])

  return (
    <>
      <spotLight
        ref={light}
        position={position}
        color={color}
        intensity={intensity}
        angle={angle}
        penumbra={penumbra}
        distance={distance}
        decay={2}
        castShadow={castShadow}
        shadow-mapSize-width={castShadow ? 1024 : 256}
        shadow-mapSize-height={castShadow ? 1024 : 256}
        shadow-bias={-0.0004}
      />
      <object3D ref={targetRef} position={target} />
    </>
  )
}

function Lights({ lite, isMobile }: { lite: boolean; isMobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.36} color="#b5bcc9" />
      <hemisphereLight args={['#b6c8df', '#554839', 0.85]} />
      <directionalLight
        position={[-22, 32, 22]}
        intensity={2.1}
        color="#d1d9ea"
        castShadow={!lite}
        shadow-mapSize-width={isMobile ? 512 : 2048}
        shadow-mapSize-height={isMobile ? 512 : 2048}
        shadow-camera-left={-36}
        shadow-camera-right={36}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <WarmSpot position={[-15, 3, 9]} target={[-15, 8, 0]} intensity={170} angle={0.68} />
      <WarmSpot position={[15, 3, 9]} target={[15, 8, 0]} intensity={170} angle={0.68} />
      <WarmSpot
        position={[0, 20, 14]}
        target={[0, 10, 2]}
        intensity={320}
        angle={0.75}
        penumbra={0.9}
        color="#ffe0b0"
        castShadow={!lite}
      />
      <pointLight position={[0, 3.2, 16]} color="#ffb45e" intensity={6} distance={20} decay={2} />
    </>
  )
}

function Atmosphere({ textures, lite }: { textures: MuseumTextures; lite: boolean }) {
  const paving = useMemo(() => {
    const stone = textures.ground.clone()
    stone.repeat.set(75, 75)
    return stone
  }, [textures])
  useEffect(() => () => paving.dispose(), [paving])
  const path = useMemo(() => {
    const stone = textures.ground.clone()
    stone.repeat.set(6, 17)
    return stone
  }, [textures])
  useEffect(() => () => path.dispose(), [path])
  const starPositions = useMemo(() => {
    const count = lite ? 40 : 100
    const positions = new Float32Array(count * 3)
    const random = (n: number) => { const v = Math.sin(n * 127.1 + 19.3) * 43758.5453; return v - Math.floor(v) }
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (random(i * 3) - 0.5) * 180
      positions[i * 3 + 1] = 10 + random(i * 3 + 1) * 56
      positions[i * 3 + 2] = -50 + random(i * 3 + 2) * 26
    }
    return positions
  }, [lite])

  return (
    <>
      <mesh position={[0, 20, -60]} renderOrder={-2}>
        <planeGeometry args={[240, 120]} />
        <meshBasicMaterial map={textures.sky} depthWrite={false} fog={false} toneMapped={false} />
      </mesh>

      <points renderOrder={-1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#fff4d6"
          size={0.1}
          sizeAttenuation
          transparent
          opacity={0.35}
          depthWrite={false}
          fog={false}
        />
      </points>

      <mesh position={[28, 26, -48]}>
        <sphereGeometry args={[1.05, 24, 24]} />
        <meshBasicMaterial color="#fff4d6" toneMapped={false} fog={false} />
      </mesh>
      <sprite position={[28, 26, -48]} scale={[9, 9, 1]}>
        <spriteMaterial
          map={textures.glow}
          color="#f4d79a"
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </sprite>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[240, 240]} />
        <meshStandardMaterial map={paving} color="#a8a7a0" roughness={0.84} metalness={0.02} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 20]} receiveShadow>
        <planeGeometry args={[13.6, 32]} />
        <meshStandardMaterial map={path} color="#c6bdac" roughness={0.72} metalness={0.02} />
      </mesh>

      {[-1, 1].map(side => <group key={side}>
        <mesh position={[side * 7, .015, 23]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[.28, 30]} /><meshStandardMaterial color="#a79b83" roughness={.83} />
        </mesh>
        {[14.6, 19.2].map(x => <group key={x} position={[side * x, 0, 7.4]}>
          <mesh position={[0, .28, 0]} castShadow receiveShadow><boxGeometry args={[3.2, .56, 2.25]} /><meshStandardMaterial color="#9b9484" roughness={.91} /></mesh>
          <mesh position={[0, .59, 0]}><boxGeometry args={[3.38, .14, 2.43]} /><meshStandardMaterial color="#c9beaa" roughness={.84} /></mesh>
          <mesh position={[0, .68, 0]}><boxGeometry args={[2.95, .08, 2]} /><meshStandardMaterial color="#25271e" roughness={1} /></mesh>
          {[-.9, 0, .9].map(dx => <mesh key={dx} position={[dx, 1.1, 0]} scale={[.8, .7, .8]} castShadow><icosahedronGeometry args={[1, 2]} /><meshStandardMaterial color="#344438" roughness={1} /></mesh>)}
        </group>)}
      </group>)}
    </>
  )
}

function SceneContent({
  progressRef,
  lite,
  interactive,
  isMobile,
}: {
  progressRef: ProgressRef
  lite: boolean
  interactive: boolean
  isMobile: boolean
}) {
  const textures = useMemo(() => createMuseumTextures(), [])
  useEffect(() => () => Object.values(textures).forEach(texture => texture.dispose()), [textures])

  return (
    <SceneProgressContext.Provider value={progressRef}>
      <CameraRig isMobile={isMobile} interactive={interactive} />
      <fog attach="fog" args={['#18212c', 80, 200]} />
      <Atmosphere textures={textures} lite={lite} />
      <Lights lite={lite} isMobile={isMobile} />
      <MuseumBuilding textures={textures} lite={lite} />
      <MuseumGate textures={textures} />
      <MuseumLamp x={-8.8} z={10.8} textures={textures} />
      <MuseumLamp x={8.8} z={10.8} textures={textures} />
    </SceneProgressContext.Provider>
  )
}

export function MuseumScene({ progressRef, lite = false, interactive = true }: MuseumSceneProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <SceneBoundary><Canvas
      fallback={<SceneFallback />}
      shadows={!lite}
      dpr={lite ? [1, 1] : [1, 1.5]}
      camera={{
        position: exteriorCameraStart(isMobile ? .46 : 1.6, isMobile ? 55 : 45).toArray(),
        fov: isMobile ? 55 : 45,
        near: 0.1,
        far: 220,
      }}
      gl={{
        antialias: !lite,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.12
        gl.shadowMap.type = THREE.PCFShadowMap
      }}
    >
      <color attach="background" args={['#0b111b']} />
      <Suspense fallback={null}>
        <SceneContent
          progressRef={progressRef}
          lite={lite}
          interactive={interactive}
          isMobile={isMobile}
        />
      </Suspense>
    </Canvas></SceneBoundary>
  )
}
