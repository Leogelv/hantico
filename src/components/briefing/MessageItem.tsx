import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Bot, User, Copy, Check } from 'lucide-react';
import { Message } from '@/lib/types/briefing.types';
import { Button } from '@/components/ui/button';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
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
    <motion.div
      className={`group flex gap-2 sm:gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {message.type === 'ai' && (
        <motion.div 
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg"
          whileHover={{ 
            scale: 1.1,
            boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)'
          }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </motion.div>
      )}
      
      <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] relative ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
        <motion.div 
          className={`
            rounded-2xl text-sm leading-relaxed shadow-sm relative overflow-hidden
            ${message.type === 'user' 
              ? 'bg-gradient-to-br from-red-500 to-red-600 text-white p-3 sm:p-4 ml-1 sm:ml-2' 
              : 'bg-white text-gray-800 p-3 sm:p-4 mr-1 sm:mr-2 border border-gray-200'
            }
          `}
          whileHover={{ 
            boxShadow: message.type === 'user' 
              ? '0 8px 25px rgba(239, 68, 68, 0.3)' 
              : '0 8px 25px rgba(0, 0, 0, 0.1)' 
          }}
          transition={{ duration: 0.2 }}
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
                  className="h-6 w-6 p-0 hover:bg-gray-100"
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
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <audio controls className="max-w-full w-full min-w-[200px] sm:min-w-[250px] h-8">
                <source src={message.audioFile} type="audio/webm" />
              </audio>
            </motion.div>
          ) : message.isMarkdown ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ReactMarkdown 
                className="prose prose-sm max-w-none"
                components={{
                  h1: ({children}) => (
                    <motion.h1 
                      className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-gray-900"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {children}
                    </motion.h1>
                  ),
                  h2: ({children}) => (
                    <motion.h2 
                      className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-gray-800"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      {children}
                    </motion.h2>
                  ),
                  h3: ({children}) => <h3 className="text-sm font-medium mb-1 sm:mb-2 text-gray-700">{children}</h3>,
                  p: ({children}) => <p className="mb-1 sm:mb-2 text-gray-700 leading-relaxed text-sm">{children}</p>,
                  ul: ({children}) => <ul className="list-disc list-inside mb-2 sm:mb-3 space-y-1">{children}</ul>,
                  li: ({children}) => <li className="text-gray-700 text-sm">{children}</li>,
                  strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>
                }}
              >
                {message.content}
              </ReactMarkdown>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {message.content}
            </motion.div>
          )}
        </motion.div>
        
        <motion.p 
          className="text-xs text-gray-500 mt-1 sm:mt-2 px-2 sm:px-3 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 0.7 }}
          whileHover={{ opacity: 1 }}
        >
          {formatTime(message.timestamp)}
        </motion.p>
      </div>

      {message.type === 'user' && (
        <motion.div 
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg"
          whileHover={{ 
            scale: 1.1,
            boxShadow: '0 8px 25px rgba(75, 85, 99, 0.4)'
          }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
}