import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hyper-Realistic Trampoline Simulator',
  description: 'Experience photorealistic trampoline physics with advanced graphics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
