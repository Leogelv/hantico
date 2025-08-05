import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TouchFeedbackProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onTap?: () => void;
}

// Компонент для тактильной обратной связи на мобильных устройствах
export function TouchFeedback({ 
  children, 
  className = '', 
  disabled = false, 
  onTap 
}: TouchFeedbackProps) {
  return (
    <motion.div
      className={`touch-manipulation select-none ${className}`}
      whileTap={disabled ? {} : { scale: 0.97 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 25 
      }}
      onTap={disabled ? undefined : onTap}
      style={disabled ? { pointerEvents: 'none' } : {}}
    >
      {children}
    </motion.div>
  );
}

// Компонент для кнопок с улучшенной мобильной интерактивностью
export function MobileActionButton({ 
  children, 
  onClick, 
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '' 
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const baseClasses = 'rounded-full font-medium transition-all duration-200 touch-manipulation';
  
  const variantClasses = {
    primary: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  };

  return (
    <motion.button
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.95 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.button>
  );
}

// Компонент для свайпов
export function SwipeableCard({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  className = '' 
}: {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}) {
  return (
    <motion.div
      className={`touch-manipulation ${className}`}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(event, info) => {
        const threshold = 100;
        if (info.offset.x > threshold && onSwipeRight) {
          onSwipeRight();
        } else if (info.offset.x < -threshold && onSwipeLeft) {
          onSwipeLeft();
        }
      }}
      whileDrag={{ scale: 1.05, rotateZ: info => info.offset.x / 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}