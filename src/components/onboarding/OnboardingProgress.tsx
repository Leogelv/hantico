import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ONBOARDING_STEPS } from '@/lib/types';

interface OnboardingProgressProps {
  currentStep: number;
  className?: string;
}

export function OnboardingProgress({ currentStep, className = '' }: OnboardingProgressProps) {
  const progress = (currentStep / (ONBOARDING_STEPS.length - 1)) * 100;
  
  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-text-secondary">
            Шаг {currentStep + 1} из {ONBOARDING_STEPS.length}
          </span>
          <span className="text-sm text-text-secondary">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Steps indicators - Desktop */}
      <div className="hidden md:flex justify-between items-center">
        {ONBOARDING_STEPS.map((step, index) => (
          <motion.div
            key={step.id}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Step circle */}
            <motion.div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all
                ${index <= currentStep 
                  ? 'bg-gradient-primary text-white shadow-glow' 
                  : 'bg-surface border-2 border-border text-text-muted'
                }
              `}
              whileHover={{ scale: 1.1 }}
              animate={index === currentStep ? {
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 0px rgba(99, 102, 241, 0.5)',
                  '0 0 20px rgba(99, 102, 241, 0.8)',
                  '0 0 0px rgba(99, 102, 241, 0.5)'
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-xs font-semibold">{index + 1}</span>
              )}
            </motion.div>
            
            {/* Step label */}
            <div className="text-center max-w-20">
              <div className={`
                text-xs font-medium mb-1
                ${index <= currentStep ? 'text-text-primary' : 'text-text-muted'}
              `}>
                {step.title}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Steps indicators - Mobile (dots only) */}
      <div className="flex md:hidden justify-center items-center gap-2">
        {ONBOARDING_STEPS.map((step, index) => (
          <motion.div
            key={step.id}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index <= currentStep 
                ? 'bg-primary shadow-glow' 
                : 'bg-border'
              }
              ${index === currentStep ? 'w-6' : 'w-2'}
            `}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>
    </div>
  );
}