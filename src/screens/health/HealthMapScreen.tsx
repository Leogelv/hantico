import { motion } from 'framer-motion';
import { ArrowLeft, Info, Settings, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HealthMapFlow } from '@/components/health/HealthMapFlow';
import { useNavigate } from 'react-router-dom';

export function HealthMapScreen() {
  const navigate = useNavigate();

  const insights = [
    {
      title: 'Сердечный ритм стабилен',
      description: 'Ваш пульс в норме последние 7 дней',
      status: 'good',
      action: 'Поддерживайте активность'
    },
    {
      title: 'Улучшение сна',
      description: 'Качество сна выросло на 15%',
      status: 'excellent',
      action: 'Продолжайте соблюдать режим'
    },
    {
      title: 'Нужно больше активности',
      description: 'Цель 10k шагов не достигнута 3 дня',
      status: 'warning',
      action: 'Запланируйте прогулку'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-health-excellent/10 text-health-excellent border-health-excellent/20';
      case 'good': return 'bg-health-good/10 text-health-good border-health-good/20';
      case 'warning': return 'bg-health-warning/10 text-health-warning border-health-warning/20';
      case 'critical': return 'bg-health-critical/10 text-health-critical border-health-critical/20';
      default: return 'bg-health-surface/10 text-text-secondary border-health-border/20';
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Карта здоровья</h1>
              <p className="text-sm text-text-secondary">Визуализация вашего состояния</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="p-4 space-y-6">
        {/* Health Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Интерактивная карта</h2>
              <Button variant="outline" size="sm">
                <Info className="w-4 h-4 mr-2" />
                Справка
              </Button>
            </div>
            <div className="h-[70vh] rounded-lg overflow-hidden">
              <HealthMapFlow />
            </div>
          </Card>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4">Аналитика и рекомендации</h2>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-text-primary">{insight.title}</h3>
                        <Badge className={`text-xs ${getStatusColor(insight.status)}`}>
                          {insight.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">{insight.description}</p>
                      <p className="text-sm font-medium text-health-excellent">{insight.action}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Health Score Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-health-surface/30 to-health-excellent/10">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-health-excellent mb-2">8.4 / 10</h3>
              <p className="text-text-secondary mb-4">Общий индекс здоровья</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-health-good">Сильные стороны</div>
                  <div className="text-text-secondary">Сон, Питание, Активность</div>
                </div>
                <div>
                  <div className="font-medium text-health-warning">Для улучшения</div>
                  <div className="text-text-secondary">Стресс, Гидратация</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}