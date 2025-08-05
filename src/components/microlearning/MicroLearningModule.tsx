import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, CheckCircle, Clock, ArrowRight, Star, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MicroLesson {
  id: string;
  title: string;
  description: string;
  duration: number; // в минутах
  category: 'nutrition' | 'sleep' | 'exercise' | 'stress' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  content: {
    text: string;
    tips: string[];
    actionItem: string;
  };
  progress: number;
}

const mockLessons: MicroLesson[] = [
  {
    id: '1',
    title: 'Гигиена сна: основы',
    description: 'Узнайте, как создать идеальные условия для качественного сна',
    duration: 3,
    category: 'sleep',
    difficulty: 'beginner',
    completed: false,
    content: {
      text: 'Качественный сон - основа здоровья. Правильная гигиена сна включает в себя регулярный режим, комфортную температуру (18-20°C) и отсутствие экранов за час до сна.',
      tips: [
        'Ложитесь и вставайте в одно время',
        'Проветривайте комнату перед сном',
        'Избегайте кофеина после 16:00',
        'Создайте ритуал подготовки ко сну'
      ],
      actionItem: 'Сегодня проветрите спальню за 30 минут до сна'
    },
    progress: 0
  },
  {
    id: '2',
    title: 'Стресс и дыхание',
    description: 'Простые техники дыхания для снижения уровня стресса',
    duration: 5,
    category: 'stress',
    difficulty: 'beginner',
    completed: true,
    content: {
      text: 'Правильное дыхание - мощный инструмент управления стрессом. Техника 4-7-8 помогает активировать парасимпатическую нервную систему.',
      tips: [
        'Вдох на 4 счета через нос',
        'Задержка дыхания на 7 счетов',
        'Выдох на 8 счетов через рот',
        'Повторите 4 раза'
      ],
      actionItem: 'Практикуйте дыхание 4-7-8 перед сном 3 дня подряд'
    },
    progress: 100
  },
  {
    id: '3',
    title: 'Микроэлементы в питании',
    description: 'Важность витаминов и минералов для здоровья',
    duration: 4,
    category: 'nutrition',
    difficulty: 'intermediate',
    completed: false,
    content: {
      text: 'Микроэлементы играют ключевую роль в метаболизме. Дефицит даже одного элемента может повлиять на самочувствие.',
      tips: [
        'Включайте разноцветные овощи',
        'Не забывайте о витамине D',
        'Магний помогает при стрессе',
        'Железо важно для энергии'
      ],
      actionItem: 'Добавьте в рацион один новый цветной овощ'
    },
    progress: 25
  }
];

export function MicroLearningModule() {
  const [selectedLesson, setSelectedLesson] = useState<MicroLesson | null>(null);
  const [isStudying, setIsStudying] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sleep': return '😴';
      case 'stress': return '🧘';
      case 'nutrition': return '🥗';
      case 'exercise': return '💪';
      default: return '📚';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sleep': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'stress': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'nutrition': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'exercise': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const startLesson = (lesson: MicroLesson) => {
    setSelectedLesson(lesson);
    setIsStudying(true);
  };

  const completeLesson = () => {
    if (selectedLesson) {
      // Здесь бы обновлялось состояние в store
      setIsStudying(false);
      setSelectedLesson(null);
    }
  };

  const StudyMode = () => {
    if (!selectedLesson) return null;

    return (
      <motion.div
        className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex-1 max-w-2xl mx-auto p-6 flex flex-col justify-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">{getCategoryIcon(selectedLesson.category)}</div>
              <h1 className="text-2xl font-bold mb-2">{selectedLesson.title}</h1>
              <div className="flex items-center justify-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedLesson.duration} мин
                </div>
                <Badge className={getCategoryColor(selectedLesson.category)}>
                  {selectedLesson.category}
                </Badge>
              </div>
            </div>

            <Card className="p-6 mb-6">
              <p className="text-text-primary leading-relaxed mb-6">
                {selectedLesson.content.text}
              </p>

              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-health-excellent" />
                  Ключевые принципы:
                </h3>
                <ul className="space-y-2">
                  {selectedLesson.content.tips.map((tip, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <CheckCircle className="w-4 h-4 text-health-good mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-health-surface/50 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-health-excellent" />
                  Действие на сегодня:
                </h3>
                <p className="text-sm text-text-secondary">{selectedLesson.content.actionItem}</p>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsStudying(false)}
                className="flex-1"
              >
                Позже
              </Button>
              <Button
                onClick={completeLesson}
                className="flex-1 bg-health-excellent hover:bg-health-good"
              >
                Изучено!
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Микрообучение</h2>
          <Badge variant="outline" className="text-xs">
            {mockLessons.filter(l => l.completed).length} / {mockLessons.length}
          </Badge>
        </div>

        <div className="space-y-3">
          {mockLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${lesson.completed ? 'bg-health-surface/30' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">{getCategoryIcon(lesson.category)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm">{lesson.title}</h3>
                        {lesson.completed && (
                          <CheckCircle className="w-4 h-4 text-health-excellent" />
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mb-2">{lesson.description}</p>
                      <div className="flex items-center gap-3 text-xs text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.duration} мин
                        </div>
                        <Badge className={`text-xs ${getCategoryColor(lesson.category)}`}>
                          {lesson.difficulty}
                        </Badge>
                      </div>
                      {lesson.progress > 0 && lesson.progress < 100 && (
                        <div className="mt-2">
                          <Progress value={lesson.progress} className="h-1" />
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={lesson.completed ? "outline" : "default"}
                    onClick={() => startLesson(lesson)}
                    className="ml-3"
                  >
                    {lesson.completed ? 'Повторить' : lesson.progress > 0 ? 'Продолжить' : 'Изучить'}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isStudying && <StudyMode />}
      </AnimatePresence>
    </>
  );
}