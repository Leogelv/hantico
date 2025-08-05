import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calendar, Download, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface Analysis {
  id: string;
  name: string;
  date: Date;
  type: 'blood' | 'urine' | 'other';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  summary: string;
  keyFindings: string[];
  recommendations: string[];
}

const mockAnalyses: Analysis[] = [
  {
    id: '1',
    name: 'Общий анализ крови',
    date: new Date(2024, 0, 15),
    type: 'blood',
    status: 'good',
    summary: 'Показатели в норме, небольшое снижение гемоглобина',
    keyFindings: [
      'Гемоглобин: 135 г/л (норма 120-140)',
      'Лейкоциты: 6.2×10⁹/л (норма 4-9)',
      'СОЭ: 8 мм/ч (норма до 15)'
    ],
    recommendations: [
      'Увеличить потребление железосодержащих продуктов',
      'Повторить анализ через 3 месяца'
    ]
  },
  {
    id: '2',
    name: 'Биохимический анализ',
    date: new Date(2024, 0, 10),
    type: 'blood',
    status: 'warning',
    summary: 'Повышен холестерин, остальные показатели в норме',
    keyFindings: [
      'Общий холестерин: 6.2 ммоль/л (норма до 5.2)',
      'Глюкоза: 5.1 ммоль/л (норма 3.3-5.5)',
      'АЛТ: 28 Ед/л (норма до 40)'
    ],
    recommendations: [
      'Ограничить жирную пищу',
      'Увеличить физическую активность',
      'Консультация кардиолога'
    ]
  },
  {
    id: '3',
    name: 'Анализ мочи',
    date: new Date(2023, 11, 20),
    type: 'urine',
    status: 'excellent',
    summary: 'Все показатели в пределах нормы',
    keyFindings: [
      'Белок: не обнаружен',
      'Глюкоза: не обнаружена',
      'Лейкоциты: 1-2 в п/з'
    ],
    recommendations: [
      'Поддерживать текущий образ жизни'
    ]
  }
];

// Данные для графиков динамики
const hemoglobinData = [
  { date: 'Янв 23', value: 142 },
  { date: 'Мар 23', value: 138 },
  { date: 'Май 23', value: 140 },
  { date: 'Июл 23', value: 136 },
  { date: 'Сен 23', value: 134 },
  { date: 'Ноя 23', value: 137 },
  { date: 'Янв 24', value: 135 }
];

const cholesterolData = [
  { date: 'Янв 23', value: 5.8 },
  { date: 'Мар 23', value: 6.1 },
  { date: 'Май 23', value: 5.9 },
  { date: 'Июл 23', value: 6.3 },
  { date: 'Сен 23', value: 6.0 },
  { date: 'Ноя 23', value: 6.4 },
  { date: 'Янв 24', value: 6.2 }
];

export function AnalyticsScreen() {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-health-excellent/10 text-health-excellent border-health-excellent/20';
      case 'good': return 'bg-health-good/10 text-health-good border-health-good/20';
      case 'warning': return 'bg-health-warning/10 text-health-warning border-health-warning/20';
      case 'critical': return 'bg-health-critical/10 text-health-critical border-health-critical/20';
      default: return 'bg-health-surface/10 text-text-secondary border-health-border/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blood': return '🩸';
      case 'urine': return '🧪';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-health-border/20"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-text-primary">Анализы</h1>
              <p className="text-sm text-text-secondary">История и динамика показателей</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Фильтр
            </Button>
            <Button size="sm" className="bg-health-excellent">
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="p-4">
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">История</TabsTrigger>
            <TabsTrigger value="trends">Динамика</TabsTrigger>
            <TabsTrigger value="insights">Инсайты</TabsTrigger>
          </TabsList>

          {/* История анализов */}
          <TabsContent value="history" className="space-y-4">
            {mockAnalyses.map((analysis, index) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getTypeIcon(analysis.type)}</div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{analysis.name}</h3>
                        <p className="text-sm text-text-secondary">
                          {analysis.date.toLocaleDateString('ru')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(analysis.status)}>
                        {analysis.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Краткое заключение:</h4>
                      <p className="text-sm text-text-secondary">{analysis.summary}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Ключевые показатели:</h4>
                      <ul className="space-y-1">
                        {analysis.keyFindings.map((finding, idx) => (
                          <li key={idx} className="text-sm text-text-secondary flex items-center gap-2">
                            <div className="w-1 h-1 bg-health-good rounded-full" />
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Рекомендации AI:</h4>
                      <ul className="space-y-1">
                        {analysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm text-health-excellent flex items-center gap-2">
                            <div className="w-1 h-1 bg-health-excellent rounded-full" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Динамика показателей */}
          <TabsContent value="trends" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-health-excellent" />
                  Гемоглобин (г/л)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hemoglobinData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[120, 150]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-4 text-sm">
                  <span className="text-text-secondary">Норма: 120-140 г/л</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-health-warning rounded-full" />
                    <span className="text-health-warning">Тенденция к снижению</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-health-warning" />
                  Холестерин (ммоль/л)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cholesterolData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[5, 7]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#F59E0B" 
                        strokeWidth={3}
                        dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-4 text-sm">
                  <span className="text-text-secondary">Норма: до 5.2 ммоль/л</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-health-critical rounded-full" />
                    <span className="text-health-critical">Превышение нормы</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* AI Инсайты */}
          <TabsContent value="insights" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 bg-gradient-to-br from-health-excellent/10 to-health-good/10">
                <h3 className="font-semibold mb-4">🤖 AI Анализ за последний год</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium text-health-warning mb-2">⚠️ Требует внимания</h4>
                    <p className="text-sm text-text-secondary mb-2">
                      Уровень холестерина стабильно превышает норму последние 6 месяцев
                    </p>
                    <div className="text-xs text-health-excellent">
                      Рекомендация: консультация кардиолога и корректировка питания
                    </div>
                  </div>

                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium text-health-good mb-2">✅ Положительная динамика</h4>
                    <p className="text-sm text-text-secondary mb-2">
                      Показатели функции почек стабильно в норме
                    </p>
                    <div className="text-xs text-health-excellent">
                      Рекомендация: продолжать текущий образ жизни
                    </div>
                  </div>

                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium text-health-warning mb-2">📈 Тренд к мониторингу</h4>
                    <p className="text-sm text-text-secondary mb-2">
                      Гемоглобин показывает медленное снижение
                    </p>
                    <div className="text-xs text-health-excellent">
                      Рекомендация: обследование на дефицит железа
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-health-surface/30 rounded-lg">
                  <h4 className="font-medium mb-2">🎯 Персональный план</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-health-excellent rounded" />
                      <span>Повторить липидограмму через 2 месяца</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-health-border rounded" />
                      <span>Анализ на ферритин и трансферрин</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-health-border rounded" />
                      <span>Консультация диетолога</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}