import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface TypewriterTextProps {
  text: string;
  isMarkdown?: boolean;
  speed?: number;
  onComplete?: () => void;
}

export function TypewriterText({ 
  text, 
  isMarkdown = false, 
  speed = 30,
  onComplete 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  // Сброс при изменении текста
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  if (isMarkdown) {
    return (
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          components={{
            h1: ({children}) => (
              <h1 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-gray-900">
                {children}
              </h1>
            ),
            h2: ({children}) => (
              <h2 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-gray-800">
                {children}
              </h2>
            ),
            h3: ({children}) => <h3 className="text-sm font-medium mb-1 sm:mb-2 text-gray-700">{children}</h3>,
            p: ({children}) => <p className="mb-1 sm:mb-2 text-gray-700 leading-relaxed text-sm">{children}</p>,
            ul: ({children}) => <ul className="list-disc list-inside mb-2 sm:mb-3 space-y-1">{children}</ul>,
            li: ({children}) => <li className="text-gray-700 text-sm">{children}</li>,
            strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>,
            em: ({children}) => <em className="italic text-gray-700">{children}</em>,
            code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{children}</code>,
            blockquote: ({children}) => (
              <blockquote className="border-l-4 border-blue-300 pl-3 py-1 my-2 text-gray-600 italic">
                {children}
              </blockquote>
            ),
          }}
        >
          {displayedText}
        </ReactMarkdown>
        {!isComplete && <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1" />}
      </div>
    );
  }

  return (
    <div className="text-sm leading-relaxed">
      {displayedText}
      {!isComplete && <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1" />}
    </div>
  );
}