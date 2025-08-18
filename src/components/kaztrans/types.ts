export interface Agent {
  id: number;
  name: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  promptFile: string;
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isMarkdown?: boolean;
  audioFile?: string;
}

export const agents: Agent[] = [
  {
    id: 1,
    name: 'Айсулу',
    title: 'HR AI Assistant',
    description: 'Персональный AI-наставник для сотрудников',
    icon: '👩‍💼',
    color: 'blue',
    promptFile: 'hr-assistant'
  },
  {
    id: 2,
    name: 'AI-Рекрутер',
    title: 'Система подбора персонала',
    description: 'Интеллектуальная система рекрутинга',
    icon: '🎯',
    color: 'green',
    promptFile: 'ai-recruiter'
  },
  {
    id: 3,
    name: 'Стратегический дашборд',
    title: 'Панель руководителя',
    description: 'Аналитика для руководителей подразделений',
    icon: '📊',
    color: 'purple',
    promptFile: 'strategic-dashboard'
  },
  {
    id: 4,
    name: 'AI-Core',
    title: 'Глобальная аналитика КТО',
    description: 'Стратегический обзор для топ-менеджмента',
    icon: '🌐',
    color: 'orange',
    promptFile: 'ai-core-analytics'
  }
];