import { useEffect, useRef } from 'react'

export default function AudioSystem() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])

  useEffect(() => {
    // Initialize Web Audio API for procedural sound generation
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Ambient wind sound
      const windNoise = audioContextRef.current.createOscillator()
      const windGain = audioContextRef.current.createGain()
      const windFilter = audioContextRef.current.createBiquadFilter()

      windNoise.type = 'sawtooth'
      windNoise.frequency.setValueAtTime(80, audioContextRef.current.currentTime)
      windFilter.type = 'lowpass'
      windFilter.frequency.setValueAtTime(200, audioContextRef.current.currentTime)
      windGain.gain.setValueAtTime(0.02, audioContextRef.current.currentTime)

      windNoise.connect(windFilter)
      windFilter.connect(windGain)
      windGain.connect(audioContextRef.current.destination)

      windNoise.start()
      oscillatorsRef.current.push(windNoise)

      // Birds chirping (random)
      const createBirdChirp = () => {
        if (!audioContextRef.current) return

        const chirp = audioContextRef.current.createOscillator()
        const chirpGain = audioContextRef.current.createGain()

        chirp.type = 'sine'
        chirp.frequency.setValueAtTime(1200 + Math.random() * 800, audioContextRef.current.currentTime)
        chirpGain.gain.setValueAtTime(0.05, audioContextRef.current.currentTime)
        chirpGain.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.2)

        chirp.connect(chirpGain)
        chirpGain.connect(audioContextRef.current.destination)

        chirp.start()
        chirp.stop(audioContextRef.current.currentTime + 0.2)
      }

      const birdInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          createBirdChirp()
        }
      }, 3000)

      return () => {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop()
          } catch (e) {}
        })
        if (audioContextRef.current) {
          audioContextRef.current.close()
        }
        clearInterval(birdInterval)
      }
    }
  }, [])

  return null
}
