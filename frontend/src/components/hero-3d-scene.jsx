"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import { Briefcase, Building, User } from "lucide-react";

function Model({ rotate = true }) {
  const group = useRef(null);

  useFrame((state) => {
    if (group.current && rotate) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={group} dispose={null} position={[0, -1, 0]}>
      {/* 3D Briefcase */}
      <mesh position={[-0.5, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.7, 0.2]} />
        <meshStandardMaterial color="#4f46e5" />
        <mesh position={[0, 0, 0.11]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.02]} />
          <meshStandardMaterial color="#312e81" />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.3, 0.1, 0.25]} />
          <meshStandardMaterial color="#4f46e5" />
        </mesh>
      </mesh>

      {/* 3D Building */}
      <mesh position={[0.8, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 1.5, 0.8]} />
        <meshStandardMaterial color="#8b5cf6" />

        {/* Windows */}
        {[...Array(3)].map((_, row) =>
          [...Array(2)].map((_, col) => (
            <mesh key={`window-${row}-${col}`} position={[-0.2 + col * 0.4, -0.4 + row * 0.5, 0.41]} castShadow>
              <planeGeometry args={[0.2, 0.2]} />
              <meshStandardMaterial color="#e0e7ff" emissive="#e0e7ff" emissiveIntensity={0.2} />
            </mesh>
          ))
        )}

        {/* Door */}
        <mesh position={[0, -0.7, 0.41]} castShadow>
          <planeGeometry args={[0.3, 0.4]} />
          <meshStandardMaterial color="#312e81" />
        </mesh>
      </mesh>

      {/* 3D Person silhouette */}
      <mesh position={[0, 0, 0.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#4f46e5" />
        <mesh position={[0, -0.6, 0]} castShadow>
          <capsuleGeometry args={[0.2, 0.6, 8, 16]} />
          <meshStandardMaterial color="#4f46e5" />
        </mesh>
      </mesh>

      {/* Platform */}
      <mesh position={[0, -1.3, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <CircleGeometry args={[2, 36]} /> {/* Use CircleGeometry */}
        <meshStandardMaterial color="#f5f3ff" />
      </mesh>
    </group>
  );
}

function FloatingIcons() {
  const icons = [
    { Icon: Briefcase, position: new THREE.Vector3(-1.5, 0.8, 1), color: "#4f46e5" },
    { Icon: Building, position: new THREE.Vector3(1.5, 1, 0.5), color: "#8b5cf6" },
    { Icon: User, position: new THREE.Vector3(0, 1.5, 0.8), color: "#6366f1" },
  ];

  return (
    <group>
      {icons.map(({ Icon, position, color }, index) => (
        <Html key={index} position={position.toArray()} center>
          <div className="bg-white p-2 rounded-full shadow-lg">
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
        </Html>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-indigo-600/5 rounded-3xl"></div>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Model />
        <ContactShadows position={[0, -1.3, 0]} opacity={0.4} scale={5} blur={2.5} far={4} />
        <Environment preset="city" />
        <FloatingIcons />
      </Canvas>
      <div className="absolute -right-6 -bottom-6 h-64 w-64 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl opacity-20 blur-2xl"></div>
    </div>
  );
}