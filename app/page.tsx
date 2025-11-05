'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const TrampolineScene = dynamic(() => import('@/components/TrampolineScene'), {
  ssr: false,
  loading: () => <div className="loading">Loading Hyper-Realistic Simulator...</div>
})

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <Suspense fallback={<div className="loading">Initializing Physics Engine...</div>}>
        <TrampolineScene />
      </Suspense>
    </main>
  )
}
