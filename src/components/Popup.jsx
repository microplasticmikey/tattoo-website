import { useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'

export default function Popup({ initialPosition, size, color, text }) {
  const meshRef = useRef()
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const { camera, size: viewport } = useThree()

  // This handles mouse clicks to toggle drag state on/off
  const handlePointerDown = (e) => {
    e.stopPropagation()
    
    // Toggle dragging state
    if (isDragging) {
      setIsDragging(false)
    } else {
      setIsDragging(true)
      
      // Store the initial pointer position when dragging starts
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(
        new THREE.Vector2(
          (e.point.x / viewport.width) * 2,
          (e.point.y / viewport.height) * 2
        ),
        camera
      )
      const intersectionPoint = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, intersectionPoint)
      setDragStart({
        x: intersectionPoint.x - position[0],
        y: intersectionPoint.y - position[1]
      })
    }
  }

  const handlePointerMove = (e) => {
    if (isDragging) {
      e.stopPropagation()
      
      // Calculate new position based on pointer movement
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(
        new THREE.Vector2(
          (e.point.x / viewport.width) * 2,
          (e.point.y / viewport.height) * 2
        ),
        camera
      )
      const intersectionPoint = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, intersectionPoint)
      
      setPosition([
        intersectionPoint.x - dragStart.x,
        intersectionPoint.y - dragStart.y,
        position[2]
      ])
    }
  }

  const handlePointerUp = () => {
    setIsDragging(false) // Ensure drag ends when pointer is released
  }

  return (
    <group position={position}>
      {/* Main window */}
      <RoundedBox
        ref={meshRef}
        args={size}
        radius={0.05}
        smoothness={4}
        onPointerDown={handlePointerDown}   // Toggle dragging state on click
        onPointerMove={handlePointerMove}   // Handle dragging while moving
        onPointerUp={handlePointerUp}       // Handle when dragging stops
      >
        <meshStandardMaterial color={color} />
      </RoundedBox>

      {/* Black outline */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial color="black" />
      </lineSegments>

      {/* Text */}
      <Text
        position={[0, 0, size[2] / 2 + 0.01]}
        fontSize={0.15}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  )
}
