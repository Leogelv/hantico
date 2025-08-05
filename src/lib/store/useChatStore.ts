import { create } from 'zustand';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface QuickReply {
  id: string;
  text: string;
  value: string;
}

interface ChatStore {
  messages: Message[];
  isTyping: boolean;
  currentQuickReplies: QuickReply[];
  chatContext: string;
  
  // Actions
  addMessage: (content: string, type: 'user' | 'ai') => void;
  setTyping: (typing: boolean) => void;
  setQuickReplies: (replies: QuickReply[]) => void;
  clearChat: () => void;
  sendMessage: (content: string) => Promise<void>;
}

const aiResponses = {
  greeting: {
    text: "Привет! Я ваш персональный ассистент здоровья. Расскажите, что вас беспокоит? Может быть, есть симптомы, которые влияют на ваше самочувствие?",
    quickReplies: [
      { id: '1', text: 'Хроническая усталость', value: 'fatigue' },
      { id: '2', text: 'Проблемы со сном', value: 'sleep' },
      { id: '3', text: 'Частые головные боли', value: 'headache' },
      { id: '4', text: 'Проблемы с пищеварением', value: 'digestion' }
    ]
  },
  fatigue: {
    text: "Понимаю, усталость может сильно влиять на качество жизни. Давайте разберемся в причинах. Как давно вы чувствуете упадок сил?",
    quickReplies: [
      { id: '1', text: 'Несколько недель', value: 'weeks' },
      { id: '2', text: 'Больше месяца', value: 'month' },
      { id: '3', text: 'Полгода и более', value: 'months' }
    ]
  },
  sleep: {
    text: "Качественный сон - основа здоровья. Что именно вас беспокоит больше всего?",
    quickReplies: [
      { id: '1', text: 'Долго засыпаю', value: 'fall_asleep' },
      { id: '2', text: 'Часто просыпаюсь', value: 'wake_up' },
      { id: '3', text: 'Рано просыпаюсь', value: 'early_wake' }
    ]
  },
  weeks: {
    text: "Несколько недель усталости - это повод для внимания. Связываете ли вы это с какими-то изменениями в жизни? Может быть, стресс, изменения в режиме питания или физической активности?",
    quickReplies: [
      { id: '1', text: 'Да, был сильный стресс', value: 'stress' },
      { id: '2', text: 'Изменился режим питания', value: 'diet' },
      { id: '3', text: 'Ничего особенного не было', value: 'nothing' }
    ]
  }
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isTyping: false,
  currentQuickReplies: [],
  chatContext: '',

  addMessage: (content, type) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

  setTyping: (typing) => {
    set({ isTyping: typing });
  },

  setQuickReplies: (replies) => {
    set({ currentQuickReplies: replies });
  },

  clearChat: () => {
    set({
      messages: [],
      currentQuickReplies: [],
      chatContext: ''
    });
  },

  sendMessage: async (content) => {
    const { addMessage, setTyping, setQuickReplies } = get();
    
    // Добавляем сообщение пользователя
    addMessage(content, 'user');
    
    // Показываем индикатор печатания
    setTyping(true);
    
    try {
      // Отправляем в n8n
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const payload = {
        question: content,
        sessionId: sessionId,
        stage: 'main_chat',
        timestamp: new Date().toISOString()
      };
      
      console.log('🚀 [GlobalChat] Отправляем в n8n:', payload);
      
      const response = await fetch('https://n8n.nooweb.online/webhook/selfagent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('📥 [GlobalChat] Статус ответа:', response.status);

      if (response.ok) {
        // Проверяем, есть ли контент в ответе
        const text = await response.text();
        console.log('📄 [GlobalChat] Сырой ответ:', text);
        
        let aiResponseText = 'Спасибо за ваше сообщение!';
        
        if (text) {
          try {
            const result = JSON.parse(text);
            console.log('✅ [GlobalChat] Распарсенный ответ:', result);
            
            // Обрабатываем новый формат ответа от n8n
            if (Array.isArray(result) && result.length > 0 && result[0].output) {
              try {
                // Парсим JSON из поля output
                const parsedOutput = JSON.parse(result[0].output);
                console.log('📊 [GlobalChat] Распарсенный output:', parsedOutput);
                
                if (parsedOutput.comment) {
                  aiResponseText = parsedOutput.comment;
                } else if (parsedOutput.response) {
                  aiResponseText = parsedOutput.response;
                }
              } catch (parseError) {
                console.error('❌ [GlobalChat] Ошибка парсинга output:', parseError);
              }
            } else if (result.comment) {
              aiResponseText = result.comment;
            } else if (result.response) {
              aiResponseText = result.response;
            }
          } catch (jsonError) {
            console.error('❌ [GlobalChat] Ошибка парсинга JSON:', jsonError);
          }
        } else {
          console.warn('⚠️ [GlobalChat] Пустой ответ от сервера');
        }
        
        console.log('💬 [GlobalChat] Используем текст:', aiResponseText);
        
        setTyping(false);
        addMessage(aiResponseText, 'ai');
        setQuickReplies([]);
      } else {
        console.error('❌ [GlobalChat] Ошибка HTTP:', response.status, response.statusText);
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('❌ [GlobalChat] Ошибка при отправке в n8n:', error);
      console.log('🔄 [GlobalChat] Используем локальный ответ');
      
      // Fallback на локальный ответ
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
      
      let response = aiResponses.greeting;
      
      if (content.toLowerCase().includes('усталость') || content === 'fatigue') {
        response = aiResponses.fatigue;
      } else if (content.toLowerCase().includes('сон') || content === 'sleep') {
        response = aiResponses.sleep;
      } else if (content === 'weeks') {
        response = aiResponses.weeks;
      }
      
      setTyping(false);
      addMessage(response.text, 'ai');
      setQuickReplies(response.quickReplies);
    }
  }
}));