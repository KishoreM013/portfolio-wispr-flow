import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { portalOpeningGeometry, portalWallGeometry } from './museumArchitecture'

export type MuseumPortalProps = { position: [number, number, number]; rotation?: number; destination: '/' | '/hall'; title: string; caption: string; stone: THREE.Texture; radius?: number; spring?: number; wallWidth?: number; wallHeight?: number; closedDoor?: boolean }
/** Fully modelled entrance: finished masonry, deep stone reveal, return route. */
export function MuseumPortal({ position, rotation = 0, destination, title, caption, stone, radius = 2.6, spring = 3.4, wallWidth = 16, wallHeight = 14, closedDoor = false }: MuseumPortalProps) {
  const assets = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 320
    const c = canvas.getContext('2d')!; c.fillStyle = '#15251d'; c.fillRect(0, 0, 1200, 320); c.strokeStyle = '#c9af77'; c.lineWidth = 5; c.strokeRect(15, 15, 1170, 290)
    c.textAlign = 'center'; c.fillStyle = '#f0e0b7'; c.font = '65px Georgia'; c.fillText(title, 600, 135, 1080); c.fillStyle = '#d2bc8a'; c.font = '34px sans-serif'; c.fillText(caption, 600, 235, 1080)
    const label = new THREE.CanvasTexture(canvas); label.colorSpace = THREE.SRGBColorSpace; label.anisotropy = 8
    return { label, wall: portalWallGeometry(wallWidth, wallHeight, radius, spring), opening: portalOpeningGeometry(radius, spring) }
  }, [title, caption, wallWidth, wallHeight, radius, spring])
  useEffect(() => () => { assets.label.dispose(); assets.wall.dispose(); assets.opening.dispose(); document.body.style.cursor = '' }, [assets])
  const navigate = () => window.location.assign(destination)
  return <group position={position} rotation={[0, rotation, 0]}>
    <mesh geometry={assets.wall} receiveShadow castShadow><meshStandardMaterial map={stone} color="#b9ad94" roughness={.85} side={THREE.DoubleSide} /></mesh>
    <mesh geometry={assets.opening} position={[0, 0, .08]} onClick={e => { e.stopPropagation(); navigate() }} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
    <group onClick={e => { e.stopPropagation(); navigate() }} onPointerOver={e => { e.stopPropagation(); document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
      {[-1, 1].map(side => <group key={side}>
        <mesh position={[side * (radius + .23), spring / 2, .18]} castShadow><boxGeometry args={[.4, spring, .65]} /><meshStandardMaterial map={stone} color="#d3c6aa" roughness={.55} /></mesh>
        <mesh position={[side * (radius + .23), .18, .25]}><boxGeometry args={[.7, .36, .8]} /><meshStandardMaterial color="#d3c6aa" roughness={.5} /></mesh>
        <mesh position={[side * (radius + .23), spring, .25]}><boxGeometry args={[.75, .25, .85]} /><meshStandardMaterial color="#d3c6aa" roughness={.5} /></mesh>
      </group>)}
      {Array.from({ length: 23 }, (_, i) => {
        const a = i / 22 * Math.PI
        return <mesh key={i} position={[Math.cos(a) * (radius + .23), spring + Math.sin(a) * (radius + .23), .18]} rotation={[0, 0, a - Math.PI / 2]} castShadow><boxGeometry args={[(radius + .23) * Math.PI / 22 * .98, .42, .7]} /><meshStandardMaterial color={i === 11 ? '#b4995d' : '#d3c6aa'} roughness={.55} metalness={i === 11 ? .4 : 0} /></mesh>
      })}
      <mesh position={[0, spring + radius + 1, .52]}><boxGeometry args={[5.3, 1.35, .12]} /><meshStandardMaterial color="#aa8b50" metalness={.6} roughness={.4} /></mesh>
      <mesh position={[0, spring + radius + 1, .59]}><planeGeometry args={[5.1, 1.2]} /><meshBasicMaterial map={assets.label} toneMapped={false} /></mesh>
      {closedDoor && [-1, 1].map(side => <group key={side} position={[side * radius / 2, spring / 2, .24]}>
        <mesh castShadow><boxGeometry args={[radius - .035, spring - .06, .18]} /><meshStandardMaterial color="#34251c" roughness={.5} /></mesh>
        <mesh position={[0, 0, .11]}><boxGeometry args={[radius - .35, spring - .5, .025]} /><meshStandardMaterial color="#aa8b50" metalness={.6} roughness={.4} /></mesh>
        <mesh position={[0, 0, .13]}><boxGeometry args={[radius - .42, spring - .57, .025]} /><meshStandardMaterial color="#34251c" roughness={.5} /></mesh>
        <mesh position={[-side * (radius / 2 - .18), 0, .22]}><boxGeometry args={[.07, .75, .1]} /><meshStandardMaterial color="#c2a362" metalness={.65} roughness={.35} /></mesh>
      </group>)}
    </group>
    {/* Enclosed vestibule beyond the arch: no exposed void when turning around. */}
    <mesh position={[0, .025, -3]} receiveShadow><boxGeometry args={[radius * 2 + .2, .05, 6.5]} /><meshStandardMaterial map={stone} color="#b4a78c" roughness={.5} /></mesh>
    {[-1, 1].map(side => <mesh key={side} position={[side * (radius + .15), spring / 2, -3]}><boxGeometry args={[.3, spring, 6]} /><meshStandardMaterial map={stone} color="#b4a78c" roughness={.85} /></mesh>)}
    <mesh position={[0, spring, -3]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[radius, radius, 6, 48, 1, true, Math.PI / 2, Math.PI]} /><meshStandardMaterial map={stone} color="#b4a78c" side={THREE.DoubleSide} roughness={.85} /></mesh>
    <mesh position={[0, (spring + radius) / 2, -6]}><boxGeometry args={[radius * 2 + .4, spring + radius, .2]} /><meshStandardMaterial color={closedDoor ? '#45606b' : '#293c30'} roughness={.9} /></mesh>
    <mesh position={[0, spring / 2, -5.87]} onClick={navigate}><planeGeometry args={[radius * 1.6, radius * .4]} /><meshBasicMaterial map={assets.label} toneMapped={false} /></mesh>
    <pointLight position={[0, spring + 1, -2.5]} color="#f5d7a1" intensity={45} distance={13} />
    {[-1, 1].map(side => <pointLight key={side} position={[side * (radius + .9), spring, 1.2]} color="#f5d7a1" intensity={18} distance={9} />)}
  </group>
}
