'use client'
import * as THREE from 'three';
import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const scribbleRef = useRef(null);
  const progressRef = useRef(0);
  const frameIdRef = useRef(null);

  useEffect(() => {
    // Scene setup
    sceneRef.current = new THREE.Scene();
    
    // Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    cameraRef.current = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      1,
      1000
    );
    cameraRef.current.position.z = 5;

    // Renderer setup
    rendererRef.current = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setClearColor(0xffffff, 0);

    // Create scribble lines
    const scribblePoints = generateScribblePoints(100);
    const positions = new Float32Array(scribblePoints.length * 6);
    const indices = new Uint16Array((scribblePoints.length - 1) * 6);
    
    // Create vertices for thick lines
    const lineThickness = 15; // Uniform thickness value
    for (let i = 0; i < scribblePoints.length; i++) {
      const point = scribblePoints[i];
      const nextPoint = scribblePoints[i + 1];
      
      // Calculate direction vector for thickness
      let dirX = 0;
      let dirY = 1;
      
      if (i < scribblePoints.length - 1) {
        // Calculate perpendicular direction for line segment
        const dx = nextPoint.x - point.x;
        const dy = nextPoint.y - point.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        dirX = -dy / length;
        dirY = dx / length;
      }
      
      // Set vertices with uniform thickness
      positions[i * 6] = point.x + dirX * lineThickness;
      positions[i * 6 + 1] = point.y + dirY * lineThickness;
      positions[i * 6 + 2] = point.z;
      positions[i * 6 + 3] = point.x - dirX * lineThickness;
      positions[i * 6 + 4] = point.y - dirY * lineThickness;
      positions[i * 6 + 5] = point.z;
    }
    
    // Create indices for triangles
    for (let i = 0; i < scribblePoints.length - 1; i++) {
      const index = i * 6;
      indices[index] = i * 2;
      indices[index + 1] = i * 2 + 1;
      indices[index + 2] = (i + 1) * 2;
      indices[index + 3] = (i + 1) * 2;
      indices[index + 4] = i * 2 + 1;
      indices[index + 5] = (i + 1) * 2 + 1;
    }
    
    const scribbleGeometry = new THREE.BufferGeometry();
    scribbleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    scribbleGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
    
    const scribbleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFEE8C,
      side: THREE.DoubleSide
    });
    
    scribbleRef.current = new THREE.Mesh(scribbleGeometry, scribbleMaterial);
    sceneRef.current.add(scribbleRef.current);

    // Animation function
    const animate = () => {
      if (progressRef.current < scribblePoints.length) {
        scribbleGeometry.setDrawRange(0, progressRef.current);
        progressRef.current += 1;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      rendererRef.current.setSize(width, height);
      
      cameraRef.current.left = -width / 2;
      cameraRef.current.right = width / 2;
      cameraRef.current.top = height / 2;
      cameraRef.current.bottom = -height / 2;
      cameraRef.current.updateProjectionMatrix();
    };

    // Mount renderer to container
    const container = containerRef.current;
    if (container) {
      container.appendChild(rendererRef.current.domElement);
    }

    window.addEventListener('resize', handleResize);
    frameIdRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}

function generateScribblePoints(numPoints) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const x = (Math.random() - 0.5) * window.innerWidth;
    const y = (Math.random() - 0.5) * window.innerHeight;
    points.push(new THREE.Vector3(x, y, 0));
  }
  return points;
}