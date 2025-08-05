import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Shield,
  Target,
  Zap,
  Heart,
  Brain,
  Activity,
  ChevronRight,
  Download,
  Share2,
  UserCheck,
  Calendar,
  Pill,
  Apple,
  Dumbbell
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { getAnalysisResults } from '@/lib/api/analysisApi';

// Интерфейсы для типизации
interface Metric {
  name: string;
  value: number;
  unit: string;
  ref_min: number;
  ref_max: number;
  status: 'normal' | 'low' | 'high' | 'critical';
  interpretation: string;
  category: string;
  priority: number;
}

interface Insight {
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  related_metrics: string[];
  recommendations: string[];
}

interface PlanItem {
  action: string;
  reason: string;
  timeline: 'immediate' | 'this_week' | 'this_month';
  category: 'lifestyle' | 'nutrition' | 'supplements' | 'medical';
}

interface AnalysisData {
  response: string;
  analysis: {
    document_type: string;
    date: string;
    lab_name?: string;
    metrics: Metric[];
    insights: Insight[];
    health_score: number;
  };
  plan: PlanItem[];
}

// Моковые данные для демо
const mockAnalysisData: AnalysisData = {
  response: "Ваши анализы показывают хорошее общее состояние здоровья с некоторыми областями для улучшения. Обнаружен дефицит витамина D и слегка повышенный холестерин, что типично для зимнего периода.",
  analysis: {
    document_type: "blood_test",
    date: "2024-01-15",
    lab_name: "Инвитро",
    health_score: 78,
    metrics: [
      {
        name: "Витамин D",
        value: 18,
        unit: "нг/мл",
        ref_min: 30,
        ref_max: 100,
        status: "low",
        interpretation: "Недостаточный уровень витамина D может влиять на иммунитет и настроение",
        category: "Витамины",
        priority: 4
      },
      {
        name: "Холестерин общий",
        value: 5.8,
        unit: "ммоль/л",
        ref_min: 3.5,
        ref_max: 5.2,
        status: "high",
        interpretation: "Слегка повышен, рекомендуется коррекция питания",
        category: "Липидный профиль",
        priority: 3
      },
      {
        name: "Гемоглобин",
        value: 145,
        unit: "г/л",
        ref_min: 130,
        ref_max: 160,
        status: "normal",
        interpretation: "Отличный показатель, кислород хорошо переносится",
        category: "Кровь",
        priority: 1
      },
      {
        name: "Глюкоза",
        value: 4.8,
        unit: "ммоль/л",
        ref_min: 3.9,
        ref_max: 5.6,
        status: "normal",
        interpretation: "Уровень сахара в норме",
        category: "Углеводный обмен",
        priority: 1
      },
      {
        name: "ТТГ",
        value: 2.1,
        unit: "мМЕ/л",
        ref_min: 0.4,
        ref_max: 4.0,
        status: "normal",
        interpretation: "Щитовидная железа работает нормально",
        category: "Гормоны",
        priority: 2
      }
    ],
    insights: [
      {
        type: "warning",
        title: "Дефицит витамина D",
        description: "Уровень витамина D ниже оптимального, что может влиять на иммунитет, настроение и усвоение кальция",
        related_metrics: ["Витамин D"],
        recommendations: [
          "Принимать витамин D3 2000-4000 МЕ ежедневно",
          "Увеличить потребление жирной рыбы",
          "Больше времени проводить на солнце"
        ]
      },
      {
        type: "info",
        title: "Липидный профиль требует внимания",
        description: "Холестерин слегка повышен, но это легко корректируется изменением питания",
        related_metrics: ["Холестерин общий"],
        recommendations: [
          "Снизить потребление насыщенных жиров",
          "Добавить омега-3 жирные кислоты",
          "Увеличить физическую активность"
        ]
      },
      {
        type: "success",
        title: "Отличные показатели крови",
        description: "Гемоглобин и другие показатели крови в идеальном состоянии",
        related_metrics: ["Гемоглобин"],
        recommendations: [
          "Поддерживать текущий уровень активности",
          "Продолжать сбалансированное питание"
        ]
      }
    ]
  },
  plan: [
    {
      action: "Начать прием витамина D3",
      reason: "Восполнить дефицит и улучшить иммунитет",
      timeline: "immediate",
      category: "supplements"
    },
    {
      action: "Скорректировать питание",
      reason: "Снизить уровень холестерина",
      timeline: "this_week",
      category: "nutrition"
    },
    {
      action: "Добавить кардио нагрузки",
      reason: "Улучшить липидный профиль",
      timeline: "this_week",
      category: "lifestyle"
    },
    {
      action: "Повторный анализ через 3 месяца",
      reason: "Контроль эффективности изменений",
      timeline: "this_month",
      category: "medical"
    }
  ]
};

