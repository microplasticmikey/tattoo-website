import { useRef, useState } from 'react'
import { RoundedBox, Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

export default function SafariBrowser({ onMenuClick }) {
  const browserRef = useRef()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const { camera } = useThree()

  const handlePointerDown = (e) => {
    e.stopPropagation()
    setIsDragging(true)
    setDragStart({
      x: e.point.x - browserRef.current.position.x,
      y: e.point.y - browserRef.current.position.y
    })
  }

  const handlePointerMove = (e) => {
    if (isDragging) {
      e.stopPropagation()
      browserRef.current.position.x = e.point.x - dragStart.x
      browserRef.current.position.y = e.point.y - dragStart.y
    }
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  const handleMenuClick = (e) => {
    e.stopPropagation()
    onMenuClick && onMenuClick()
  }

  return (
    <group 
      ref={browserRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Main browser window */}
      <RoundedBox args={[4, 2.5, 0.1]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#ffffff" />
      </RoundedBox>
      
      {/* Title bar */}
      <RoundedBox args={[4, 0.4, 0.12]} position={[0, 1.05, 0]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#f0f0f0" />
      </RoundedBox>
      
      {/* Traffic lights */}
      <group position={[-1.7, 1.05, 0.05]}>
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
      <group position={[0, 0, 0.065]} onClick={handleMenuClick}>
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
    </group>
  )
}