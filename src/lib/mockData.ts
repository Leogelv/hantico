import { Goal } from './types';
import { Zap, Moon, Heart, Brain, Activity, Smile, Shield, Target } from 'lucide-react';

export const availableGoals: Goal[] = [
  {
    id: 'energy',
    title: 'Больше энергии',
    description: 'Просыпаться бодрым и сохранять силы весь день',
    icon: 'Zap',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'sleep',
    title: 'Крепкий сон',
    description: 'Засыпать легко и спать всю ночь',
    icon: 'Moon',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'heart',
    title: 'Здоровое сердце',
    description: 'Поддержать сердечно-сосудистую систему',
    icon: 'Heart',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'focus',
    title: 'Ясность ума',
    description: 'Улучшить концентрацию и память',
    icon: 'Brain',
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'fitness',
    title: 'Физическая форма',
    description: 'Стать сильнее и выносливее',
    icon: 'Activity',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'mood',
    title: 'Хорошее настроение',
    description: 'Больше радости и меньше стресса',
    icon: 'Smile',
    color: 'from-yellow-500 to-amber-500'
  },
  {
    id: 'immunity',
    title: 'Сильный иммунитет',
    description: 'Реже болеть и быстрее восстанавливаться',
    icon: 'Shield',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'longevity',
    title: 'Долголетие',
    description: 'Замедлить старение и сохранить молодость',
    icon: 'Target',
    color: 'from-teal-500 to-green-500'
  }
];

export const getIconComponent = (iconName: string) => {
  const icons = {
    Zap,
    Moon,
    Heart,
    Brain,
    Activity,
    Smile,
    Shield,
    Target
  };
  return icons[iconName as keyof typeof icons] || Zap;
};

export const mockBloodTests = [
  {
    id: '1',
    name: 'Гемоглобин',
    value: 110,
    unit: 'г/л',
    refMin: 120,
    refMax: 160,
    status: 'low' as const,
    aiExplanation: 'Уровень гемоглобина ниже нормы, что может быть причиной вашей усталости. Рекомендую проверить уровень железа и B12.',
    date: new Date('2025-01-15'),
    category: 'Общий анализ крови'
  },
  {
    id: '2',
    name: 'Витамин D',
    value: 18,
    unit: 'нг/мл',
    refMin: 30,
    refMax: 100,
    status: 'low' as const,
    aiExplanation: 'Дефицит витамина D влияет на энергию, иммунитет и настроение. Рекомендуется прием добавок.',
    date: new Date('2025-01-15'),
    category: 'Витамины'
  },
  {
    id: '3',
    name: 'Железо',
    value: 15,
    unit: 'мкмоль/л',
    refMin: 11,
    refMax: 30,
    status: 'normal' as const,
    aiExplanation: 'Уровень железа в норме.',
    date: new Date('2025-01-15'),
    category: 'Микроэлементы'
  }
];

export const mockDailyTasks = [
  {
    id: '1',
    title: 'Принять витамин D',
    description: '1000 МЕ утром после еды',
    time: '08:00',
    category: 'supplements' as const,
    completed: true,
    streak: 5,
    importance: 'high' as const
  },
  {
    id: '2',
    title: '20 минут прогулки',
    description: 'Умеренная активность на свежем воздухе',
    time: '12:00',
    category: 'activity' as const,
    completed: true,
    streak: 3,
    importance: 'medium' as const
  },
  {
    id: '3',
    title: 'Выпить 2 литра воды',
    description: 'Поддержание водного баланса',
    time: '18:00',
    category: 'nutrition' as const,
    completed: false,
    streak: 0,
    importance: 'medium' as const
  },
  {
    id: '4',
    title: 'Медитация 10 минут',
    description: 'Практика осознанности перед сном',
    time: '21:00',
    category: 'wellness' as const,
    completed: false,
    streak: 2,
    importance: 'low' as const
  }
];

export const mockHealthScore = 73;