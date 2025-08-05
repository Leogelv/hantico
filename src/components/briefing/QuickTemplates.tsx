import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickTemplatesProps {
  isVisible: boolean;
  onSelectTemplate: (template: string) => void;
}

const quickTemplates = [
  'Расскажи о своей компании',
  'Как сейчас контролируете качество звонков?',
  'Какие задачи хотите автоматизировать?',
  'С какими системами нужна интеграция?',
  'Какой бюджет планируете на внедрение AI?'
];

export function QuickTemplates({ isVisible, onSelectTemplate }: QuickTemplatesProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="px-4 py-4 bg-white border-t border-red-200/30"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700">Быстрые вопросы</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {quickTemplates.map((template, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto p-3 text-sm hover:bg-red-50 hover:border-red-300 border-gray-200 w-full"
                    onClick={() => onSelectTemplate(template)}
                  >
                    {template}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}