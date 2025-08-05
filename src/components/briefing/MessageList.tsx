import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/lib/types/briefing.types';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from '@/components/ui/loading-spinner';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                delay: index * 0.1 
              }}
            >
              <MessageItem message={message} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Улучшенный индикатор загрузки */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="flex gap-3 justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div 
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg"
                animate={{ 
                  boxShadow: [
                    '0 4px 12px rgba(239, 68, 68, 0.3)',
                    '0 8px 24px rgba(239, 68, 68, 0.5)',
                    '0 4px 12px rgba(239, 68, 68, 0.3)'
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </motion.div>
              
              <motion.div 
                className="bg-white p-3 sm:p-4 rounded-2xl mr-1 sm:mr-2 border border-gray-200 shadow-lg backdrop-blur-sm"
                animate={{ 
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    '0 4px 12px rgba(0, 0, 0, 0.1)',
                    '0 8px 24px rgba(0, 0, 0, 0.15)',
                    '0 4px 12px rgba(0, 0, 0, 0.1)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center space-x-3">
                  <TypingIndicator />
                  <motion.span 
                    className="text-xs sm:text-sm text-gray-600 font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="hidden sm:inline">NeiroSync анализирует ваш запрос...</span>
                    <span className="sm:hidden">Анализирует...</span>
                  </motion.span>
                </div>
                
                {/* Дополнительная анимация волны */}
                <motion.div
                  className="mt-1 sm:mt-2 flex space-x-1 justify-center sm:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 bg-red-300 rounded-full"
                      animate={{ 
                        y: [0, -3, 0],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}