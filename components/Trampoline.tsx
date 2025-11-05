import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCylinder, useConvexPolyhedron } from '@react-three/cannon'
import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise'

export default function Trampoline() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const noise = useMemo(() => createNoise3D(), [])

  // Trampoline surface (bouncy part)
  const [surfaceRef] = useCylinder<THREE.Mesh>(() => ({
    mass: 0,
    position: [0, 1, 0],
    args: [2, 2, 0.1, 32],
    material: {
      friction: 0.1,
      restitution: 1.4, // High bounce
    },
  }))

  // Frame legs
  const [leg1] = useCylinder<THREE.Mesh>(() => ({
    mass: 0,
    position: [1.5, 0.5, 1.5],
    args: [0.08, 0.08, 1, 8],
  }))

  const [leg2] = useCylinder<THREE.Mesh>(() => ({
    mass: 0,
    position: [-1.5, 0.5, 1.5],
    args: [0.08, 0.08, 1, 8],
  }))

  const [leg3] = useCylinder<THREE.Mesh>(() => ({
    mass: 0,
    position: [1.5, 0.5, -1.5],
    args: [0.08, 0.08, 1, 8],
  }))

  const [leg4] = useCylinder<THREE.Mesh>(() => ({
    mass: 0,
    position: [-1.5, 0.5, -1.5],
    args: [0.08, 0.08, 1, 8],
  }))

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const time = clock.getElapsedTime()
    const geometry = meshRef.current.geometry
    const positions = geometry.attributes.position

    // Animate trampoline surface with wave effect
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const z = positions.getZ(i)
      const distance = Math.sqrt(x * x + z * z)

      const wave = Math.sin(distance * 2 - time * 3) * 0.05
      const noiseVal = noise(x * 2, z * 2, time * 0.5) * 0.02

      positions.setY(i, wave + noiseVal)
    }

    positions.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <group>
      {/* Trampoline surface */}
      <mesh ref={meshRef} receiveShadow castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[2, 2, 0.1, 64, 64]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.4}
          metalness={0.6}
          emissive="#0a0a0a"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Spring coils visual */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i / 32) * Math.PI * 2
        const x = Math.cos(angle) * 1.9
        const z = Math.sin(angle) * 1.9
        return (
          <mesh key={i} position={[x, 0.5, z]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
            <meshStandardMaterial
              color="#c0c0c0"
              roughness={0.3}
              metalness={0.9}
            />
          </mesh>
        )
      })}

      {/* Frame */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <torusGeometry args={[2.1, 0.1, 16, 64]} />
        <meshStandardMaterial
          color="#2c3e50"
          roughness={0.5}
          metalness={0.7}
        />
      </mesh>

      {/* Legs */}
      <mesh ref={leg1} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
        <meshStandardMaterial
          color="#34495e"
          roughness={0.6}
          metalness={0.8}
        />
      </mesh>
      <mesh ref={leg2} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
        <meshStandardMaterial
          color="#34495e"
          roughness={0.6}
          metalness={0.8}
        />
      </mesh>
      <mesh ref={leg3} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
        <meshStandardMaterial
          color="#34495e"
          roughness={0.6}
          metalness={0.8}
        />
      </mesh>
      <mesh ref={leg4} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
        <meshStandardMaterial
          color="#34495e"
          roughness={0.6}
          metalness={0.8}
        />
      </mesh>

      {/* Safety padding */}
      <mesh position={[0, 1.05, 0]} receiveShadow>
        <torusGeometry args={[2, 0.15, 16, 64]} />
        <meshStandardMaterial
          color="#e74c3c"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </group>
  )
}
