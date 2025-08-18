import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Copy, Check } from 'lucide-react';
import { Message } from './types';
import { Button } from '@/components/ui/button';
import { TypewriterText } from './TypewriterText';

interface KaztransMessageItemProps {
  message: Message;
}

export function KaztransMessageItem({ message }: KaztransMessageItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ru', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Ошибка копирования:', error);
    }
  };

  return (
    <div
      className={`group flex gap-2 sm:gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {message.type === 'ai' && (
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] relative ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
        <div 
          className={`
            rounded-2xl text-sm leading-relaxed shadow-sm relative overflow-hidden
            ${message.type === 'user' 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 sm:p-4 ml-1 sm:ml-2' 
              : 'bg-white text-gray-800 p-3 sm:p-4 mr-1 sm:mr-2 border border-blue-200'
            }
          `}
        >
          {/* Кнопка копирования */}
          <AnimatePresence>
            {isHovered && message.type === 'ai' && !message.audioFile && (
              <motion.div
                className="absolute top-2 right-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-gray-100 touch-manipulation"
                  onClick={handleCopyMessage}
                >
                  <AnimatePresence mode="wait">
                    {isCopied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Check className="w-3 h-3 text-green-600" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Copy className="w-3 h-3 text-gray-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {message.audioFile ? (
            <div className="flex items-center gap-2">
              <audio controls className="max-w-full w-full min-w-[200px] sm:min-w-[250px] h-8">
                <source src={message.audioFile} type="audio/webm" />
              </audio>
            </div>
          ) : message.type === 'ai' ? (
            <TypewriterText 
              text={message.content} 
              isMarkdown={message.isMarkdown}
              speed={20}
            />
          ) : (
            <p className="text-sm leading-relaxed">{message.content}</p>
          )}
        </div>

        {/* Время */}
        <p className="text-xs text-gray-500 mt-1 sm:mt-2 px-2 sm:px-3 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          {formatTime(message.timestamp)}
        </p>
      </div>

      {message.type === 'user' && (
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
          <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
      )}
    </div>
  );
}