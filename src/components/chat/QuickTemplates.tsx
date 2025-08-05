import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Heart, Brain, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Template {
  id: string;
  category: string;
  icon: React.ReactNode;
  items: {
    id: string;
    text: string;
    value: string;
  }[];
}

interface QuickTemplatesProps {
  onSelectTemplate: (value: string) => void;
}

const templates: Template[] = [
  {
    id: 'health',
    category: 'Здоровье',
    icon: <Heart className="w-4 h-4" />,
    items: [
      { id: 'h1', text: 'У меня болит голова', value: 'У меня болит голова. Что можно сделать?' },
      { id: 'h2', text: 'Проблемы со сном', value: 'У меня проблемы со сном. Как улучшить качество сна?' },
      { id: 'h3', text: 'Усталость и слабость', value: 'Чувствую постоянную усталость и слабость. В чем может быть причина?' },
      { id: 'h4', text: 'Симптомы простуды', value: 'У меня симптомы простуды. Что предпринять?' }
    ]
  },
  {
    id: 'mood',
    category: 'Настроение',
    icon: <Brain className="w-4 h-4" />,
    items: [
      { id: 'm1', text: 'Чувствую тревогу', value: 'Я чувствую тревогу. Как справиться с этим состоянием?' },
      { id: 'm2', text: 'Стресс на работе', value: 'Испытываю стресс из-за работы. Что делать?' },
      { id: 'm3', text: 'Низкая мотивация', value: 'У меня низкая мотивация. Как ее повысить?' },
      { id: 'm4', text: 'Раздражительность', value: 'Стал очень раздражительным. Как это контролировать?' }
    ]
  },
  {
    id: 'routine',
    category: 'Режим дня',
    icon: <Calendar className="w-4 h-4" />,
    items: [
      { id: 'r1', text: 'Составить распорядок', value: 'Помоги составить здоровый распорядок дня' },
      { id: 'r2', text: 'Утренние ритуалы', value: 'Какие утренние ритуалы помогут начать день продуктивно?' },
      { id: 'r3', text: 'План тренировок', value: 'Составь план тренировок на неделю' },
      { id: 'r4', text: 'Режим питания', value: 'Помоги организовать правильный режим питания' }
    ]
  },
  {
    id: 'quick',
    category: 'Быстрые вопросы',
    icon: <Zap className="w-4 h-4" />,
    items: [
      { id: 'q1', text: 'Проверить симптомы', value: 'Хочу проверить свои симптомы' },
      { id: 'q2', text: 'Напомни о лекарствах', value: 'Настрой напоминание о приеме лекарств' },
      { id: 'q3', text: 'Запись к врачу', value: 'Помоги записаться к врачу' },
      { id: 'q4', text: 'Анализ самочувствия', value: 'Проанализируй мое самочувствие за неделю' }
    ]
  }
];

export function QuickTemplates({ onSelectTemplate }: QuickTemplatesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-2">
      {templates.map((template) => (
        <motion.div
          key={template.id}
          className="border border-health-border/20 rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: templates.indexOf(template) * 0.05 }}
        >
          {/* Заголовок категории */}
          <button
            onClick={() => handleToggle(template.id)}
            className="w-full px-4 py-3 flex items-center justify-between bg-health-surface/50 hover:bg-health-surface transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-health-excellent/20 to-health-good/20 flex items-center justify-center text-health-excellent">
                {template.icon}
              </div>
              <span className="font-medium text-sm text-text-primary">
                {template.category}
              </span>
            </div>
            <motion.div
              animate={{ rotate: expandedId === template.id ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            </motion.div>
          </button>

          {/* Развернутый контент */}
          <AnimatePresence>
            {expandedId === template.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-3 space-y-2 bg-background">
                  {template.items.map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectTemplate(item.value)}
                      className="w-full justify-start text-left text-xs h-auto py-2 px-3 hover:bg-health-surface/50"
                    >
                      {item.text}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}