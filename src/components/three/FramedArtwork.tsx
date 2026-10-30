import type { Texture } from 'three'

import { EXHIBIT_FRAME_DEPTH, EXHIBIT_ARTWORK_OFFSET } from './galleryNavigation'

/** Keep the image in front of the solid backing, with a gap to prevent z-fighting. */
export function FramedArtwork({ texture, active }: { texture: Texture; active: boolean }) {
  return <group>
    <mesh castShadow><boxGeometry args={[5.2, 4.2, EXHIBIT_FRAME_DEPTH]} /><meshStandardMaterial color={active ? '#c0a063' : '#977946'} metalness={.6} roughness={.35} /></mesh>
    <mesh position={[0, 0, EXHIBIT_ARTWORK_OFFSET]}>
      <planeGeometry args={[4.95, 3.85]} />
      <meshBasicMaterial map={texture} toneMapped={false} depthTest depthWrite />
    </mesh>
  </group>
}
