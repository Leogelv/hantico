import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'red' | 'blue' | 'gray';
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8'
};

const colorMap = {
  red: 'border-red-500',
  blue: 'border-blue-500',
  gray: 'border-gray-500'
};

export function LoadingSpinner({ size = 'md', className, color = 'red' }: LoadingSpinnerProps) {
  return (
    <motion.div
      className={cn(
        'border-2 border-t-transparent rounded-full',
        sizeMap[size],
        colorMap[color],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// Более продвинутый спиннер с точками
export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-red-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
}