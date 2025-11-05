import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Lighting() {
  const sunRef = useRef<THREE.DirectionalLight>(null!)
  const lensFlareRef = useRef<THREE.PointLight>(null!)

  useEffect(() => {
    if (sunRef.current) {
      sunRef.current.shadow.camera.left = -20
      sunRef.current.shadow.camera.right = 20
      sunRef.current.shadow.camera.top = 20
      sunRef.current.shadow.camera.bottom = -20
      sunRef.current.shadow.camera.near = 0.1
      sunRef.current.shadow.camera.far = 100
      sunRef.current.shadow.mapSize.width = 2048
      sunRef.current.shadow.mapSize.height = 2048
      sunRef.current.shadow.bias = -0.0001
    }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Subtle sun movement for dynamic shadows
    if (sunRef.current) {
      sunRef.current.position.x = 10 + Math.sin(t * 0.05) * 2
      sunRef.current.position.z = 10 + Math.cos(t * 0.05) * 2
    }

    // Lens flare pulse
    if (lensFlareRef.current) {
      lensFlareRef.current.intensity = 2 + Math.sin(t * 2) * 0.3
    }
  })

  return (
    <>
      {/* Main directional sun light */}
      <directionalLight
        ref={sunRef}
        position={[10, 15, 10]}
        intensity={2.5}
        color="#fff5e6"
        castShadow
      />

      {/* Atmospheric ambient light */}
      <ambientLight intensity={0.4} color="#b3d9ff" />

      {/* Sky hemisphere light for realistic outdoor lighting */}
      <hemisphereLight
        intensity={0.6}
        color="#ffffff"
        groundColor="#8b7355"
        position={[0, 50, 0]}
      />

      {/* Fill lights for better character definition */}
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#ffd9b3" />
      <pointLight position={[5, 3, 5]} intensity={0.5} color="#b3d9ff" />

      {/* Lens flare simulation */}
      <pointLight
        ref={lensFlareRef}
        position={[10, 15, 10]}
        intensity={2}
        color="#fff9e6"
        distance={100}
        decay={2}
      />

      {/* Rim lighting for character separation */}
      <spotLight
        position={[0, 8, -8]}
        angle={0.4}
        penumbra={0.5}
        intensity={1}
        color="#ffffff"
        castShadow
      />
    </>
  )
}
