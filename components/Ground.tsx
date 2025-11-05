import { usePlane } from '@react-three/cannon'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Ground() {
  const [ref] = usePlane<THREE.Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: {
      friction: 0.9,
      restitution: 0.1,
    },
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100, 100, 100]} />
      <meshStandardMaterial
        color="#4a7c2c"
        roughness={0.95}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
