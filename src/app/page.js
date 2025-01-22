'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import SafariBrowser from '@/components/SafariBrowser'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      <AnimatedBackground />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} />
        <SafariBrowser />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </main>
  )
}
