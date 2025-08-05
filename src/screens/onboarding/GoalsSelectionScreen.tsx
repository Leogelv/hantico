import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { availableGoals, getIconComponent } from '@/lib/mockData';
import { useUserStore } from '@/lib/store/useUserStore';
import { ArrowRight, Check } from 'lucide-react';
import { Goal } from '@/lib/types';

export function GoalsSelectionScreen() {
  const navigate = useNavigate();
  const { updateUserGoals, nextStep } = useUserStore();
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const [showContinue, setShowContinue] = useState(false);

  const handleGoalToggle = (goal: Goal) => {
    setSelectedGoals(prev => {
      const isAlreadySelected = prev.find(g => g.id === goal.id);
      
      if (isAlreadySelected) {
        return prev.filter(g => g.id !== goal.id);
      } else if (prev.length < 3) {
        const newSelected = [...prev, { ...goal, selected: true }];
        if (newSelected.length >= 1 && !showContinue) {
          setShowContinue(true);
        }
        return newSelected;
      }
      return prev;
    });
  };

  const handleContinue = () => {
    updateUserGoals(selectedGoals);
    nextStep();
    navigate('/onboarding/chat');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Progress */}
        <OnboardingProgress currentStep={1} className="mb-12" />

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Ваши приоритеты здоровья
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Выберите до 3 главных целей, над которыми хотите работать. 
            Это поможет нам создать персональный план для вас.
          </p>
        </motion.div>

        {/* Selection counter */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full">
            <span className="text-sm text-text-secondary">
              Выбрано: {selectedGoals.length}/3
            </span>
            {selectedGoals.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-health-good rounded-full"
              />
            )}
          </div>
        </motion.div>

        {/* Goals grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, staggerChildren: 0.1 }}
        >
          {availableGoals.map((goal, index) => {
            const IconComponent = getIconComponent(goal.icon);
            const isSelected = selectedGoals.find(g => g.id === goal.id);
            const isDisabled = !isSelected && selectedGoals.length >= 3;
            
            return (
              <motion.div
                key={goal.id}
                className={`
                  relative cursor-pointer group transition-all duration-300
                  ${isDisabled ? 'opacity-50 pointer-events-none' : ''}
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!isDisabled ? { 
                  scale: 1.02,
                  y: -5
                } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                onClick={() => !isDisabled && handleGoalToggle(goal)}
              >
                {/* Selection indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-health-good rounded-full flex items-center justify-center shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Card */}
                <div
                  className={`
                    h-full p-6 rounded-2xl transition-all duration-300 relative overflow-hidden
                    ${isSelected 
                      ? 'health-card selected border-health-good/50' 
                      : 'health-card hover:border-health-good/30'
                    }
                  `}
                >
                  {/* Icon */}
                  <motion.div
                    className={`
                      w-14 h-14 rounded-2xl mb-5 flex items-center justify-center relative
                      ${isSelected 
                        ? 'bg-gradient-to-br from-health-good to-health-excellent shadow-lg' 
                        : 'bg-gradient-to-br from-health-surface to-surface border border-health-border/30'
                      }
                    `}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconComponent className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-health-good'}`} />
                    
                    {/* Subtle glow effect */}
                    {isSelected && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-health-good/20 to-transparent" />
                    )}
                  </motion.div>

                  {/* Content */}
                  <h3 className={`text-lg font-semibold mb-3 ${isSelected ? 'text-text-primary' : 'text-text-primary'}`}>
                    {goal.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {goal.description}
                  </p>

                  {/* Selection accent line */}
                  {isSelected && (
                    <motion.div
                      className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-health-good to-health-excellent rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Continue button */}
        <AnimatePresence>
          {showContinue && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="hero"
                size="xl"
                onClick={handleContinue}
                className="group"
              >
                Продолжить
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-sm text-text-muted mt-4">
                Вы всегда сможете изменить цели в настройках
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}