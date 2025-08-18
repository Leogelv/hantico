import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { agents, Message } from './types';
import { useKaztransN8N } from '@/hooks/useKaztransN8N';
import { KaztransMessageList } from './KaztransMessageList';
import { KaztransMessageInput } from './KaztransMessageInput';
import { Badge } from '@/components/ui/badge';
import { Bot, Building2, Users, BarChart3, Globe } from 'lucide-react';

const agentIcons: Record<number, React.ReactNode> = {
  1: <Users className="w-5 h-5" />,
  2: <Bot className="w-5 h-5" />,
  3: <BarChart3 className="w-5 h-5" />,
  4: <Globe className="w-5 h-5" />
};

const agentColors: Record<number, string> = {
  1: 'from-blue-500 to-blue-600',
  2: 'from-green-500 to-green-600',
  3: 'from-purple-500 to-purple-600',
  4: 'from-orange-500 to-orange-600'
};

export function KaztransChat() {
  const { agentId } = useParams<{ agentId: string }>();
  const currentAgentId = parseInt(agentId || '1');
  const currentAgent = agents.find(a => a.id === currentAgentId) || agents[0];
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(() => `kto_${currentAgentId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const { sendTextMessage, sendAudioMessage, isLoading } = useKaztransN8N(currentAgentId, sessionId);

  // Инициализация с приветственным сообщением
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'ai',
      content: getWelcomeMessage(currentAgentId),
      timestamp: new Date(),
      isMarkdown: true
    };
    setMessages([welcomeMessage]);
  }, [currentAgentId]);

  const handleSendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    const aiResponse = await sendTextMessage(messageText);
    
    const aiMessage: Message = {
      id: `ai_${Date.now()}`,
      type: 'ai',
      content: aiResponse,
      timestamp: new Date(),
      isMarkdown: true
    };

    setTimeout(() => {
      setMessages(prev => [...prev, aiMessage]);
    }, 500);
  };

  const handleSendAudio = async (audioBlob: Blob) => {
    const userMessage: Message = {
      id: `user_audio_${Date.now()}`,
      type: 'user',
      content: '🎤 Голосовое сообщение',
      timestamp: new Date(),
      audioFile: URL.createObjectURL(audioBlob)
    };

    setMessages(prev => [...prev, userMessage]);

    const aiResponse = await sendAudioMessage(audioBlob);
    
    const aiMessage: Message = {
      id: `ai_${Date.now()}`,
      type: 'ai',
      content: aiResponse,
      timestamp: new Date(),
      isMarkdown: true
    };

    setTimeout(() => {
      setMessages(prev => [...prev, aiMessage]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex flex-col">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-blue-200/30 shadow-sm"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agentColors[currentAgentId]} flex items-center justify-center text-white shadow-lg`}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {agentIcons[currentAgentId]}
            </motion.div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {currentAgent.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {currentAgent.title} • КазТрансОйл
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
              <Building2 className="w-3 h-3 mr-1" />
              КТО AI-Core
            </Badge>
            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="ml-1">Online</span>
            </Badge>
          </div>
        </div>

        {/* Дата и описание */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 px-4 py-2 border-b border-blue-100">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {currentAgent.description}
            </p>
            <span className="text-xs text-gray-500">
              Декабрь 2024
            </span>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <KaztransMessageList messages={messages} isLoading={isLoading} />
      
      {/* Input */}
      <KaztransMessageInput 
        onSendMessage={handleSendMessage}
        onSendAudio={handleSendAudio}
        isLoading={isLoading}
      />
    </div>
  );
}

function getWelcomeMessage(agentId: number): string {
  switch(agentId) {
    case 1:
      return `# Добро пожаловать! Я Айсулу 👋

Ваш персональный AI-наставник в КазТрансОйл.

## Чем могу помочь сегодня?

### 📅 Отпуска и больничные
- Проверка остатков отпуска
- Оформление заявлений
- График отпусков подразделения

### 📄 Документы и справки
- Справка с места работы
- Копии приказов
- Должностные инструкции

### 📚 Обучение и развитие
- Доступные курсы
- План обучения
- Сертификации

### ❓ HR-вопросы
- Премии и бонусы
- Условия труда
- Корпоративные льготы

**Напишите или запишите голосовое сообщение!**`;

    case 2:
      return `# AI-Рекрутер КазТрансОйл 🎯

Интеллектуальная система подбора персонала.

## Текущая статистика

### 📊 Общие показатели
- **12** активных вакансий (+2 за неделю)
- **87** кандидатов в воронке (+15%)
- **45** требуют анимации
- **42** дня - среднее время закрытия (-5 дней)

### 🔥 Приоритетные вакансии
1. Инженер-механик НПС Атырау
2. Специалист по ТБ НПС Павлодар  
3. Ведущий геолог НПС Шымкент

### 💡 Возможности системы
- Автоматический скоринг резюме
- Предсказание успешности кандидата
- Анализ рынка труда
- Оптимизация воронки найма

**Что вас интересует?**`;

    case 3:
      return `# Стратегический дашборд 📊

Панель руководителя подразделения КазТрансОйл.

## Пульс вашего подразделения

### ❤️ Пульс настроений: 7.8/10
*Рост +0.3 за последний месяц*

### 🎯 Эффективность обучения: 82%
- Техника безопасности: 82%
- Цифровые навыки: 89%
- Экологические нормы: 68%

### 🔝 Топ-5 обсуждаемых тем
1. 🍽️ Питание в столовой (156 упоминаний)
2. 🆕 Новое оборудование (89 упоминаний)
3. 🎁 Премии и бонусы (134 упоминания)
4. 💼 Условия труда (98 упоминаний)
5. 📚 Обучение персонала (76 упоминаний)

### 🚨 Требуют внимания
- Процедура премирования (7/9 негатив)
- Качество СИЗ (5/9 негатив)

**Выберите метрику для детального анализа.**`;

    case 4:
      return `# Глобальная аналитика КТО AI-Core 🌐

Стратегический обзор по всем подразделениям.

## Операционное здоровье компании ✅

### 📈 Ключевые показатели
- **eNPS:** +15 (рост +3 за месяц)
- **Текучесть кадров:** 8% (цель <10%)
- **Готовность кадрового резерва:** 75%

## 💰 ROI в человеческий капитал

### Затраты на обучение
**350 млн ₸** (годовой бюджет)

### Расчетный экономический эффект
**520 млн ₸** в год

Разбивка эффекта:
- Снижение травматизма (-8%)
- Рост производительности (+12%)
- Сокращение простоев (-12%)
- Снижение текучести (-5%)

## 🎯 Стратегическое планирование

### Готовность кадрового резерва
- Начальник НПС: 90% ✅
- Главный инженер: 65% ⚠️
- Главный технолог: 30% 🔴
- Зам. начальника по безопасности: 75% ✅

**Задайте вопрос для глубокого анализа.**`;

    default:
      return `# Добро пожаловать в КазТрансОйл AI 🛢️\n\nВыберите нужного ассистента для работы.`;
  }
}