// Данные для радарной диаграммы
const getRadarData = (metrics: Metric[]) => {
  const categories = [...new Set(metrics.map(m => m.category))];
  return categories.map(cat => {
    const categoryMetrics = metrics.filter(m => m.category === cat);
    const avgScore = categoryMetrics.reduce((acc, m) => {
      if (m.status === 'normal') return acc + 100;
      if (m.status === 'low' || m.status === 'high') return acc + 50;
      return acc + 20;
    }, 0) / categoryMetrics.length;
    
    return {
      category: cat,
      score: avgScore,
      fullMark: 100
    };
  });
};

export function AnalysisResultScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorReviewStatus, setDoctorReviewStatus] = useState<'pending' | 'reviewing' | 'approved'>('pending');

  useEffect(() => {
    // Получаем сохраненные результаты анализа
    const savedResults = getAnalysisResults();
    
    if (savedResults) {
      setAnalysisData(savedResults);
      setIsLoading(false);
    } else {
      // Используем моковые данные если нет сохраненных
      setTimeout(() => {
        setAnalysisData(mockAnalysisData);
        setIsLoading(false);
      }, 1500);
    }

    // Симуляция изменения статуса проверки врачом
    setTimeout(() => {
      setDoctorReviewStatus('reviewing');
    }, 5000);
    
    setTimeout(() => {
      setDoctorReviewStatus('approved');
    }, 15000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-health-excellent bg-health-excellent/10 border-health-excellent/20';
      case 'low': return 'text-health-warning bg-health-warning/10 border-health-warning/20';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-health-critical bg-health-critical/10 border-health-critical/20';
      default: return '';
    }
  };

  const getTimelineIcon = (timeline: string) => {
    switch (timeline) {
      case 'immediate': return <Zap className="w-4 h-4" />;
      case 'this_week': return <Calendar className="w-4 h-4" />;
      case 'this_month': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'supplements': return <Pill className="w-4 h-4" />;
      case 'nutrition': return <Apple className="w-4 h-4" />;
      case 'lifestyle': return <Dumbbell className="w-4 h-4" />;
      case 'medical': return <Activity className="w-4 h-4" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          <p className="text-lg font-medium">Обрабатываем результаты...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-health-surface/20 pb-24">
      {/* Шапка с общим статусом */}
      <motion.div
        className="bg-gradient-to-r from-health-excellent to-health-good text-white p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Результаты анализа</h1>
              <p className="text-white/80">
                {analysisData.analysis.date} • {analysisData.analysis.lab_name}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {analysisData.analysis.health_score}/100
              </div>
              <p className="text-white/80">Индекс здоровья</p>
            </div>
          </div>

          {/* Статус проверки врачом */}
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  doctorReviewStatus === 'approved' ? 'bg-green-500' :
                  doctorReviewStatus === 'reviewing' ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`}>
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">
                    {doctorReviewStatus === 'approved' ? 'План одобрен врачом' :
                     doctorReviewStatus === 'reviewing' ? 'Врач проверяет результаты' :
                     'Ожидает проверки врача'}
                  </p>
                  <p className="text-sm text-white/70">
                    {doctorReviewStatus === 'approved' ? 'Можно приступать к выполнению' :
                     doctorReviewStatus === 'reviewing' ? 'Обычно занимает 15-30 минут' :
                     'В очереди на проверку'}
                  </p>
                </div>
              </div>
              {doctorReviewStatus === 'reviewing' && (
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Основной контент */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* AI резюме */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-6 bg-gradient-to-br from-health-surface/50 to-health-excellent/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-health-excellent to-health-good flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI анализ</h3>
                <p className="text-text-secondary leading-relaxed">
                  {analysisData.response}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Табы с детальной информацией */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="metrics">Показатели</TabsTrigger>
            <TabsTrigger value="insights">Инсайты</TabsTrigger>
            <TabsTrigger value="plan">План</TabsTrigger>
          </TabsList>

          {/* Обзор */}
          <TabsContent value="overview" className="space-y-6">
            {/* Радарная диаграмма по категориям */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Профиль здоровья</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={getRadarData(analysisData.analysis.metrics)}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="category" stroke="#6B7280" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6B7280" />
                  <Radar 
                    name="Показатели" 
                    dataKey="score" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Ключевые метрики */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysisData.analysis.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 h-full">
                    <div className="flex items-center gap-2 mb-3">
                      {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-health-warning" />}
                      {insight.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                      {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-health-excellent" />}
                      <h4 className="font-medium">{insight.title}</h4>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">
                      {insight.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {insight.related_metrics.map((metric, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Показатели */}
          <TabsContent value="metrics" className="space-y-4">
            {analysisData.analysis.metrics
              .sort((a, b) => b.priority - a.priority)
              .map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{metric.name}</h4>
                        <Badge className={getStatusColor(metric.status)}>
                          {metric.status === 'normal' ? 'Норма' :
                           metric.status === 'low' ? 'Понижен' :
                           metric.status === 'high' ? 'Повышен' : 'Критично'}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {metric.value} {metric.unit}
                        </div>
                        <div className="text-xs text-text-secondary">
                          Норма: {metric.ref_min}-{metric.ref_max}
                        </div>
                      </div>
                    </div>
                    
                    {/* Визуализация диапазона */}
                    <div className="relative h-8 bg-health-surface rounded-full mb-3 overflow-hidden">
                      <div 
                        className="absolute top-0 bottom-0 bg-health-excellent/30"
                        style={{
                          left: '30%',
                          width: '40%'
                        }}
                      />
                      <div 
                        className={`absolute top-0 bottom-0 w-1 ${
                          metric.status === 'normal' ? 'bg-health-excellent' :
                          metric.status === 'low' || metric.status === 'high' ? 'bg-health-warning' :
                          'bg-health-critical'
                        }`}
                        style={{
                          left: `${Math.min(100, Math.max(0, 
                            ((metric.value - metric.ref_min * 0.5) / (metric.ref_max * 1.5 - metric.ref_min * 0.5)) * 100
                          ))}%`
                        }}
                      />
                    </div>
                    
                    <p className="text-sm text-text-secondary">
                      {metric.interpretation}
                    </p>
                  </Card>
                </motion.div>
              ))}
          </TabsContent>

          {/* Инсайты */}
          <TabsContent value="insights" className="space-y-4">
            {analysisData.analysis.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      insight.type === 'warning' ? 'bg-health-warning/10' :
                      insight.type === 'info' ? 'bg-blue-100' :
                      'bg-health-excellent/10'
                    }`}>
                      {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-health-warning" />}
                      {insight.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                      {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-health-excellent" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{insight.title}</h4>
                      <p className="text-text-secondary mb-4">{insight.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-2">Рекомендации:</p>
                          <ul className="space-y-1">
                            {insight.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                                <CheckCircle className="w-4 h-4 text-health-good mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 pt-2">
                          {insight.related_metrics.map((metric, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* План действий */}
          <TabsContent value="plan" className="space-y-4">
            <Card className="p-6 mb-4 bg-gradient-to-br from-health-surface/50 to-health-excellent/10">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-health-excellent" />
                <h3 className="text-lg font-semibold">Персональный план восстановления</h3>
              </div>
              <p className="text-text-secondary">
                План составлен AI на основе ваших анализов и будет проверен врачом
              </p>
            </Card>
            
            {/* Группировка по таймлайну */}
            {['immediate', 'this_week', 'this_month'].map((timeline) => {
              const timelinePlans = analysisData.plan.filter(p => p.timeline === timeline);
              if (timelinePlans.length === 0) return null;
              
              return (
                <div key={timeline} className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    {getTimelineIcon(timeline)}
                    <h4 className="font-medium">
                      {timeline === 'immediate' ? 'Начать сразу' :
                       timeline === 'this_week' ? 'На этой неделе' :
                       'В течение месяца'}
                    </h4>
                  </div>
                  
                  {timelinePlans.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            item.category === 'supplements' ? 'bg-purple-100' :
                            item.category === 'nutrition' ? 'bg-green-100' :
                            item.category === 'lifestyle' ? 'bg-blue-100' :
                            'bg-orange-100'
                          }`}>
                            {getCategoryIcon(item.category)}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium mb-1">{item.action}</h5>
                            <p className="text-sm text-text-secondary">{item.reason}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-text-secondary" />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Действия */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex flex-col gap-4"
        >
          <Button 
            size="lg" 
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Перейти к дашборду
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="flex-1">
              <Download className="w-5 h-5 mr-2" />
              Скачать отчет
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              <Share2 className="w-5 h-5 mr-2" />
              Поделиться
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}