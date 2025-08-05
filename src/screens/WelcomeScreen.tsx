import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Logo, LogoText } from '@/components/ui/logo';
import { ParticlesBackground, FloatingElements } from '@/components/animations/ParticlesBackground';
import { TypewriterText, AnimatedText } from '@/components/animations/TypewriterText';
import { ArrowRight, Sparkles, Heart, Brain, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Анализ",
      description: "Персональные инсайты из ваших данных"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Холистический подход",
      description: "Связываем симптомы, анализы и самочувствие"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Умные рекомендации",
      description: "Действенные советы для улучшения здоровья"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <ParticlesBackground count={30} />
      <FloatingElements />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Logo size="xl" animated className="mx-auto mb-6" />
          <LogoText size="xl" className="mb-4" />
          
          <motion.div
            className="h-16 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <TypewriterText
              text="Ваше здоровье. Под контролем. Осознанно."
              speed={60}
              className="text-xl md:text-2xl text-text-secondary font-light tracking-wide"
              onComplete={() => setTimeout(() => setShowSubtitle(true), 300)}
            />
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        {showSubtitle && (
          <motion.div
            className="text-center mb-12 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onAnimationComplete={() => setTimeout(() => setShowButtons(true), 200)}
          >
            <AnimatedText
              text="Революционная платформа интегративного здоровья, которая превращает медицинские данные в понятные инсайты и персональные рекомендации"
              className="text-lg text-text-secondary text-balance leading-relaxed"
              delay={0}
            />
          </motion.div>
        )}

        {/* Action buttons */}
        {showButtons && (
          <motion.div
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate('/onboarding/goals')}
                className="group shadow-glow hover:shadow-primary/30 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Начать путешествие к здоровью
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              <Button
                variant="outline"
                size="xl"
                onClick={() => navigate('/')}
                className="group transition-all duration-300"
              >
                У меня уже есть аккаунт
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Features preview */}
        {showButtons && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass p-6 rounded-xl text-center group hover:bg-white/10 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.6 + index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -2
                }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary mb-4 group-hover:shadow-glow transition-all duration-300"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-surface-elevated pointer-events-none" />
    </div>
  );
}