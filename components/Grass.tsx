import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise'

export default function Grass() {
  const grassRef = useRef<THREE.InstancedMesh>(null!)
  const noise = useMemo(() => createNoise3D(), [])

  const { count, dummy, grassData } = useMemo(() => {
    const count = 10000
    const dummy = new THREE.Object3D()
    const grassData: { x: number; z: number; height: number; phase: number }[] = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * 17
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius

      grassData.push({
        x,
        z,
        height: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      })
    }

    return { count, dummy, grassData }
  }, [])

  useFrame(({ clock }) => {
    if (!grassRef.current) return

    const time = clock.getElapsedTime()

    grassData.forEach((blade, i) => {
      const windStrength = 0.15
      const windSpeed = 2

      // Wind effect using noise
      const windX = Math.sin(time * windSpeed + blade.phase) * windStrength
      const windZ = Math.cos(time * windSpeed * 0.7 + blade.phase) * windStrength * 0.5
      const noiseWind = noise(blade.x * 0.1, blade.z * 0.1, time * 0.5) * windStrength

      dummy.position.set(blade.x, 0, blade.z)
      dummy.rotation.set(windX, 0, windZ + noiseWind)
      dummy.scale.set(0.02, blade.height, 0.02)
      dummy.updateMatrix()

      grassRef.current.setMatrixAt(i, dummy.matrix)
    })

    grassRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={grassRef}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
    >
      <coneGeometry args={[0.5, 1, 3]} />
      <meshStandardMaterial
        color="#2d5016"
        roughness={0.9}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}
