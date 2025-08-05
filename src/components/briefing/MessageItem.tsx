import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { Message } from '@/lib/types/briefing.types';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ru', { 
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };

  return (
    <motion.div
      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {message.type === 'ai' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
        <div className={`
          rounded-2xl text-sm leading-relaxed shadow-sm
          ${message.type === 'user' 
            ? 'bg-red-500 text-white p-4 ml-2' 
            : 'bg-white text-gray-800 p-4 mr-2 border border-gray-200'
          }
        `}>
          {message.audioFile ? (
            <div className="flex items-center gap-2">
              <audio controls className="max-w-full">
                <source src={message.audioFile} type="audio/webm" />
              </audio>
            </div>
          ) : message.isMarkdown ? (
            <ReactMarkdown 
              className="prose prose-sm max-w-none"
              components={{
                h1: ({children}) => <h1 className="text-lg font-bold mb-3 text-gray-900">{children}</h1>,
                h2: ({children}) => <h2 className="text-base font-semibold mb-2 text-gray-800">{children}</h2>,
                h3: ({children}) => <h3 className="text-sm font-medium mb-2 text-gray-700">{children}</h3>,
                p: ({children}) => <p className="mb-2 text-gray-700 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                li: ({children}) => <li className="text-gray-700">{children}</li>,
                strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            message.content
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1 px-3">
          {formatTime(message.timestamp)}
        </p>
      </div>

      {message.type === 'user' && (
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}