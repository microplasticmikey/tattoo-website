import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import Popup from './Popup'

export default function SafariBrowser() {
  const browserRef = useRef()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useFrame((state, delta) => {
    browserRef.current.rotation.y += delta * 0.0
  })

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <group ref={browserRef}>
      {/* Main browser window */}
      <RoundedBox args={[4, 2.5, 0.1]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#ffffff" />
      </RoundedBox>
      
      {/* Title bar */}
      <RoundedBox args={[4, 0.4, 0.12]} position={[0, 1.05, 0]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#f0f0f0" />
      </RoundedBox>
      
      {/* Traffic lights */}
      <group position={[-1.7, 1.05, 0.1]}>
        <mesh position={[-0.15, 0, 0]}>
          <sphereGeometry args={[0.06, 32, 32]} />
          <meshStandardMaterial color="#ff5f57" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.06, 32, 32]} />
          <meshStandardMaterial color="#febc2e" />
        </mesh>
        <mesh position={[0.15, 0, 0]}>
          <sphereGeometry args={[0.06, 32, 32]} />
          <meshStandardMaterial color="#28c840" />
        </mesh>
      </group>

      {/* Menu Button */}
      <group position={[0, 0, 0.1]} onClick={handleMenuClick}>
        <RoundedBox args={[1, 0.4, 0.05]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#007AFF" />
        </RoundedBox>
        <Text
          position={[0, 0, 0.05]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          MENU
        </Text>
      </group>

      {/* Popup Windows */}
      {isMenuOpen && (
        <group>
          <Popup
            initialPosition={[-2, 0, 1]}
            size={[1.2, 2, 0.05]}
            color="#FFC5D3"
            text="Book With ME!"
          />
          <Popup
            initialPosition={[0, .5, 1.25]}
            size={[1.2, 1.2, 0.05]}
            color="#7ABDE5"
            text="MY FLASH"
          />
          <Popup
            initialPosition={[2, -.5, .5]}
            size={[2, 1, 0.05]}
            color="#305CDE"
            text="SHOP"
          />
        </group>
      )}
    </group>
  )
} 