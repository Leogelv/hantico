import { useState, useCallback } from 'react';
import { Message } from '@/lib/types/briefing.types';

// Конфигурация N8N
const N8N_WEBHOOK_URL = 'https://n8n.nooweb.online/webhook/briefing';
const N8N_AUDIO_WEBHOOK_URL = 'https://n8n.nooweb.online/webhook/briefing-audio';

export function useN8N(sessionId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Отправка текстового сообщения
  const sendTextMessage = useCallback(async (message: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        question: message,
        sessionId: sessionId,
        stage: 'briefing_chat',
        timestamp: new Date().toISOString()
      };

      console.log('🚀 Отправляем в n8n:', payload);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('📄 Сырой ответ:', text);

      let aiResponseText = '## Спасибо за информацию! 🎯\n\nЯ анализирую ваш ответ и подготавливаю следующие вопросы для более детального понимания ваших потребностей.';
      
      if (text) {
        try {
          const result = JSON.parse(text);
          
          // Обрабатываем различные форматы ответа от n8n
          if (Array.isArray(result) && result.length > 0 && result[0].output) {
            const parsedOutput = JSON.parse(result[0].output);
            aiResponseText = parsedOutput.comment || parsedOutput.response || aiResponseText;
          } else if (result.comment) {
            aiResponseText = result.comment;
          } else if (result.response) {
            aiResponseText = result.response;
          }
        } catch (jsonError) {
          console.error('❌ Ошибка парсинга JSON:', jsonError);
        }
      }

      return aiResponseText;
    } catch (error) {
      console.error('❌ Ошибка при отправке в n8n:', error);
      setError('Ошибка при отправке сообщения');
      
      // Возвращаем mock ответ для демо
      return generateMockResponse(message);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Отправка аудио сообщения
  const sendAudioMessage = useCallback(async (audioBlob: Blob): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-message.webm');
      formData.append('sessionId', sessionId);
      formData.append('stage', 'briefing_audio');
      formData.append('timestamp', new Date().toISOString());

      const response = await fetch(N8N_AUDIO_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.response || '## Голосовое сообщение получено! 🎤\n\nЯ обработаю аудио и отвечу на ваш вопрос.';
    } catch (error) {
      console.error('❌ Ошибка отправки аудио:', error);
      setError('Ошибка при отправке аудио');
      
      return '## Голосовое сообщение принято! 🎤\n\nЯ анализирую ваш вопрос и подготавливаю ответ.';
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  return {
    sendTextMessage,
    sendAudioMessage,
    isLoading,
    error
  };
}

// Mock ответы для демо
function generateMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('компани') || lowerMessage.includes('сфера')) {
    return `## Отлично! 🏢\n\n**Спасибо за информацию о компании!** \n\nТеперь давайте перейдем к следующему важному вопросу:\n\n### Расскажите о текущей системе контроля качества звонков:\n- Как сейчас проверяются звонки? (ручная прослушка, выборочная проверка, автоматические системы)\n- Какой процент звонков проходит проверку?\n- По каким критериям оцениваете качество?`;
  }
  
  if (lowerMessage.includes('звонк') || lowerMessage.includes('контрол') || lowerMessage.includes('качеств')) {
    return `## Понятно! 📞\n\n**Благодарю за детали о контроле качества.** \n\nТеперь важно понять потенциал автоматизации:\n\n### Какие AI-решения вас интересуют больше всего?\n\n- 🎯 **Автоматическая транскрибация** разговоров\n- 📋 **Проверка соблюдения скриптов** операторами\n- 🚫 **Выявление запрещенных слов** и ошибок\n- 📊 **Анализ эмоций** клиентов и операторов\n- 📈 **Автоматические отчеты** по KPI`;
  }
  
  if (lowerMessage.includes('автоматизир') || lowerMessage.includes('процесс')) {
    return `## Интересно! 🤖\n\n**AI может помочь в разных направлениях:**\n\n### Популярные решения для автоматизации:\n\n**🎯 Продажи и маркетинг:**\n- Лидогенерация и скоринг\n- Прогнозирование продаж\n- Персонализация предложений\n\n**👥 HR и обучение:**\n- Автоматический подбор персонала\n- Анализ резюме и собеседований\n- Адаптация новых сотрудников\n\n**📄 Документооборот:**\n- Обработка заявок и договоров\n- Извлечение данных из документов\n\nКакое направление наиболее приоритетно для вас?`;
  }
  
  return `## Благодарю за ответ! ✨\n\n**Я анализирую предоставленную информацию** и готовлю персонализированные рекомендации по внедрению AI в ваши бизнес-процессы.\n\n### Следующие шаги:\n- Детализация технических требований\n- Оценка ROI от внедрения AI\n- План поэтапного внедрения\n\n*Продолжайте отвечать на вопросы, чтобы я мог подготовить максимально точные рекомендации.*`;
}