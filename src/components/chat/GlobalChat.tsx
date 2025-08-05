import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, History, Calendar, Bot, User, FileText, Beaker, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/lib/store/useChatStore';
import { useLocation } from 'react-router-dom';
import { QuickTemplates } from './QuickTemplates';

interface ScheduledDialog {
  id: string;
  title: string;
  description: string;
  scheduledFor: Date;
  type: 'checkup' | 'medication' | 'learning' | 'reminder';
  completed: boolean;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  type: 'onboarding' | 'support' | 'health' | 'general';
  messageCount: number;
}

const mockScheduledDialogs: ScheduledDialog[] = [
  {
    id: '1',
    title: 'Еженедельный чекап',
    description: 'Как прошла неделя? Расскажите о самочувствии',
    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // через 2 часа
    type: 'checkup',
    completed: false
  },
  {
    id: '2',
    title: 'Напоминание о витаминах',
    description: 'Время принять витамин D',
    scheduledFor: new Date(Date.now() + 4 * 60 * 60 * 1000),
    type: 'medication',
    completed: false
  },
  {
    id: '3',
    title: 'Микролерн: Сон',
    description: 'Короткий урок о гигиене сна',
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
    type: 'learning',
    completed: false
  }
];

interface AnalysisHistory {
  id: string;
  title: string;
  date: Date;
  type: 'blood' | 'urine' | 'hormones' | 'vitamins';
  status: 'normal' | 'warning' | 'critical';
  items: number;
}

const mockAnalysisHistory: AnalysisHistory[] = [
  {
    id: 'analysis-1',
    title: 'Общий анализ крови',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    type: 'blood',
    status: 'normal',
    items: 15
  },
  {
    id: 'analysis-2',
    title: 'Гормональная панель',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    type: 'hormones',
    status: 'warning',
    items: 8
  },
  {
    id: 'analysis-3',
    title: 'Витамины и минералы',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    type: 'vitamins',
    status: 'critical',
    items: 12
  },
  {
    id: 'analysis-4',
    title: 'Биохимический анализ',
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    type: 'blood',
    status: 'normal',
    items: 20
  }
];

