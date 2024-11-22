import React, { useRef, useEffect, useState } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'

// Import lights from three
import { AmbientLight, DirectionalLight } from 'three'

export function CoffeeOBJ(props) {
  const meshRef = useRef()
  const [model, setModel] = useState(null)
  
  // Combine geometry and material loading into a single useEffect
  useEffect(() => {
    const objLoader = new OBJLoader()
    const texLoader = new THREE.TextureLoader()
    
    // Use texturePath from props, with a fallback
    const texture = texLoader.load(props.texturePath || '/Pack2.png')
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      metalness: 0,
      roughness: 1,
      envMapIntensity: 1.0,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    })

    // Then load OBJ with the prepared material
    objLoader.load('/Coffee OBJ.obj', (obj) => {
      obj.traverse((child) => {
        if (child.isMesh) {
          const geo = child.geometry.clone()
          geo.center()
          child.material = material
          setModel({ geometry: geo, material })
        }
      })
    })

    // Cleanup function
    return () => {
      texture.dispose()
      material.dispose()
    }
  }, [props.texturePath])

  // Animation with useFrame for better performance
  const rotationSpeed = 1.0 // Increased from 0.2 for more noticeable rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed
    }
  })

  if (!model) return null

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        intensity={0.7}
        position={[5, 5, 5]}
        castShadow
      />
      <mesh
        ref={meshRef}
        geometry={model.geometry}
        material={model.material}
        scale={0.4}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
        {...props}
      />
    </>
  )
}

export default CoffeeOBJ
