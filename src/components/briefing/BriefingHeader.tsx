import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface BriefingHeaderProps {
  progress: number;
}

export function BriefingHeader({ progress }: BriefingHeaderProps) {
  return (
    <motion.div
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-red-200/30 shadow-sm"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img 
            src="/logohantico.png" 
            alt="Hantico" 
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">NeiroSync Briefing</h1>
            <p className="text-sm text-gray-600">AI консультант по внедрению</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-100 text-red-700 border-red-200">
            Прогресс: {progress}%
          </Badge>
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Online
          </Badge>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="bg-white border-b border-red-200/30 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Прогресс брифинга</span>
            <span className="text-sm text-gray-500">{progress}% завершено</span>
          </div>
          <div className="w-full bg-red-100 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}