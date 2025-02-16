'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useState, useRef, useEffect } from 'react'
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

// New scene component with interactive blobs
function NewScene() {
  const [hoveredBlob, setHoveredBlob] = useState(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const radius = 2 // Radius of the circular formation

  const blobData = [
    { text: "Book With Me", color: "#F8C8DC" },
    { text: "Shop", color: "#AEC6CF" },
    { text: "Flash", color: "#F5A623" }
  ]

  useEffect(() => {
    const handleScroll = (e) => {
      setScrollPosition(prev => {
        const newPosition = prev + e.deltaY * 0.001
        return newPosition
      })
    }

    window.addEventListener('wheel', handleScroll)
    return () => window.removeEventListener('wheel', handleScroll)
  }, [])

  return (
    <group position={[0, -10, 0]}>
      {blobData.map((blob, index) => {
        const angle = (index * (2 * Math.PI / 3)) + scrollPosition
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius

        return (
          <group 
            key={index} 
            position={[x, 0, z]}
            rotation={[0, -angle, 0]} // Rotate to face center
          >
            <mesh
              onPointerOver={() => setHoveredBlob(index)}
              onPointerOut={() => setHoveredBlob(null)}
              scale={hoveredBlob === index ? 1.15 : 1}
            >
              <sphereGeometry args={[0.75, 32, 32]} />
              <meshStandardMaterial
                color={blob.color}
              />
            </mesh>
            <Text
              position={[0, 0, 0]}
              fontSize={0.15}
              color="black"
              anchorX="center"
              anchorY="center"
              rotation={[0, Math.PI / 2, 0]} // Rotate text to be perpendicular to sphere surface
            >
              {blob.text}
            </Text>
          </group>
        )
      })}
    </group>
  )
}