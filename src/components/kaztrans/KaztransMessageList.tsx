import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot } from 'lucide-react';
import { Message } from './types';
import { KaztransMessageItem } from './KaztransMessageItem';

interface KaztransMessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function KaztransMessageList({ messages, isLoading }: KaztransMessageListProps) {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        {messages.map((message) => (
          <div key={message.id}>
            <KaztransMessageItem message={message} />
          </div>
        ))}

        {/* Индикатор загрузки */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            
            <div className="bg-white p-3 sm:p-4 rounded-2xl mr-1 sm:mr-2 border border-blue-200 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-blue-600 font-medium">
                  <span className="hidden sm:inline">КазТрансОйл AI печатает...</span>
                  <span className="sm:hidden">Печатает...</span>
                </span>
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Скролл якорь */}
        <div ref={scrollEndRef} />
      </div>
    </ScrollArea>
  );
}