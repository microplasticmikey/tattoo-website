'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { useState, useRef } from 'react'
import SafariBrowser from '@/components/SafariBrowser'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function Home() {
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Handle menu button click
  const handleMenuClick = () => {
    setIsTransitioning((prev) => !prev) // Toggle the transitioning state
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      <AnimatedBackground />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }} // Initial camera position
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

        {/* Animate the camera */}
        <CameraAnimator isTransitioning={isTransitioning} />

        {/* Render the SafariBrowser */}
        <SafariBrowser onMenuClick={handleMenuClick} />

        {/* Render the new scene when transitioning */}
        {isTransitioning && <NewScene />}
      </Canvas>
    </main>
  )
}

// Camera animation component
function CameraAnimator({ isTransitioning }) {
  useFrame((state) => {
    const targetY = isTransitioning ? -10 : 0 // Slide down to y = -10
    const currentY = state.camera.position.y

    // Smoothly interpolate the camera's y position
    state.camera.position.y += (targetY - currentY) * 0.1

    // Update the camera's lookAt to focus on the scene
    state.camera.lookAt(0, targetY, 0)
  })

  return null
}

// New scene component (replace this with your actual new scene)
function NewScene() {
  return (
    <mesh position={[0, -10, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}