import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { buildExteriorGeometry, EXTERIOR, type ExteriorFinish } from './exteriorArchitecture'
import { createExteriorTextures } from './exteriorTextures'
import type { MuseumTextures } from './textures'

export function MuseumFacade({ textures, lite }: { textures: MuseumTextures; lite: boolean }) {
  const facadeTextures = useMemo(() => createExteriorTextures(), [])
  const geometry = useMemo(() => buildExteriorGeometry(lite), [lite])
  const materials = useMemo(() => {
    const stone = { map: facadeTextures.limestone, bumpMap: facadeTextures.limestone, bumpScale: .035, roughness: .86 }
    return {
      masonry: new THREE.MeshStandardMaterial({ map: facadeTextures.masonry, bumpMap: facadeTextures.masonry, bumpScale: .045, roughness: .92 }),
      stone: new THREE.MeshStandardMaterial({ ...stone, color: '#e0d6be' }),
      trim: new THREE.MeshStandardMaterial({ ...stone, color: '#f1e6ce', roughness: .8 }),
      shadow: new THREE.MeshStandardMaterial({ color: '#292b28', roughness: .94 }),
      bronze: new THREE.MeshStandardMaterial({ color: '#6b6243', roughness: .5, metalness: .65 }),
      roof: new THREE.MeshStandardMaterial({ color: '#394a46', roughness: .78, metalness: .35 }),
      glass: new THREE.MeshStandardMaterial({ map: facadeTextures.glass, color: '#a59166', emissiveMap: facadeTextures.glass, emissive: '#e4b66b', emissiveIntensity: .42, roughness: .36, metalness: .15 }),
    }
  }, [facadeTextures])

  useEffect(() => () => Object.values(geometry).forEach(g => g.dispose()), [geometry])
  useEffect(() => () => Object.values(materials).forEach(m => m.dispose()), [materials])
  useEffect(() => () => Object.values(facadeTextures).forEach(t => t.dispose()), [facadeTextures])

  return <group name="Nineteenth-century limestone museum facade">
    {(Object.keys(geometry) as ExteriorFinish[]).map(key => <mesh key={key} name={`Facade ${key}`} geometry={geometry[key]} material={materials[key]} castShadow={key !== 'glass'} receiveShadow />)}
    <mesh position={[0, 12.37, EXTERIOR.inscriptionFront]}>
      <planeGeometry args={[19.2, 1.2]} />
      <meshBasicMaterial map={facadeTextures.inscription} transparent toneMapped={false} depthWrite={false} />
    </mesh>
    <mesh position={[0, 14.68, 3.69]}>
      <planeGeometry args={[1.88, 1.88]} />
      <meshBasicMaterial map={textures.medallion} transparent toneMapped={false} />
    </mesh>
  </group>
}
