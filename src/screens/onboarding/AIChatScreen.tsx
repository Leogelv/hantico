import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Send, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { useChatStore } from '@/lib/store/useChatStore';
import { useUserStore } from '@/lib/store/useUserStore';

export function AIChatScreen() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { nextStep } = useUserStore();
  
  const {
    messages,
    isTyping,
    currentQuickReplies,
    addMessage,
    sendMessage,
    setQuickReplies
  } = useChatStore();

  // Инициализация чата с приветственным сообщением
  useEffect(() => {
    if (messages.length === 0) {
      // Показываем индикатор печатания
      const { setTyping } = useChatStore.getState();
      setTyping(true);
      
      // Добавляем приветственное сообщение с задержкой для эффекта печатания
      setTimeout(() => {
        setTyping(false);
        addMessage(
          'Привет! Я ваш персональный AI-ассистент здоровья 🤖\n\n' +
          'Давайте познакомимся! Расскажите:\n' +
          '• Что вас беспокоит в последнее время?\n' +
          '• Есть ли хронические заболевания?\n' +
          '• Какие цели по здоровью хотите достичь?\n\n' +
          'Или просто поделитесь, как себя чувствуете сегодня 💚',
          'ai'
        );
        
        // Добавляем быстрые ответы с эмодзи
        setQuickReplies([
          { id: '1', text: '😴 Часто устаю', value: 'Меня беспокоит постоянная усталость и упадок сил' },
          { id: '2', text: '🌙 Плохо сплю', value: 'У меня проблемы со сном' },
          { id: '3', text: '😰 Стресс на работе', value: 'Испытываю сильный стресс из-за работы' },
          { id: '4', text: '⚖️ Хочу похудеть', value: 'Хочу снизить вес и улучшить физическую форму' },
          { id: '5', text: '🤕 Головные боли', value: 'Меня беспокоят частые головные боли' },
          { id: '6', text: '💊 Проверить анализы', value: 'Хочу проверить свои анализы и понять, всё ли в порядке' },
          { id: '7', text: '🏃 Больше активности', value: 'Хочу стать более активным и заниматься спортом' },
          { id: '8', text: '🥗 Здоровое питание', value: 'Хочу наладить правильное питание' }
        ]);
      }, 800); // Задержка для эффекта печатания
    }
  }, []);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendOnboardingMessage = async (message: string) => {
    // Добавляем сообщение пользователя
    addMessage(message, 'user');
    
    // Показываем индикатор печатания
    const { setTyping, setQuickReplies } = useChatStore.getState();
    setTyping(true);
    
    try {
      const sessionId = `onboarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const payload = {
        question: message,
        sessionId: sessionId,
        stage: 'onboarding',
        timestamp: new Date().toISOString()
      };
      
      console.log('🚀 [Onboarding] Отправляем в n8n:', payload);
      
      const response = await fetch('https://n8n.nooweb.online/webhook/selfagent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        // Проверяем, есть ли контент в ответе
        const text = await response.text();
        console.log('📄 [Onboarding] Сырой ответ:', text);
        
        let aiResponseText = 'Спасибо за ваш вопрос!';
        
        if (text) {
          try {
            const result = JSON.parse(text);
            console.log('✅ [Onboarding] Распарсенный ответ:', result);
            
            // Обрабатываем формат ответа от n8n
            if (Array.isArray(result) && result.length > 0 && result[0].output) {
              try {
                const parsedOutput = JSON.parse(result[0].output);
                if (parsedOutput.comment) {
                  aiResponseText = parsedOutput.comment;
                }
              } catch (parseError) {
                console.error('❌ [Onboarding] Ошибка парсинга output:', parseError);
              }
            } else if (result.comment) {
              aiResponseText = result.comment;
            }
            
            // Если есть быстрые ответы
            if (result.quickReplies) {
              setQuickReplies(result.quickReplies);
            }
          } catch (jsonError) {
            console.error('❌ [Onboarding] Ошибка парсинга JSON:', jsonError);
          }
        } else {
          console.warn('⚠️ [Onboarding] Пустой ответ от сервера');
        }
        
        setTyping(false);
        addMessage(aiResponseText, 'ai');
      } else {
        console.error('❌ [Onboarding] HTTP ошибка:', response.status);
        throw new Error(`HTTP error: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ [Onboarding] Ошибка:', error);
      setTyping(false);
      // Используем локальный ответ с эмодзи
      const fallbackResponses = [
        'Понимаю вас! 🤗 Давайте вместе разберемся, как улучшить ваше самочувствие. Что беспокоит больше всего?',
        'Спасибо, что поделились! 💚 Расскажите подробнее о своих симптомах, чтобы я мог дать более точные рекомендации.',
        'Отлично, что вы заботитесь о своем здоровье! 🌟 Давайте составим план действий. С чего начнем?',
        'Я здесь, чтобы помочь! 🤝 Расскажите больше о вашем образе жизни - это поможет мне дать персональные советы.'
      ];
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      addMessage(randomResponse, 'ai');
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const message = inputValue.trim();
    setInputValue('');
    
    await sendOnboardingMessage(message);
  };

  const handleQuickReply = async (value: string) => {
    await sendOnboardingMessage(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNext = () => {
    nextStep();
    navigate('/onboarding/upload');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        
        // Отправляем голосовое сообщение
        await sendOnboardingMessage('🎤 Голосовое сообщение');
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/onboarding/goals')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <OnboardingProgress currentStep={2} />
          <div className="w-9" /> {/* Spacer for balance */}
        </div>

        {/* Убираем лишний хедер - интро сообщение уже есть в чате */}

        {/* Chat Messages */}
        <div className="bg-surface/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 mb-6 min-h-[400px] max-h-[500px] overflow-y-auto">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-surface border border-border'
                  } rounded-2xl px-4 py-3`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          Э
                        </div>
                        <span className="text-xs text-muted-foreground">Научный сотрудник Эмма</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="bg-surface border border-border rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        Э
                      </div>
                      <span className="text-xs text-muted-foreground">Эмма печатает...</span>
                    </div>
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <AnimatePresence>
          {currentQuickReplies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 gap-2 mb-4"
            >
              {currentQuickReplies.map((reply, index) => (
                <motion.button
                  key={reply.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickReply(reply.value)}
                  className="px-3 py-2.5 bg-surface/50 hover:bg-surface border border-border hover:border-primary/50 rounded-xl text-sm transition-all hover:shadow-sm text-left"
                >
                  {reply.text}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Input */}
        <div className="relative">
          <motion.div
            animate={{
              scale: isInputFocused ? 1.02 : 1,
              boxShadow: isInputFocused 
                ? '0 0 0 1px rgba(99, 102, 241, 0.5)' 
                : '0 0 0 1px rgba(51, 51, 51, 0.5)'
            }}
            className="flex items-center gap-3 bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-3"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Расскажите о своем самочувствии..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              size="sm"
              variant={isRecording ? "destructive" : "outline"}
              className="w-11 h-11 p-0"
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              size="sm"
              className="rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: messages.length >= 2 ? 1 : 0 }}
          className="text-center mt-8"
        >
          <Button
            onClick={handleNext}
            size="lg"
            className="px-8 bg-gradient-to-r from-health-excellent to-health-good hover:from-health-good hover:to-health-excellent"
          >
            <span className="mr-2">Продолжить</span>
            <span>➡️</span>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Вы сможете продолжить диалог позже в основном чате
          </p>
        </motion.div>
      </div>
    </div>
  );
}