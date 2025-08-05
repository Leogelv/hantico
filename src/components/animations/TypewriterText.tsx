import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  cursor?: boolean;
}

export function TypewriterText({ 
  text, 
  speed = 50, 
  className = '', 
  onComplete,
  cursor = true 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText('');
    setIsComplete(false);
    
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsComplete(true);
        onComplete?.();
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div className={`inline-block ${className}`}>
      <span>{displayedText}</span>
      {cursor && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-primary ml-1"
          animate={{
            opacity: isComplete ? 0 : [1, 0, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: isComplete ? 0 : Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
}

export function AnimatedText({ 
  text, 
  className = '',
  delay = 0 
}: { 
  text: string; 
  className?: string;
  delay?: number;
}) {
  const words = text.split(' ');

  return (
    <motion.div 
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.1
          }
        }
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={{
            hidden: { 
              opacity: 0, 
              y: 20,
              filter: "blur(8px)"
            },
            visible: { 
              opacity: 1, 
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.5,
                ease: "easeOut"
              }
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}