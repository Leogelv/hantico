import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface ParticlesBackgroundProps {
  count?: number;
  color?: string;
  speed?: number;
  className?: string;
}

export function ParticlesBackground({ 
  count = 50, 
  color = 'rgba(99, 102, 241, 0.1)', 
  speed = 0.5,
  className = ''
}: ParticlesBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: (Math.random() * 10 + 10) / speed,
        delay: Math.random() * 5
      });
    }
    
    setParticles(newParticles);
  }, [count, speed]);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: color
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export function FloatingElements() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Large floating orbs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-glow opacity-20 blur-3xl"
        style={{ top: '10%', left: '10%' }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-health-excellent/20 to-transparent blur-2xl"
        style={{ top: '60%', right: '10%' }}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-accent/20 blur-xl"
        style={{ bottom: '20%', left: '50%' }}
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />
    </div>
  );
}