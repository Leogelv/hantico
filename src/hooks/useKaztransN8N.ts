import { useState, useCallback } from 'react';

// Конфигурация N8N для КазТрансОйл
const N8N_WEBHOOK_URL = 'https://n8n.nooweb.online/webhook/kaztrans';
const N8N_AUDIO_WEBHOOK_URL = 'https://n8n.nooweb.online/webhook/kaztrans-audio';

export function useKaztransN8N(agentId: number, sessionId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Отправка текстового сообщения с ID агента
  const sendTextMessage = useCallback(async (message: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        question: message,
        sessionId: sessionId,
        agentId: agentId, // Отправляем ID агента для различной обработки
        stage: `kaztrans_agent_${agentId}`,
        timestamp: new Date().toISOString()
      };

      console.log('🚀 Отправляем в n8n (КазТрансОйл):', payload);

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

      let aiResponseText = generateAgentResponse(agentId, message);
      
      if (text) {
        try {
          const result = JSON.parse(text);
          
          // Обрабатываем различные форматы ответа от n8n
          if (Array.isArray(result) && result.length > 0) {
            if (result[0].comment) {
              aiResponseText = result[0].comment;
            } else if (result[0].output) {
              const parsedOutput = JSON.parse(result[0].output);
              aiResponseText = parsedOutput.comment || parsedOutput.response || aiResponseText;
            }
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
      return generateAgentResponse(agentId, message);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, agentId]);

  // Отправка аудио сообщения
  const sendAudioMessage = useCallback(async (audioBlob: Blob): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-message.webm');
      formData.append('sessionId', sessionId);
      formData.append('agentId', agentId.toString());
      formData.append('stage', `kaztrans_audio_${agentId}`);
      formData.append('timestamp', new Date().toISOString());

      console.log('🎤 Отправляем аудио в n8n (КазТрансОйл)');

      const response = await fetch(N8N_AUDIO_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('🎵 Сырой аудио ответ:', text);

      let aiResponseText = '## Голосовое сообщение получено! 🎤\n\nЯ обрабатываю ваш запрос...';
      
      if (text) {
        try {
          const result = JSON.parse(text);
          
          if (Array.isArray(result) && result.length > 0) {
            if (result[0].comment) {
              aiResponseText = result[0].comment;
            } else if (result[0].output) {
              const parsedOutput = JSON.parse(result[0].output);
              aiResponseText = parsedOutput.comment || parsedOutput.response || aiResponseText;
            }
          } else if (result.comment) {
            aiResponseText = result.comment;
          } else if (result.response) {
            aiResponseText = result.response;
          }
        } catch (jsonError) {
          console.error('❌ Ошибка парсинга аудио JSON:', jsonError);
        }
      }

      return aiResponseText;
    } catch (error) {
      console.error('❌ Ошибка отправки аудио:', error);
      setError('Ошибка при отправке аудио');
      
      return generateAgentResponse(agentId, 'голосовое сообщение');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, agentId]);

  return {
    sendTextMessage,
    sendAudioMessage,
    isLoading,
    error
  };
}

// Mock ответы для разных агентов
function generateAgentResponse(agentId: number, userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  switch(agentId) {
    case 1: // HR Assistant
      if (lowerMessage.includes('отпуск')) {
        return `## Информация об отпусках 🏖️\n\n**У вас осталось 14 дней отпуска в этом году.**\n\n### Как оформить отпуск:\n1. Согласуйте даты с руководителем\n2. Подайте заявление за 2 недели\n3. Дождитесь одобрения в системе\n\n*Напоминаю: неиспользованные дни отпуска сгорают 31 декабря.*`;
      }
      return `## Добро пожаловать! 👋\n\nЯ Айсулу, ваш персональный AI-наставник.\n\n### Чем могу помочь:\n- 📅 Отпуска и больничные\n- 📄 Справки и документы\n- 📚 Обучение и развитие\n- ❓ Ответы на HR-вопросы\n\nЗадайте ваш вопрос!`;

    case 2: // AI Recruiter
      if (lowerMessage.includes('ваканси')) {
        return `## Активные вакансии 🎯\n\n**Сейчас открыто 12 вакансий:**\n\n### Приоритетные позиции:\n- 👨‍💼 Инженер-механик НПС Атырау\n- 👩‍💻 Специалист по ТБ НПС Павлодар\n- 🏗️ Ведущий геолог НПС Шымкент\n\n### Статистика:\n- 156 откликов за неделю\n- 45 кандидатов на рассмотрении\n- Среднее время закрытия: 42 дня`;
      }
      return `## AI-Рекрутер КазТрансОйл 🎯\n\n### Текущая статистика:\n- 12 активных вакансий\n- 87 кандидатов в воронке\n- 15% конверсия откликов\n\nЧто вас интересует?`;

    case 3: // Strategic Dashboard
      if (lowerMessage.includes('пульс') || lowerMessage.includes('команд')) {
        return `## Пульс команды 💗\n\n**Индекс вовлеченности: 7.8/10** ↗️ +0.3\n\n### Топ-5 обсуждаемых тем:\n1. 🍽️ Питание в столовой (156 упоминаний)\n2. 🆕 Новое оборудование (89 упоминаний)\n3. 🎁 Премии и бонусы (134 упоминания)\n4. 💼 Условия труда (98 упоминаний)\n5. 📚 Обучение персонала (76 упоминаний)\n\n*Рекомендация: провести встречу по вопросам питания*`;
      }
      return `## Стратегический дашборд 📊\n\n### Ключевые метрики:\n- Пульс настроений: 7.8/10\n- Эффективность обучения: 82%\n- Безопасность: 89% соответствие\n- Экология: 68% норм\n\nВыберите раздел для детализации.`;

    case 4: // AI-Core Analytics
      if (lowerMessage.includes('roi') || lowerMessage.includes('эффект')) {
        return `## ROI внедрения AI 💰\n\n### Экономический эффект:\n**520 млн ₸** годовая экономия\n\n### Разбивка по направлениям:\n- 🚫 Снижение травматизма: -8%\n- 📈 Рост производительности: +12%\n- ⏱️ Сокращение простоев: -12%\n- 👥 Снижение текучести: -5%\n\n### Окупаемость:\nПолная окупаемость через **8 месяцев**`;
      }
      return `## Глобальная аналитика КТО AI-Core 🌐\n\n### Операционное здоровье: ✅\n- eNPS: +15 за последний месяц\n- Готовность кадрового резерва: 75%\n- ROI обучения: 520 млн ₸/год\n\nЧто детализировать?`;

    default:
      return `## Добро пожаловать в систему КазТрансОйл! 🛢️\n\nВыберите нужного AI-ассистента для работы.`;
  }
}