import { motion } from 'framer-motion';
import { Brain, Heart, Activity } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

export function Logo({ size = 'md', animated = true, className = '' }: LogoProps) {
  const logoAnimation = animated ? {
    scale: [1, 1.05, 1],
    rotate: [0, 5, -5, 0],
  } : {};

  const logoTransition = animated ? {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as const
  } : {};

  const iconAnimation = animated ? {
    opacity: [0.7, 1, 0.7],
  } : {};

  const iconTransition = animated ? {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut" as const
  } : {};

  return (
    <motion.div
      className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
      animate={logoAnimation}
      transition={logoTransition}
    >
      {/* Background circle with gradient */}
      <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 blur-sm" />
      <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-10" />
      
      {/* Main logo circle */}
      <div className="relative z-10 w-full h-full bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
        {/* Center icon */}
        <motion.div
          animate={iconAnimation}
          transition={iconTransition}
        >
          <Brain className="w-1/2 h-1/2 text-white" />
        </motion.div>
        
        {/* Floating health icons */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-health-excellent rounded-full flex items-center justify-center"
          animate={animated ? { y: [-2, 2, -2] } : {}}
          transition={animated ? { duration: 3, repeat: Infinity } : {}}
        >
          <Heart className="w-2 h-2 text-white" />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-1 -left-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center"
          animate={animated ? { y: [2, -2, 2] } : {}}
          transition={animated ? { duration: 3, repeat: Infinity, delay: 1 } : {}}
        >
          <Activity className="w-2 h-2 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function LogoText({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  return (
    <div className={`font-display font-bold ${textSizes[size]} ${className}`}>
      <span className="gradient-text">SELF</span>
    </div>
  );
}