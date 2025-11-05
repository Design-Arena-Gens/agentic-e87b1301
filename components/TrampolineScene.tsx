'use client'

import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { Suspense, useState } from 'react'
import Scene from './Scene'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

export default function TrampolineScene() {
  const [bounceForce, setBounceForce] = useState(15)

  return (
    <>
      <div className="info">
        <h2>🎮 Controls</h2>
        <p><strong>SPACE</strong> - Jump</p>
        <p><strong>Arrow Keys</strong> - Move</p>
        <p><strong>Mouse</strong> - Look Around</p>
        <p><strong>Buttons</strong> - Jump Heights</p>
      </div>

      <div className="controls">
        <button onClick={() => setBounceForce(10)}>Small Bounce</button>
        <button onClick={() => setBounceForce(15)}>Medium Bounce</button>
        <button onClick={() => setBounceForce(25)}>Big Bounce</button>
        <button onClick={() => setBounceForce(35)}>EXTREME!</button>
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 3, 8], fov: 60 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = 2 // ACESFilmicToneMapping
          gl.toneMappingExposure = 1.2
        }}
      >
        <color attach="background" args={['#87ceeb']} />
        <fog attach="fog" args={['#87ceeb', 30, 100]} />

        <Suspense fallback={null}>
          <Physics
            gravity={[0, -25, 0]}
            iterations={20}
            tolerance={0.0001}
            defaultContactMaterial={{
              friction: 0.1,
              restitution: 0.9,
            }}
          >
            <Scene bounceForce={bounceForce} />
          </Physics>

          <EffectComposer multisampling={8}>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </>
  )
}
