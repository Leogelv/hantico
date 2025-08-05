import React, { useState, useEffect } from 'react';
import { BriefingHeader } from './BriefingHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { QuickTemplates } from './QuickTemplates';
import { useN8N } from '@/hooks/useN8N';
import { Message } from '@/lib/types/briefing.types';

export function BriefingChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTemplates, setShowTemplates] = useState(true);
  const [sessionId] = useState(() => `briefing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const { sendTextMessage, sendAudioMessage, isLoading } = useN8N(sessionId);

  // Инициализация с приветственным сообщением
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'ai',
      content: `# Добро пожаловать в NeiroSync! 🤖

Я ваш AI-консультант по внедрению искусственного интеллекта в бизнес-процессы. 

Сегодня мы проведем **подробный брифинг** для понимания того, как AI может оптимизировать ваши процессы контроля качества звонков и другие направления бизнеса.

## Что мы обсудим:
- 🏢 Информацию о вашей компании
- 📞 Текущую систему контроля качества
- 🤖 Возможности AI-автоматизации
- 🔗 Интеграции с вашими системами

**Давайте начнем!** Расскажите о своей компании или выберите готовый вопрос ниже.`,
      timestamp: new Date(),
      isMarkdown: true
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowTemplates(false);

    // Отправляем в N8N и получаем ответ
    const aiResponse = await sendTextMessage(messageText);
    
    const aiMessage: Message = {
      id: `ai_${Date.now()}`,
      type: 'ai',
      content: aiResponse,
      timestamp: new Date(),
      isMarkdown: true
    };

    // Добавляем небольшую задержку для лучшего UX
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
    setShowTemplates(false);

    // Отправляем аудио в N8N
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

  // Расчет прогресса на основе количества сообщений
  const calculateProgress = () => {
    const messageCount = messages.filter(m => m.type === 'user').length;
    const progress = Math.min(Math.round((messageCount / 10) * 100), 100);
    return progress;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex flex-col">
      <BriefingHeader progress={calculateProgress()} />
      
      <MessageList messages={messages} isLoading={isLoading} />
      
      <QuickTemplates 
        isVisible={showTemplates} 
        onSelectTemplate={handleSendMessage}
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        onSendAudio={handleSendAudio}
        isLoading={isLoading}
      />
    </div>
  );
}