export function GlobalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  const { 
    messages, 
    isTyping, 
    currentQuickReplies, 
    sendMessage, 
    addMessage,
    clearChat 
  } = useChatStore();

  // Скрываем на экранах онбординга
  if (location.pathname.includes('/onboarding') || location.pathname.includes('/welcome')) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    await sendMessage(message);
    setMessage('');
  };

  const handleQuickReply = async (reply: any) => {
    await sendMessage(reply.value);
  };

  const handleTemplateSelect = async (value: string) => {
    setMessage(value);
    setShowTemplates(false);
    await sendMessage(value);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'onboarding': return 'bg-health-good/10 text-health-good border-health-good/20';
      case 'health': return 'bg-health-excellent/10 text-health-excellent border-health-excellent/20';
      case 'support': return 'bg-health-warning/10 text-health-warning border-health-warning/20';
      case 'checkup': return 'bg-health-good/10 text-health-good border-health-good/20';
      case 'medication': return 'bg-health-critical/10 text-health-critical border-health-critical/20';
      case 'learning': return 'bg-health-excellent/10 text-health-excellent border-health-excellent/20';
      default: return 'bg-health-surface/10 text-text-secondary border-health-border/20';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ru', { 
      hour: '2-digit', 
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    }).format(date);
  };

  const FloatingButton = () => (
    <motion.div
      className="fixed top-4 right-4 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Button
        onClick={() => setIsOpen(true)}
        className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-br from-health-excellent to-health-good hover:shadow-xl"
        size="sm"
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </motion.div>
      </Button>
    </motion.div>
  );

  return (
    <>
      {!isOpen && <FloatingButton />}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-background/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-full flex flex-col max-w-md mx-auto border-x border-health-border/20"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-health-border/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-health-excellent to-health-good flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">AI Ассистент</h3>
                    <p className="text-sm text-text-secondary">Всегда готов помочь</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3">
                  <TabsTrigger value="chat" className="text-xs">Чат</TabsTrigger>
                  <TabsTrigger value="history" className="text-xs">История анализов</TabsTrigger>
                  <TabsTrigger value="scheduled" className="text-xs">План</TabsTrigger>
                </TabsList>

                {/* Chat Tab */}
                <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
                  <ScrollArea className="flex-1 px-4 py-2">
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <Bot className="w-12 h-12 mx-auto mb-4 text-health-good" />
                        <p className="text-text-secondary mb-2">Привет! Я ваш AI помощник</p>
                        <p className="text-sm text-text-secondary mb-4">Задайте вопрос или поделитесь самочувствием</p>
                        
                        {/* Кнопка для показа быстрых шаблонов */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowTemplates(!showTemplates)}
                          className="mb-4"
                        >
                          {showTemplates ? 'Скрыть шаблоны' : 'Быстрые шаблоны'}
                        </Button>
                        
                        {/* Компонент быстрых шаблонов */}
                        <AnimatePresence>
                          {showTemplates && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="max-w-sm mx-auto"
                            >
                              <QuickTemplates onSelectTemplate={handleTemplateSelect} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className={`
                            p-3 rounded-2xl text-sm
                            ${msg.type === 'user' 
                              ? 'bg-health-excellent text-white ml-2' 
                              : 'bg-health-surface text-text-primary mr-2'
                            }
                          `}>
                            {msg.content}
                          </div>
                          <p className="text-xs text-text-secondary mt-1 px-3">
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.type === 'user' ? 'order-1' : 'order-2'}`}>
                          {msg.type === 'user' ? (
                            <User className="w-4 h-4 text-health-good" />
                          ) : (
                            <Bot className="w-4 h-4 text-health-excellent" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        className="mb-4 flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="bg-health-surface p-3 rounded-2xl mr-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-health-good rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </ScrollArea>

                  {/* Quick Replies */}
                  {currentQuickReplies.length > 0 && (
                    <div className="px-4 py-2">
                      <div className="flex flex-wrap gap-2">
                        {currentQuickReplies.map((reply) => (
                          <Button
                            key={reply.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickReply(reply)}
                            className="text-xs h-8"
                          >
                            {reply.text}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-4 border-t border-health-border/20">
                    <div className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Напишите сообщение..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* History Tab - История анализов */}
                <TabsContent value="history" className="flex-1 px-4">
                  <ScrollArea className="h-full">
                    {mockAnalysisHistory.map((analysis) => (
                      <motion.div
                        key={analysis.id}
                        className="p-4 rounded-lg border border-health-border/20 mb-3 cursor-pointer hover:bg-health-surface/50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {analysis.type === 'blood' && <Beaker className="w-5 h-5 text-health-critical" />}
                            {analysis.type === 'hormones' && <Activity className="w-5 h-5 text-health-warning" />}
                            {analysis.type === 'vitamins' && <FileText className="w-5 h-5 text-health-excellent" />}
                            {analysis.type === 'urine' && <Beaker className="w-5 h-5 text-health-good" />}
                            <h4 className="font-medium">{analysis.title}</h4>
                          </div>
                          <Badge className={`text-xs ${
                            analysis.status === 'normal' ? 'bg-health-good/10 text-health-good border-health-good/20' :
                            analysis.status === 'warning' ? 'bg-health-warning/10 text-health-warning border-health-warning/20' :
                            'bg-health-critical/10 text-health-critical border-health-critical/20'
                          }`}>
                            {analysis.status === 'normal' ? 'Норма' :
                             analysis.status === 'warning' ? 'Внимание' : 'Критично'}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-text-secondary">
                          <span>{analysis.items} показателей</span>
                          <span>{formatTime(analysis.date)}</span>
                        </div>
                      </motion.div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Загрузить новые анализы
                    </Button>
                  </ScrollArea>
                </TabsContent>

                {/* Scheduled Tab */}
                <TabsContent value="scheduled" className="flex-1 px-4">
                  <ScrollArea className="h-full">
                    {mockScheduledDialogs.map((dialog) => (
                      <motion.div
                        key={dialog.id}
                        className="p-3 rounded-lg border border-health-border/20 mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{dialog.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getTypeColor(dialog.type)}`}>
                              {dialog.type}
                            </Badge>
                            <Calendar className="w-4 h-4 text-health-good" />
                          </div>
                        </div>
                        <p className="text-xs text-text-secondary mb-2">
                          {dialog.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-health-excellent">
                            {formatTime(dialog.scheduledFor)}
                          </span>
                          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                            Начать
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}