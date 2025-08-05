import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Paperclip, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TypingIndicator } from '@/components/ui/loading-spinner';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onSendAudio: (audioBlob: Blob) => void;
  isLoading: boolean;
}

export function MessageInput({ onSendMessage, onSendAudio, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  // Автофокус на текстовое поле
  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  // Таймер записи
  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);

  // Индикатор печати
  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      // Анимация отправки
      if (textareaRef.current) {
        textareaRef.current.style.transform = 'scale(0.98)';
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.transform = 'scale(1)';
          }
        }, 100);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        onSendAudio(audioBlob);
        
        // Останавливаем все треки
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
      alert('Не удалось получить доступ к микрофону. Проверьте разрешения.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <motion.div 
      className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-red-200/30"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Индикатор записи */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            className="px-4 py-2 bg-red-50 border-b border-red-200"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 text-red-600">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Запись... {formatRecordingTime(recordingTime)}</span>
              <TypingIndicator />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1 relative">
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isLoading ? "NeiroSync обрабатывает..." : "Расскажите о вашей компании..."}
                  onKeyPress={handleKeyPress}
                  className="min-h-[45px] sm:min-h-[50px] max-h-32 resize-none border-gray-300 focus:border-red-400 focus:ring-red-400 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                  disabled={isLoading || isRecording}
                  rows={1}
                />
                
                {/* Индикатор печати */}
                <AnimatePresence>
                  {isTyping && message.length > 0 && (
                    <motion.div
                      className="absolute right-3 bottom-3"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <TypingIndicator />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Счетчик символов */}
                {message.length > 300 && (
                  <motion.div
                    className="absolute right-2 sm:right-3 top-2 sm:top-3 text-xs text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="hidden sm:inline">{message.length}/2000</span>
                    <span className="sm:hidden">{message.length}</span>
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Кнопка записи */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                size="sm"
                variant={isRecording ? "destructive" : "outline"}
                className={`w-10 h-10 sm:w-12 sm:h-12 p-0 rounded-full transition-all duration-200 touch-manipulation ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 animate-pulse' 
                    : 'border-gray-300 hover:bg-red-50 hover:border-red-300'
                }`}
                disabled={isLoading}
              >
                <motion.div
                  animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: isRecording ? Infinity : 0, duration: 0.6 }}
                >
                  {isRecording ? (
                    <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </motion.div>
              </Button>
            </motion.div>

            {/* Кнопка отправки */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleSendMessage} 
                size="sm"
                disabled={!message.trim() || isLoading || isRecording}
                className={`w-10 h-10 sm:w-12 sm:h-12 p-0 rounded-full transition-all duration-200 touch-manipulation ${
                  message.trim() && !isLoading 
                    ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <motion.div
                  animate={isLoading ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              </Button>
            </motion.div>
          </div>

          {/* Подсказки */}
          <AnimatePresence>
            {!message && !isLoading && !isRecording && (
              <motion.div
                className="mt-2 flex items-center justify-center gap-2 sm:gap-4 text-xs text-gray-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span className="flex items-center gap-1">
                  <Send className="w-3 h-3" />
                  <span className="hidden sm:inline">Enter для отправки</span>
                  <span className="sm:hidden">Enter</span>
                </span>
                <span className="flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  <span className="hidden sm:inline">Голосовые сообщения</span>
                  <span className="sm:hidden">Голос</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}