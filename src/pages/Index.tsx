import React, { useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  TrendingUp, 
  Target, 
  Bell, 
  Plus, 
  ArrowRight, 
  Activity, 
  Brain, 
  Calendar, 
  FileText,
  Pill,
  Dumbbell,
  Moon,
  Flower2,
  Utensils,
  Droplets,
  Footprints,
  Flame,
  Star,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/lib/store/useUserStore';
import { useHealthStore } from '@/lib/store/useHealthStore';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const Spline = lazy(() => import('@splinetool/react-spline'));

// Данные для страйков по категориям
const streakCategories = [
  {
    id: 'medications',
    name: 'Лекарства',
    icon: Pill,
    streak: 14,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    description: 'Витамин D, Магний'
  },
  {
    id: 'exercise',
    name: 'Упражнения',
    icon: Dumbbell,
    streak: 7,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    description: 'Зарядка 15 мин'
  },
  {
    id: 'sleep',
    name: 'Режим сна',
    icon: Moon,
    streak: 12,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    description: 'Ложусь до 23:00'
  },
  {
    id: 'mindfulness',
    name: 'Медитация',
    icon: Flower2,
    streak: 5,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    description: '10 мин в день'
  },
  {
    id: 'nutrition',
    name: 'Питание',
    icon: Utensils,
    streak: 9,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    description: '5 порций овощей'
  },
  {
    id: 'hydration',
    name: 'Вода',
    icon: Droplets,
    streak: 21,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    description: '2 литра в день'
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { healthScore = 8.4 } = useHealthStore();
  
  // Общий страйк - минимальный из всех категорий
  const totalStreak = Math.min(...streakCategories.map(c => c.streak));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-health-surface/20">
      {/* Hero Section with Spline */}
      <div className="relative h-[60vh] overflow-hidden">
        {/* Spline 3D Scene */}
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-background/20 to-background">
            <div className="text-text-secondary">Загрузка 3D модели...</div>
          </div>
        }>
          <Spline
            scene="https://prod.spline.design/GpwHEUeTGYXiyPe5/scene.splinecode"
            className="w-full h-full"
          />
        </Suspense>
        
        {/* Gradient Overlay - только внизу 150px */}
        <div className="absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        
        {/* Overlay Content */}
        <motion.div 
          className="absolute inset-x-0 bottom-0 z-20 p-6 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Привет! 👋
              </h1>
              <p className="text-xl text-white/80">
                Ваш индекс здоровья: {healthScore}/10
              </p>
            </div>
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-health-excellent to-health-good flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Flame className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-24 pt-4">
        {/* Streak Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">Ваши страйки</h2>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-lg font-bold text-text-primary">{totalStreak} дней</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {streakCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={`p-4 cursor-pointer transition-all hover:shadow-lg ${category.bgColor} border-0`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-sm`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className={`font-bold ${category.textColor}`}>{category.streak}</span>
                      </div>
                    </div>
                    <h3 className={`font-semibold text-sm ${category.textColor} mb-1`}>
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {category.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-text-primary mb-4">Быстрые действия</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="p-6 cursor-pointer bg-gradient-to-br from-health-excellent/10 to-health-excellent/20 border-0 hover:shadow-lg transition-all"
              onClick={() => navigate('/chat')}
            >
              <Brain className="w-8 h-8 text-health-excellent mb-3" />
              <h3 className="font-semibold text-text-primary mb-1">AI Чат</h3>
              <p className="text-sm text-text-secondary">Спросить совет</p>
            </Card>
            
            <Card 
              className="p-6 cursor-pointer bg-gradient-to-br from-health-good/10 to-health-good/20 border-0 hover:shadow-lg transition-all"
              onClick={() => navigate('/health')}
            >
              <Heart className="w-8 h-8 text-health-good mb-3" />
              <h3 className="font-semibold text-text-primary mb-1">Здоровье</h3>
              <p className="text-sm text-text-secondary">Трекинг прогресса</p>
            </Card>
            
            <Card 
              className="p-6 cursor-pointer bg-gradient-to-br from-health-warning/10 to-health-warning/20 border-0 hover:shadow-lg transition-all"
              onClick={() => navigate('/analytics')}
            >
              <FileText className="w-8 h-8 text-health-warning mb-3" />
              <h3 className="font-semibold text-text-primary mb-1">Анализы</h3>
              <p className="text-sm text-text-secondary">История результатов</p>
            </Card>
            
            <Card 
              className="p-6 cursor-pointer bg-gradient-to-br from-purple-500/10 to-purple-500/20 border-0 hover:shadow-lg transition-all"
              onClick={() => navigate('/health')}
            >
              <Activity className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-text-primary mb-1">Карта</h3>
              <p className="text-sm text-text-secondary">Визуализация здоровья</p>
            </Card>
          </div>
        </motion.div>

        {/* Daily Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-text-primary">Сегодня</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Footprints className="w-5 h-5 text-white" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12%
                </Badge>
              </div>
              <div className="text-2xl font-bold text-blue-700 mb-1">8,432</div>
              <div className="text-sm text-blue-600">Шагов</div>
              <Progress value={84} className="mt-2 h-2" />
              <div className="text-xs text-blue-600 mt-1">Цель: 10,000</div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <Star className="w-3 h-3 mr-1" />
                  Отлично
                </Badge>
              </div>
              <div className="text-2xl font-bold text-green-700 mb-1">76%</div>
              <div className="text-sm text-green-600">Энергия</div>
              <Progress value={76} className="mt-2 h-2" />
              <div className="text-xs text-green-600 mt-1">Хороший уровень</div>
            </Card>
          </div>
        </motion.div>

        {/* Motivational Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <Card className="p-6 bg-gradient-to-br from-health-excellent/10 via-health-good/10 to-purple-500/10 border-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-health-excellent to-purple-500 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary mb-1">
                  Отличная работа! 🎉
                </h3>
                <p className="text-sm text-text-secondary">
                  Вы поддерживаете {totalStreak} привычек уже {totalStreak} дней подряд. Продолжайте в том же духе!
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-text-secondary" />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
