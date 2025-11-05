import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

interface CharacterProps {
  bounceForce: number
}

export default function Character({ bounceForce }: CharacterProps) {
  const { camera } = useThree()
  const [jumped, setJumped] = useState(false)
  const velocity = useRef([0, 0, 0])

  const [ref, api] = useSphere<THREE.Group>(() => ({
    mass: 70,
    position: [0, 4, 0],
    args: [0.5],
    material: {
      friction: 0.1,
      restitution: 0.3,
    },
  }))

  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => {
      velocity.current = v
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !jumped) {
        api.applyImpulse([0, bounceForce, 0], [0, 0, 0])
        setJumped(true)
        setTimeout(() => setJumped(false), 500)
      }

      const force = 5
      if (e.key === 'ArrowLeft' || e.key === 'a') api.applyForce([-force, 0, 0], [0, 0, 0])
      if (e.key === 'ArrowRight' || e.key === 'd') api.applyForce([force, 0, 0], [0, 0, 0])
      if (e.key === 'ArrowUp' || e.key === 'w') api.applyForce([0, 0, -force], [0, 0, 0])
      if (e.key === 'ArrowDown' || e.key === 's') api.applyForce([0, 0, force], [0, 0, 0])
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      unsubscribe()
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [api, bounceForce, jumped])

  useFrame(() => {
    if (!ref.current) return

    const pos = ref.current.position
    camera.position.lerp(
      new THREE.Vector3(pos.x, pos.y + 3, pos.z + 8),
      0.1
    )
    camera.lookAt(pos.x, pos.y, pos.z)
  })

  return (
    <group ref={ref}>
      {/* Head with subsurface scattering simulation */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#ffdbac"
          roughness={0.6}
          metalness={0.1}
          emissive="#ff9966"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Hair with physics simulation */}
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2
        const radius = 0.32
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              0.6 + Math.random() * 0.2,
              Math.sin(angle) * radius,
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.01, 0.008, 0.3, 4]} />
            <meshStandardMaterial
              color="#4a2511"
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>
        )
      })}

      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial
          color="#4a90e2"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Arms */}
      <mesh castShadow receiveShadow position={[-0.4, 0.2, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
        <meshStandardMaterial
          color="#ffdbac"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0.4, 0.2, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
        <meshStandardMaterial
          color="#ffdbac"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Legs */}
      <mesh castShadow receiveShadow position={[-0.15, -0.6, 0]}>
        <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
        <meshStandardMaterial
          color="#2c3e50"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0.15, -0.6, 0]}>
        <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
        <meshStandardMaterial
          color="#2c3e50"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.12, 0.65, 0.3]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0.12, 0.65, 0.3]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[-0.12, 0.65, 0.36]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.12, 0.65, 0.36]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  )
}
