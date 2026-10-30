import { useMemo } from 'react'
import * as THREE from 'three'

function Connection({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const { center, rotation, length } = useMemo(() => {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to), direction = b.clone().sub(a)
    return { center: a.clone().add(b).multiplyScalar(.5), rotation: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize()), length: direction.length() }
  }, [from, to])
  return <mesh position={center} quaternion={rotation}><cylinderGeometry args={[.018, .018, length, 8]} /><meshStandardMaterial color="#ad9159" metalness={.6} roughness={.4} /></mesh>
}
/** Small physical studies on plinths complement the larger explanatory wall drawings. */
export function ExhibitArtifact({ id }: { id: string }) {
  const nodes: [number, number, number][] = [[0, 1, 0], [-.7, .55, 0], [.7, .55, 0], [-1, .1, 0], [-.4, .1, 0], [1, .1, 0]]
  return <group position={[0, -2.55, 1.4]}>
    <mesh position={[0, -.45, 0]} castShadow receiveShadow><boxGeometry args={[3.2, .8, 1.25]} /><meshStandardMaterial color="#b5a98e" roughness={.5} /></mesh>
    <mesh position={[0, -.025, 0]}><boxGeometry args={[3.35, .045, 1.35]} /><meshStandardMaterial color="#a88b50" metalness={.65} roughness={.35} /></mesh>
    {id === 'legal' ? <group rotation={[0, -.15, 0]}>
      {[0, 1, 2, 3, 4].map(i => <mesh key={i} position={[i * .035, .08 + i * .045, 0]} rotation={[0, i * .025, 0]} castShadow><boxGeometry args={[1.8, .035, 1]} /><meshStandardMaterial color={i === 4 ? '#eee4c9' : '#c7bda3'} roughness={.95} /></mesh>)}
      <mesh position={[.65, .37, .1]} rotation={[0, .2, -.1]}><cylinderGeometry args={[.15, .15, .15, 32]} /><meshStandardMaterial color="#6c2824" roughness={.55} /></mesh>
    </group> : id === 'tgk' || id === 'teaching' ? <group>
      {[[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]].map(([a, b]) => <Connection key={`${a}-${b}`} from={nodes[a]} to={nodes[b]} />)}
      {nodes.map((p, i) => <mesh key={i} position={p} castShadow><sphereGeometry args={[.13, 20, 16]} /><meshStandardMaterial color={i % 2 ? '#71846d' : '#c4a66a'} metalness={.4} roughness={.4} /></mesh>)}
    </group> : id === 'film' ? <group>
      {[-1, 0, 1].map((x, i) => <group key={x} position={[x, .5, 0]}>
        <mesh><boxGeometry args={[.8, .7, .07]} /><meshStandardMaterial color="#9b7d48" metalness={.6} roughness={.4} /></mesh>
        <mesh position={[0, 0, .045]}><planeGeometry args={[.69, .59]} /><meshStandardMaterial color={['#526650', '#819474', '#a2a67d'][i]} roughness={.85} /></mesh>
        <mesh position={[0, -.32, 0]}><cylinderGeometry args={[.025, .025, .5, 10]} /><meshStandardMaterial color="#a88b50" metalness={.6} roughness={.4} /></mesh>
      </group>)}
    </group> : id === 'tgk-editor' ? <group>
      <mesh position={[0, .48, 0]} castShadow><boxGeometry args={[1.65, .95, .75]} /><meshStandardMaterial color="#263b39" metalness={.3} roughness={.4} /></mesh>
      <mesh position={[0, .98, -.02]} rotation={[-.18, 0, 0]}><boxGeometry args={[1.55, .9, .06]} /><meshStandardMaterial color="#9ab4a1" emissive="#1e3d36" emissiveIntensity={.18} /></mesh>
      <mesh position={[0, .08, .02]}><boxGeometry args={[1.7, .07, .8]} /><meshStandardMaterial color="#ad9159" metalness={.6} roughness={.4} /></mesh>
    </group> : id === 'codetgk' ? <group>
      <mesh position={[0, .48, 0]} castShadow><boxGeometry args={[1.9, .8, .9]} /><meshStandardMaterial color="#202b2a" roughness={.5} /></mesh>
      {[-.45, -.15, .15, .45].map(x => <mesh key={x} position={[x, .9, -.45]}><boxGeometry args={[.18, .08, .12]} /><meshStandardMaterial color="#c7a86b" metalness={.5} roughness={.35} /></mesh>)}
      <mesh position={[0, .92, .08]}><boxGeometry args={[1.5, .08, .45]} /><meshStandardMaterial color="#415f58" roughness={.5} /></mesh>
    </group> : id === 'sovereignopt' ? <group>
      <mesh position={[0, .55, 0]} castShadow><boxGeometry args={[1.5, 1, 1.15]} /><meshStandardMaterial color="#405b55" metalness={.65} roughness={.3} /></mesh>
      {[-.42, 0, .42].map(x => <mesh key={x} position={[x, 1.12, 0]}><cylinderGeometry args={[.13, .13, .08, 12]} /><meshStandardMaterial color="#d3b36c" metalness={.7} roughness={.25} /></mesh>)}
      <mesh position={[0, .35, .59]}><boxGeometry args={[.8, .28, .04]} /><meshStandardMaterial color="#c8d3bc" emissive="#506f63" emissiveIntensity={.2} /></mesh>
    </group> : id === 'solar-wind-piezo-car' ? <group rotation={[0, -.12, 0]}>
      <group position={[0, .42, 0]}>
        <mesh position={[0, .08, 0]} castShadow><boxGeometry args={[2.05, .34, .82]} /><meshStandardMaterial color="#273b39" metalness={.5} roughness={.38} /></mesh>
        <mesh position={[.12, .38, 0]} rotation={[0, 0, -.03]} castShadow><boxGeometry args={[1.05, .42, .72]} /><meshStandardMaterial color="#405e58" metalness={.35} roughness={.35} /></mesh>
        <mesh position={[.12, .4, .37]} rotation={[0, 0, -.03]}><boxGeometry args={[.76, .25, .035]} /><meshStandardMaterial color="#9ab4aa" metalness={.25} roughness={.3} /></mesh>
        {[-.68, .68].map(x => <group key={x} position={[x, -.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh><cylinderGeometry args={[.28, .28, .14, 20]} /><meshStandardMaterial color="#171c1b" roughness={.8} /></mesh>
          <mesh position={[0, .075, 0]}><cylinderGeometry args={[.12, .12, .15, 16]} /><meshStandardMaterial color="#b49a62" metalness={.55} roughness={.35} /></mesh>
        </group>)}
        <mesh position={[-.1, .32, 0]} rotation={[0, 0, -.03]}><boxGeometry args={[.7, .04, .62]} /><meshStandardMaterial color="#af9259" metalness={.7} roughness={.32} /></mesh>
      </group>
      <group position={[0, .98, 0]}>
        <mesh position={[0, .12, 0]} scale={[1.28, .46, .72]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#ddd0ae" roughness={.9} transparent opacity={.72} depthWrite={false} /></mesh>
        <mesh position={[-.62, .08, 0]} scale={[.52, .33, .61]}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#c9bc9d" roughness={.92} transparent opacity={.76} depthWrite={false} /></mesh>
        <mesh position={[.62, .08, 0]} scale={[.52, .33, .61]}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#c9bc9d" roughness={.92} transparent opacity={.76} depthWrite={false} /></mesh>
        <mesh position={[0, -.26, .61]} rotation={[0, 0, .08]}><boxGeometry args={[1.8, .06, .04]} /><meshStandardMaterial color="#94794d" roughness={.8} transparent opacity={.9} /></mesh>
      </group>
    </group> : id === 'tgk-os' ? <group rotation={[0, .12, 0]}>
      <mesh position={[0, .48, 0]} castShadow><boxGeometry args={[1.8, .85, .95]} /><meshStandardMaterial color="#202b2a" metalness={.3} roughness={.45} /></mesh>
      <mesh position={[0, .98, -.08]} rotation={[-.16, 0, 0]}><boxGeometry args={[1.58, .78, .06]} /><meshStandardMaterial color="#142521" emissive="#2d6d5a" emissiveIntensity={.32} /></mesh>
      <mesh position={[0, .98, -.115]} rotation={[-.16, 0, 0]}><planeGeometry args={[1.3, .56]} /><meshStandardMaterial color="#76b89a" emissive="#2f785e" emissiveIntensity={.35} /></mesh>
      {[-.5, -.16, .18, .52].map(x => <mesh key={x} position={[x, .12, -.46]}><boxGeometry args={[.18, .07, .16]} /><meshStandardMaterial color="#c7a86b" metalness={.5} roughness={.35} /></mesh>)}
      <mesh position={[0, .62, .5]}><boxGeometry args={[.85, .12, .05]} /><meshStandardMaterial color="#b49a62" metalness={.65} roughness={.3} /></mesh>
      <mesh position={[.38, .68, .53]}><sphereGeometry args={[.16, 16, 12]} /><meshStandardMaterial color="#b8d3bd" emissive="#547d63" emissiveIntensity={.25} /></mesh>
    </group> : id === 'mobile-one-bit-llm' ? <group rotation={[0, -.1, 0]}>
      <mesh position={[0, .48, 0]} castShadow><boxGeometry args={[1.05, 1.65, .18]} /><meshStandardMaterial color="#273b39" metalness={.35} roughness={.4} /></mesh>
      <mesh position={[0, .58, .105]}><planeGeometry args={[.82, 1.18]} /><meshStandardMaterial color="#1e3d35" emissive="#245b4a" emissiveIntensity={.3} /></mesh>
      <mesh position={[0, .58, .12]}><planeGeometry args={[.68, .94]} /><meshStandardMaterial color="#7caf90" emissive="#2b765a" emissiveIntensity={.32} /></mesh>
      {[-.28, 0, .28].map(x => <mesh key={x} position={[x, -.42, .12]}><sphereGeometry args={[.055, 12, 8]} /><meshStandardMaterial color="#d1b16e" metalness={.5} /></mesh>)}
      <mesh position={[0, 1.38, 0]}><boxGeometry args={[.4, .08, .3]} /><meshStandardMaterial color="#b49a62" metalness={.6} roughness={.3} /></mesh>
      <mesh position={[0, 1.56, 0]}><sphereGeometry args={[.13, 16, 10]} /><meshStandardMaterial color="#c98d5d" emissive="#7b392d" emissiveIntensity={.25} /></mesh>
      <mesh position={[0, -.43, .14]}><boxGeometry args={[.36, .05, .03]} /><meshStandardMaterial color="#b94327" emissive="#6d2119" emissiveIntensity={.2} /></mesh>
    </group> : id === 'gan-image-generator' ? <group rotation={[0, .08, 0]}>
      <mesh position={[0, .45, 0]} castShadow><boxGeometry args={[1.45, .85, .72]} /><meshStandardMaterial color="#293b39" metalness={.3} roughness={.45} /></mesh>
      <mesh position={[0, .94, 0]} rotation={[-.18, 0, 0]}><boxGeometry args={[1.3, .72, .06]} /><meshStandardMaterial color="#182522" emissive="#234d40" emissiveIntensity={.25} /></mesh>
      <mesh position={[0, .94, .035]} rotation={[-.18, 0, 0]}><planeGeometry args={[1.06, .5]} /><meshStandardMaterial color="#b76d82" emissive="#65394a" emissiveIntensity={.3} /></mesh>
      {[-.32, 0, .32].map(x => <mesh key={x} position={[x, .2, .38]}><boxGeometry args={[.18, .18, .06]} /><meshStandardMaterial color="#c7a86b" metalness={.5} /></mesh>)}
      <group position={[0, .55, .42]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.28, .045, 10, 24]} /><meshStandardMaterial color="#c7a86b" metalness={.65} roughness={.3} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.13, .035, 10, 20]} /><meshStandardMaterial color="#9ab4a1" /></mesh>
        <mesh position={[0, 0, .04]}><sphereGeometry args={[.07, 12, 8]} /><meshStandardMaterial color="#b94327" emissive="#6d2119" emissiveIntensity={.2} /></mesh>
      </group>
    </group> : id === 'smart-email' ? <group>
      <mesh position={[0, .55, 0]} castShadow><boxGeometry args={[1.55, 1.05, .32]} /><meshStandardMaterial color="#d8cfb4" roughness={.55} /></mesh>
      <mesh position={[0, .55, .18]}><planeGeometry args={[1.28, .78]} /><meshStandardMaterial color="#405d55" emissive="#1a332e" emissiveIntensity={.2} /></mesh>
      <mesh position={[0, .55, .37]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[.9, .06, .04]} /><meshStandardMaterial color="#d7bd7b" /></mesh>
    </group> : id === 'github-analyzer' ? <group>
      <mesh position={[0, .42, 0]} castShadow><cylinderGeometry args={[.75, .75, .3, 32]} /><meshStandardMaterial color="#293b39" metalness={.4} roughness={.4} /></mesh>
      <mesh position={[0, .75, 0]}><torusGeometry args={[.5, .08, 10, 32]} /><meshStandardMaterial color="#c7a86b" metalness={.65} roughness={.3} /></mesh>
      {[-.4, 0, .4].map(x => <mesh key={x} position={[x, .55, 0]}><sphereGeometry args={[.1, 12, 10]} /><meshStandardMaterial color="#91b3a5" /></mesh>)}
    </group> : id === 'github' ? <group>
      <mesh position={[0, .48, 0]}><boxGeometry args={[1.65, .95, .7]} /><meshStandardMaterial color="#202a2d" roughness={.5} /></mesh>
      {[-.45, -.15, .15, .45].map(x => <mesh key={x} position={[x, .95, .05]}><boxGeometry args={[.14, .14, .12]} /><meshStandardMaterial color="#b9cbb9" /></mesh>)}
      <mesh position={[0, .2, .37]}><boxGeometry args={[1.2, .12, .04]} /><meshStandardMaterial color="#c7a86b" metalness={.6} /></mesh>
    </group> : id === 'linkedin' ? <group>
      <mesh position={[0, .58, 0]}><boxGeometry args={[1.4, 1.2, .28]} /><meshStandardMaterial color="#2b6f88" roughness={.4} /></mesh>
      <mesh position={[0, .58, .18]}><cylinderGeometry args={[.3, .3, .04, 24]} /><meshStandardMaterial color="#e9e1cd" /></mesh>
      <mesh position={[0, .12, .2]}><boxGeometry args={[.9, .12, .04]} /><meshStandardMaterial color="#e9e1cd" /></mesh>
    </group> : id === 'leetcode' ? <group>
      <mesh position={[0, .48, 0]}><cylinderGeometry args={[.65, .65, .18, 32]} /><meshStandardMaterial color="#d9823b" metalness={.4} roughness={.35} /></mesh>
      {[.35, .58, .8].map((height, i) => <mesh key={i} position={[-.45 + i * .45, height / 2 + .12, 0]}><boxGeometry args={[.2, height, .2]} /><meshStandardMaterial color={i === 1 ? '#c7a86b' : '#e8d9bd'} /></mesh>)}
    </group> : id === 'codeforces' ? <group>
      <mesh position={[0, .4, 0]}><boxGeometry args={[1.6, .7, .8]} /><meshStandardMaterial color="#3c6f9c" roughness={.42} /></mesh>
      {[0, 1, 2].map(i => <mesh key={i} position={[-.5 + i * .5, .82 + i * .16, .08]}><boxGeometry args={[.28, .08, .08]} /><meshStandardMaterial color="#d8e6e2" /></mesh>)}
    </group> : id === 'codechef' ? <group>
      <mesh position={[0, .5, 0]}><cylinderGeometry args={[.7, .7, .18, 32]} /><meshStandardMaterial color="#b94327" metalness={.35} roughness={.4} /></mesh>
      {[0, 1, 2].map(i => <mesh key={i} position={[-.35 + i * .35, .9, 0]}><coneGeometry args={[.11, .38, 5]} /><meshStandardMaterial color="#f0c98e" metalness={.5} /></mesh>)}
    </group> : id === 'gfg' ? <group>
      <mesh position={[0, .5, 0]}><boxGeometry args={[1.5, .85, .65]} /><meshStandardMaterial color="#2f8d46" roughness={.5} /></mesh>
      {[-.45, 0, .45].map(x => <mesh key={x} position={[x, 1.02, .08]}><sphereGeometry args={[.12, 12, 10]} /><meshStandardMaterial color="#d6e8bd" /></mesh>)}
    </group> : id === 'hackerrank' ? <group>
      <mesh position={[0, .5, 0]}><octahedronGeometry args={[.72, 0]} /><meshStandardMaterial color="#3f7f5a" roughness={.45} /></mesh>
      <mesh position={[0, .5, .5]}><boxGeometry args={[.28, .28, .05]} /><meshStandardMaterial color="#c9a35e" /></mesh>
    </group> : id === 'instagram' ? <group>
      <mesh position={[0, .55, 0]}><boxGeometry args={[1.25, 1.25, .22]} /><meshStandardMaterial color="#bd5d75" roughness={.4} /></mesh>
      <mesh position={[0, .55, .14]}><torusGeometry args={[.32, .06, 12, 24]} /><meshStandardMaterial color="#f2d6c7" /></mesh>
      <mesh position={[.38, .92, .16]}><sphereGeometry args={[.07, 12, 8]} /><meshStandardMaterial color="#f2d6c7" /></mesh>
    </group> : id === 'youtube' ? <group>
      <mesh position={[0, .55, 0]}><boxGeometry args={[1.55, .85, .25]} /><meshStandardMaterial color="#c8372d" roughness={.45} /></mesh>
      <mesh position={[0, .55, .16]} rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[.22, .42, 3]} /><meshStandardMaterial color="#fff4e5" /></mesh>
    </group> : id === 'kaggle' ? <group>
      <mesh position={[0, .55, 0]}><boxGeometry args={[1.4, .9, .72]} /><meshStandardMaterial color="#2084a5" roughness={.4} /></mesh>
      {[-.35, 0, .35].map(x => <mesh key={x} position={[x, .98, .12]}><boxGeometry args={[.18, .18, .08]} /><meshStandardMaterial color="#d7eef2" /></mesh>)}
    </group> : id === 'huggingface' ? <group>
      <mesh position={[0, .55, 0]}><sphereGeometry args={[.68, 20, 14]} /><meshStandardMaterial color="#8a5fb7" roughness={.5} /></mesh>
      {[-.22, .22].map(x => <mesh key={x} position={[x, .68, .58]}><sphereGeometry args={[.09, 12, 8]} /><meshStandardMaterial color="#f0e2c5" /></mesh>)}
    </group> : id === 'stackoverflow' ? <group>
      <mesh position={[0, .45, 0]}><boxGeometry args={[1.45, .68, .65]} /><meshStandardMaterial color="#bc5b25" roughness={.5} /></mesh>
      {[0, 1, 2].map(i => <mesh key={i} position={[-.35 + i * .35, .88, .1]}><boxGeometry args={[.18, .1, .18]} /><meshStandardMaterial color="#f5eee4" /></mesh>)}
    </group> : id === 'legacy-just-another-day' || id === 'worst-phase' ? <group>
      <mesh position={[0, .48, 0]} rotation={[0, 0, -.08]} castShadow><boxGeometry args={[1.45, .95, .18]} /><meshStandardMaterial color={id === 'legacy-just-another-day' ? '#e5ddd0' : '#d8e0d8'} roughness={.75} /></mesh>
      {[0, 1, 2].map(i => <mesh key={i} position={[-.42 + i * .42, .62, .12]} rotation={[0, 0, -.08]}><boxGeometry args={[.24, .04, .03]} /><meshStandardMaterial color="#9d7543" /></mesh>)}
      <mesh position={[0, .12, 0]}><boxGeometry args={[1.7, .07, .8]} /><meshStandardMaterial color="#a88b50" metalness={.55} roughness={.4} /></mesh>
    </group> : id === 'its-our-show' || id === 'a-lifes-echoes' || id === 'unwritten-endings' || id === 'anchor-slips' ? <group>
      <mesh position={[0, .5, 0]}><cylinderGeometry args={[.72, .72, .18, 32]} /><meshStandardMaterial color="#b94327" metalness={.35} roughness={.4} /></mesh>
      <mesh position={[0, .93, 0]}><cylinderGeometry args={[.11, .11, .7, 16]} /><meshStandardMaterial color="#9d7543" metalness={.65} roughness={.3} /></mesh>
      <mesh position={[0, 1.28, 0]}><sphereGeometry args={[.23, 18, 12]} /><meshStandardMaterial color={id === 'anchor-slips' ? '#526c63' : '#d8b274'} roughness={.4} /></mesh>
    </group> : id === 'write-songs' ? <group>
      {[0, 1, 2, 3].map(i => <mesh key={i} position={[-.7 + i * .45, .55 + (i % 2) * .12, 0]} rotation={[0, 0, -.2]}><cylinderGeometry args={[.08, .08, .7, 12]} /><meshStandardMaterial color="#526c63" /></mesh>)}
      <mesh position={[0, .48, 0]} rotation={[0, 0, -.08]}><boxGeometry args={[1.8, .08, .95]} /><meshStandardMaterial color="#eee4c9" /></mesh>
    </group> : id === 'listen-songs' ? <group>
      <mesh position={[0, .52, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.7, .7, .12, 32]} /><meshStandardMaterial color="#293b39" /></mesh>
      <mesh position={[0, .62, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.3, .035, 8, 24]} /><meshStandardMaterial color="#d7bd7b" /></mesh>
      <mesh position={[.72, .78, 0]}><boxGeometry args={[.08, .55, .08]} /><meshStandardMaterial color="#9d7543" /></mesh>
    </group> : id === 'singing' ? <group>
      <mesh position={[0, .72, 0]}><sphereGeometry args={[.22, 16, 12]} /><meshStandardMaterial color="#526c63" /></mesh>
      <mesh position={[0, .3, 0]}><cylinderGeometry args={[.07, .07, .8, 12]} /><meshStandardMaterial color="#9d7543" /></mesh>
      <mesh position={[0, .02, 0]}><cylinderGeometry args={[.35, .35, .06, 16]} /><meshStandardMaterial color="#c7a86b" metalness={.5} /></mesh>
    </group> : id === 'minecraft' ? <group>
      {[-.45, 0, .45].map((x, i) => <mesh key={x} position={[x, .35 + i * .22, 0]} castShadow><boxGeometry args={[.55, .55, .55]} /><meshStandardMaterial color={['#6c8b58', '#8e6e4b', '#a8a35d'][i]} roughness={.9} /></mesh>)}
      <mesh position={[0, .08, 0]}><boxGeometry args={[1.7, .08, .8]} /><meshStandardMaterial color="#a88b50" /></mesh>
    </group> : id === 'learning-new-things' ? <group>
      {[[-.65, .4, 0], [0, .8, 0], [.65, .4, 0]].map((p, i) => <mesh key={i} position={p as [number, number, number]}><sphereGeometry args={[.16, 16, 12]} /><meshStandardMaterial color={i === 1 ? '#b94327' : '#526c63'} /></mesh>)}
      <Connection from={[-.65, .4, 0]} to={[0, .8, 0]} /><Connection from={[0, .8, 0]} to={[.65, .4, 0]} />
    </group> : id === 'chatting-with-friends' ? <group>
      {[-.55, 0, .55].map((x, i) => <mesh key={x} position={[x, .62, 0]}><sphereGeometry args={[.27, 16, 12]} /><meshStandardMaterial color={['#526c63', '#b94327', '#9d7543'][i]} /></mesh>)}
      {[-.55, 0, .55].map(x => <mesh key={x} position={[x, .18, 0]}><cylinderGeometry args={[.16, .2, .5, 12]} /><meshStandardMaterial color="#c7a86b" /></mesh>)}
    </group> : id === 'watching-movies' ? <group>
      <mesh position={[-.35, .65, 0]}><cylinderGeometry args={[.42, .42, .12, 24]} /><meshStandardMaterial color="#293b39" /></mesh>
      <mesh position={[.35, .65, 0]}><cylinderGeometry args={[.42, .42, .12, 24]} /><meshStandardMaterial color="#293b39" /></mesh>
      <mesh position={[0, .65, 0]}><boxGeometry args={[.65, .08, .08]} /><meshStandardMaterial color="#9d7543" /></mesh>
    </group> : id === 'searching-the-web' ? <group>
      <mesh position={[-.1, .6, 0]} rotation={[0, 0, -.35]}><torusGeometry args={[.42, .1, 12, 24]} /><meshStandardMaterial color="#426f80" metalness={.4} /></mesh>
      <mesh position={[.35, .25, 0]} rotation={[0, 0, -.35]}><boxGeometry args={[.08, .65, .08]} /><meshStandardMaterial color="#9d7543" /></mesh>
      {[-.5, 0, .5].map(x => <mesh key={x} position={[x, .15, -.3]}><boxGeometry args={[.3, .25, .08]} /><meshStandardMaterial color="#526c63" /></mesh>)}
    </group> : id === 'overthinking' ? <group>
      <mesh position={[0, .55, 0]}><sphereGeometry args={[.5, 20, 14]} /><meshStandardMaterial color="#b9a2c2" roughness={.7} /></mesh>
      {[-.35, 0, .35].map(x => <mesh key={x} position={[x, .72, .42]}><torusGeometry args={[.14, .035, 8, 16]} /><meshStandardMaterial color="#9d7543" /></mesh>)}
    </group> : id === 'manipulating' ? <group>
      {[-.5, 0, .5].map((x, i) => <mesh key={x} position={[x, .5, 0]} rotation={[0, 0, i === 1 ? .2 : -.2]}><boxGeometry args={[.55, .55, .55]} /><meshStandardMaterial color={['#526c63', '#b94327', '#9d7543'][i]} /></mesh>)}
      <Connection from={[-.5, .82, 0]} to={[0, .82, 0]} /><Connection from={[0, .82, 0]} to={[.5, .82, 0]} />
    </group> : id === 'contact' ? <group>
      <mesh position={[0, .5, 0]} rotation={[0, 0, -.12]}><boxGeometry args={[1.65, 1.05, .12]} /><meshStandardMaterial color="#e9e1cd" roughness={.7} /></mesh>
      <mesh position={[0, .5, .08]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[1.1, .05, .04]} /><meshStandardMaterial color="#b08b50" metalness={.5} /></mesh>
    </group> : id === 'feedback' || id === 'spam' || id === 'microsoft' ? <group>
      {[-.85, 0, .85].map((x, i) => <group key={x} position={[x, .25, 0]}>
        <mesh castShadow><cylinderGeometry args={[.32, .32, .5 + i * .12, 24]} /><meshStandardMaterial color={['#b6a177', '#6c887c', '#c8b77e'][i]} metalness={.3} roughness={.45} /></mesh>
        <mesh position={[0, .4 + i * .06, 0]}><sphereGeometry args={[.09, 16, 16]} /><meshStandardMaterial color="#dfc58d" metalness={.6} roughness={.35} /></mesh>
      </group>)}
    </group> : <group>
      {[-.85, -.4, .05, .5].map((x, i) => <mesh key={x} position={[x, .2 + i * .03, 0]} rotation={[0, .12 * i, 0]} castShadow><boxGeometry args={[.3, .4 + i * .06, .8]} /><meshStandardMaterial color={['#525c48', '#6d4b35', '#a18d5e', '#384f45'][i]} roughness={.8} /></mesh>)}
    </group>}
  </group>
}
