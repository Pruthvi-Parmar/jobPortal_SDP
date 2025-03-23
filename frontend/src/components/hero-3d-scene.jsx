import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  Environment, 
  PresentationControls, 
  Float, 
  useGLTF, 
  Text, 
  ContactShadows,
  Html
} from '@react-three/drei'
import { Briefcase } from 'lucide-react'

// 3D Model component for a floating briefcase
function BriefcaseModel({ position = [0, 0, 0] }) {
  const briefcaseRef = useRef()
  
  // Animate the briefcase
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    briefcaseRef.current.rotation.y = Math.sin(t / 2) / 8
    briefcaseRef.current.rotation.x = Math.sin(t / 4) / 8
    briefcaseRef.current.position.y = Math.sin(t / 1.5) / 10
  })

  return (
    <group ref={briefcaseRef} position={position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh castShadow receiveShadow scale={1.5}>
          <boxGeometry args={[1, 0.8, 0.3]} />
          <meshStandardMaterial color="#4338ca" />
          <Html position={[0, 0, 0.151]} transform occlude>
            <div className="flex items-center justify-center w-24 h-20">
              <Briefcase className="h-10 w-10 text-white" />
            </div>
          </Html>
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 32]} />
          <meshStandardMaterial color="#4338ca" />
        </mesh>
      </Float>
    </group>
  )
}

// Floating cards component
function FloatingCards() {
  const cardsRef = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    cardsRef.current.rotation.y = Math.sin(t / 3) / 10
  })
  
  return (
    <group ref={cardsRef}>
      {[
        { position: [-1.5, 0, 0.5], rotation: [0.1, 0.1, 0], color: "#f3f4f6", text: "Resume" },
        { position: [1.5, -0.2, -0.5], rotation: [-0.1, -0.2, 0.1], color: "#e0e7ff", text: "Profile" },
        { position: [0, 0.8, -1], rotation: [0.2, 0.3, 0], color: "#ede9fe", text: "Jobs" },
      ].map((card, index) => (
        <Float key={index} speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
          <mesh 
            position={card.position} 
            rotation={card.rotation} 
            castShadow
          >
            <boxGeometry args={[1.2, 0.8, 0.05]} />
            <meshStandardMaterial color={card.color} />
            <Text
              position={[0, 0, 0.03]}
              fontSize={0.15}
              color="#4338ca"
              font="/fonts/Inter_Regular.json"
              anchorX="center"
              anchorY="middle"
            >
              {card.text}
            </Text>
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// Particles component for background effect
function Particles({ count = 100 }) {
  const mesh = useRef()
  const { viewport } = useThree()
  
  // Generate random particles
  const particles = React.useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 0.03 + 0.01
      const x = (Math.random() - 0.5) * viewport.width * 1.5
      const y = (Math.random() - 0.5) * viewport.height * 1.5
      const z = (Math.random() - 0.5) * 3
      temp.push({ size, position: [x, y, z] })
    }
    return temp
  }, [count, viewport])
  
  return (
    <group ref={mesh}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial color="#c7d2fe" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// Main 3D Scene component
export default function Hero3DScene() {
  return (
    <div className="relative lg:h-[540px] hidden lg:block">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={['#f5f3ff']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <PresentationControls
          global
          rotation={[0.1, 0, 0]}
          polar={[-0.2, 0.2]}
          azimuth={[-0.5, 0.5]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <BriefcaseModel position={[0, -0.5, 0]} />
          <FloatingCards />
          <Particles count={80} />
        </PresentationControls>
        
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2.5} />
        <Environment preset="city" />
      </Canvas>
      
      {/* Keep the decorative gradient element */}
      <div className="absolute -right-6 -bottom-6 h-64 w-64 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl opacity-20 blur-2xl"></div>
    </div>
  )
}
