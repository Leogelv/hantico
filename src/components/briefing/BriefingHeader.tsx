import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Info, CheckCircle2 } from 'lucide-react';

interface BriefingHeaderProps {
  progress: number;
}

export function BriefingHeader({ progress }: BriefingHeaderProps) {
  const [showInfo, setShowInfo] = useState(false);

  const getProgressMessage = () => {
    if (progress < 20) return "Начинаем знакомство";
    if (progress < 50) return "Изучаем потребности";
    if (progress < 80) return "Детализируем решения";
    if (progress < 100) return "Финализируем план";
    return "Брифинг завершен";
  };

  const getProgressColor = () => {
    if (progress < 30) return "from-orange-500 to-red-500";
    if (progress < 70) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-500";
  };

  return (
    <motion.div
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-red-200/30 shadow-sm"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between p-3 sm:p-4">
        <motion.div 
          className="flex items-center gap-2 sm:gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <motion.img 
            src="/logohantico.png" 
            alt="Hantico" 
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            whileHover={{ 
              scale: 1.1,
              filter: 'drop-shadow(0 4px 12px rgba(220, 38, 38, 0.3))'
            }}
            transition={{ type: 'spring', stiffness: 400 }}
          />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">NeiroSync</h1>
            <p className="text-xs sm:text-sm text-gray-600">AI консультант</p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Badge 
              className="bg-red-100 text-red-700 border-red-200 cursor-pointer relative text-xs px-2 py-1"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="w-3 h-3 mr-1 hidden sm:inline" />
              <span className="hidden sm:inline">Прогресс: </span>{progress}%
            </Badge>
          </motion.div>
          
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0 rgba(34, 197, 94, 0)',
                '0 0 15px rgba(34, 197, 94, 0.3)',
                '0 0 0 rgba(34, 197, 94, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1">
              <CheckCircle2 className="w-3 h-3 mr-1 hidden sm:inline" />
              <span className="sm:hidden">●</span>
              <span className="hidden sm:inline">Online</span>
            </Badge>
          </motion.div>
        </div>
      </div>
      
      {/* Информационная панель */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="bg-red-50 border-b border-red-200 px-4 py-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-4xl mx-auto text-sm text-red-700">
              <p className="font-medium mb-1">Текущий этап: {getProgressMessage()}</p>
              <p className="text-red-600">
                Мы собираем информацию о вашей компании для подготовки персонализированных рекомендаций по внедрению AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced Progress Bar */}
      <div className="bg-white border-b border-red-200/30 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <motion.span 
              className="text-sm font-medium text-gray-700"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {getProgressMessage()}
            </motion.span>
            <span className="text-sm text-gray-500">{progress}% завершено</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div 
              className={`bg-gradient-to-r ${getProgressColor()} h-3 rounded-full relative`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Анимация блеска */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </div>
          
          {/* Milestone indicators */}
          <div className="flex justify-between mt-2">
            {[0, 25, 50, 75, 100].map((milestone) => (
              <motion.div
                key={milestone}
                className={`w-2 h-2 rounded-full ${
                  progress >= milestone ? 'bg-red-500' : 'bg-gray-300'
                }`}
                animate={progress >= milestone ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}