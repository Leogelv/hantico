import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import * as THREE from 'three';

function SimpleHealthModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={groupRef}>
      {/* Основное тело */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 2.5, 0.8]} />
        <meshStandardMaterial 
          color="#4f46e5" 
          transparent 
          opacity={0.8}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Кольца здоровья */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.1, 16, 100]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.6} />
      </mesh>
      
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 4]}>
        <torusGeometry args={[2.2, 0.08, 16, 100]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.7} />
      </mesh>
      
      <mesh rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[1.5, 0.06, 16, 100]} />
        <meshStandardMaterial color="#f59e0b" transparent opacity={0.8} />
      </mesh>
      
      {/* Орбы органов */}
      <mesh position={[-1, 1, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      
      <mesh position={[1, 0.5, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      <mesh position={[0, -0.8, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      
      <mesh position={[-0.5, 0, 0.5]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
      
      <mesh position={[0.5, -0.3, -0.3]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Освещение */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
      
      {/* 3D модель */}
      <SimpleHealthModel />
      
      {/* Контроллы камеры */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        minDistance={3}
        maxDistance={8}
      />
    </>
  );
}

interface HealthAvatar3DProps {
  className?: string;
}

export function HealthAvatar3D({ className = '' }: HealthAvatar3DProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [5, 2, 5], fov: 50 }}
        className="w-full h-full"
      >
        <Scene />
      </Canvas>
      
      {/* Подсказки управления */}
      <div className="absolute bottom-4 left-4 text-xs text-text-muted bg-surface/80 backdrop-blur-sm rounded-lg p-2">
        <p>🖱️ Вращение • 🔍 Масштаб</p>
      </div>
    </div>
  );
}