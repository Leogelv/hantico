// SELF Types
export interface Goal {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  selected?: boolean;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  path: string;
  completed?: boolean;
}

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'attention' | 'warning';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  time: string;
  category: 'supplement' | 'exercise' | 'diet' | 'lifestyle' | 'medical';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  points?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
  unlockedAt?: Date;
}

export interface HealthGraphNode {
  id: string;
  type: 'symptom' | 'analysis' | 'diagnosis' | 'treatment' | 'metric';
  label: string;
  position: { x: number; y: number };
  data: {
    severity?: number;
    status?: string;
    value?: number;
    unit?: string;
    date?: string;
    description?: string;
  };
}

export interface HealthGraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  animated?: boolean;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 0, title: 'Добро пожаловать', description: 'Знакомство с SELF', path: '/' },
  { id: 1, title: 'Ваши цели', description: 'Выберите приоритеты здоровья', path: '/onboarding/goals' },
  { id: 2, title: 'AI Консультация', description: 'Расскажите о самочувствии', path: '/onboarding/chat' },
  { id: 3, title: 'Анализы', description: 'Загрузите медицинские данные', path: '/onboarding/upload' },
  { id: 4, title: 'Результаты', description: 'Ваш персональный план', path: '/onboarding/results' },
  { id: 5, title: 'Дашборд', description: 'Управление здоровьем', path: '/dashboard' }
];