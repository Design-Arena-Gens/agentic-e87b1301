import { Environment, Sky, Stars } from '@react-three/drei'
import Character from './Character'
import Trampoline from './Trampoline'
import Grass from './Grass'
import Lighting from './Lighting'
import Ground from './Ground'
import AudioSystem from './AudioSystem'

interface SceneProps {
  bounceForce: number
}

export default function Scene({ bounceForce }: SceneProps) {
  return (
    <>
      <Lighting />

      <Sky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.6}
        azimuth={0.25}
        rayleigh={0.5}
      />

      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <Environment preset="sunset" />

      <Character bounceForce={bounceForce} />
      <Trampoline />
      <Grass />
      <Ground />
      <AudioSystem />
    </>
  )
}
