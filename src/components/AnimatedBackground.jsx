'use client'
import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Function to set canvas size
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    setCanvasSize()

    // Set initial canvas background to white
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let startTime = null
    const duration = 2000 // 2 seconds
    let lastX = canvas.width / (2 * (window.devicePixelRatio || 1))
    let lastY = canvas.height / (2 * (window.devicePixelRatio || 1))

    function animate(currentTime) {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = elapsed / duration

      if (progress < 1) {
        // Draw multiple lines per frame for faster effect
        for (let i = 0; i < 8; i++) {
          ctx.beginPath()
          ctx.moveTo(lastX, lastY)

          // Generate new random point with bounds checking
          const angle = Math.random() * Math.PI * 2
          const radius = Math.random() * (Math.min(canvas.width, canvas.height) / 10)
          let newX = lastX + Math.cos(angle) * radius
          let newY = lastY + Math.sin(angle) * radius

          // Keep points within bounds with padding
          const padding = 20
          newX = Math.max(padding, Math.min(newX, canvas.width / (window.devicePixelRatio || 1) - padding))
          newY = Math.max(padding, Math.min(newY, canvas.height / (window.devicePixelRatio || 1) - padding))

          // Draw line
          ctx.lineTo(newX, newY)
          ctx.strokeStyle = '#FFEE8C'
          
          // Adjust line width based on screen size
          const baseWidth = Math.min(canvas.width, canvas.height) / 50
          ctx.lineWidth = Math.max(10, Math.min(20, baseWidth))
          
          ctx.lineCap = 'round'
          ctx.stroke()

          // Update last position
          lastX = newX
          lastY = newY
        }

        requestAnimationFrame(animate)
      } 
    }

    requestAnimationFrame(animate)

    const handleResize = () => {
      const prevFillStyle = ctx.fillStyle
      setCanvasSize()
      ctx.fillStyle = prevFillStyle
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full"
    />
  )
} 