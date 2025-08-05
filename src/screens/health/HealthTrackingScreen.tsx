import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Pill, 
  TrendingUp, 
  Target, 
  Award, 
  CheckCircle2, 
  X,
  Plus,
  Flame,
  Clock,
  Activity,
  BarChart3,
  ChevronRight,
  Info,
  Bell,
  Map
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { HealthMapFlow } from '@/components/health/HealthMapFlow';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

// Моковые данные для графиков
const progressData = [
  { day: 'Пн', energy: 6, mood: 7, sleep: 5 },
  { day: 'Вт', energy: 7, mood: 8, sleep: 6 },
  { day: 'Ср', energy: 7, mood: 7, sleep: 7 },
  { day: 'Чт', energy: 8, mood: 9, sleep: 8 },
  { day: 'Пт', energy: 9, mood: 9, sleep: 7 },
  { day: 'Сб', energy: 8, mood: 8, sleep: 9 },
  { day: 'Вс', energy: 9, mood: 9, sleep: 8 }
];

const medicationSchedule = [
  {
    id: '1',
    name: 'Витамин D3',
    dosage: '2000 МЕ',
    time: '09:00',
    frequency: 'Ежедневно',
    taken: true,
    streak: 14,
    icon: '☀️'
  },
  {
    id: '2',
    name: 'Магний B6',
    dosage: '400 мг',
    time: '21:00',
    frequency: 'Ежедневно',
    taken: false,
    streak: 7,
    icon: '💊'
  },
  {
    id: '3',
    name: 'Омега-3',
    dosage: '1000 мг',
    time: '13:00',
    frequency: 'Ежедневно',
    taken: true,
    streak: 21,
    icon: '🐟'
  }
];

const healthGoals = [
  {
    id: '1',
    title: 'Сон 8 часов',
    progress: 75,
    current: 6,
    target: 8,
    unit: 'часов',
    icon: '😴',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: '2',
    title: '10 000 шагов',
    progress: 84,
    current: 8432,
    target: 10000,
    unit: 'шагов',
    icon: '🚶',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: '3',
    title: 'Вода 2л',
    progress: 60,
    current: 1.2,
    target: 2,
    unit: 'литра',
    icon: '💧',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: '4',
    title: 'Медитация',
    progress: 100,
    current: 15,
    target: 15,
    unit: 'минут',
    icon: '🧘',
    color: 'from-purple-500 to-pink-500'
  }
];

const weeklyActivity = [
  { name: 'Пн', completed: true },
  { name: 'Вт', completed: true },
  { name: 'Ср', completed: true },
  { name: 'Чт', completed: true },
  { name: 'Пт', completed: false },
  { name: 'Сб', completed: false },
  { name: 'Вс', completed: false }
];

export function HealthTrackingScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);

  const handleMedicationTaken = (id: string) => {
    // Здесь будет логика отметки приема лекарства
    console.log('Medication taken:', id);
  };

  const totalStreak = 14; // Общий страйк дней

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-health-surface/20 pb-24">
      {/* Шапка с общим прогрессом */}
      <motion.div
        className="bg-gradient-to-r from-health-excellent to-health-good text-white p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Мое здоровье</h1>
            <Button variant="secondary" size="sm" onClick={() => navigate('/health-map')}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Карта
            </Button>
          </div>
          
          {/* Страйк и достижения */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-white/20 backdrop-blur-sm border-white/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalStreak}</div>
                  <div className="text-sm text-white/80">дней подряд</div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/20 backdrop-blur-sm border-white/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                  <Target className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">4/5</div>
                  <div className="text-sm text-white/80">целей сегодня</div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/20 backdrop-blur-sm border-white/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-white/80">достижений</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Табы */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="map">Карта</TabsTrigger>
            <TabsTrigger value="medications">Лекарства</TabsTrigger>
            <TabsTrigger value="progress">Прогресс</TabsTrigger>
            <TabsTrigger value="goals">Цели</TabsTrigger>
          </TabsList>

          {/* Обзор */}
          <TabsContent value="overview" className="space-y-6">
            {/* Календарь активности */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Активность за неделю</h3>
                  <Badge variant="outline" className="text-health-excellent">
                    Отличная неделя!
                  </Badge>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {weeklyActivity.map((day, index) => (
                    <motion.div
                      key={day.name}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="text-center"
                    >
                      <div className="text-sm text-text-secondary mb-2">{day.name}</div>
                      <div className={`
                        w-12 h-12 rounded-full mx-auto flex items-center justify-center
                        ${day.completed 
                          ? 'bg-gradient-to-br from-health-excellent to-health-good' 
                          : 'bg-health-surface border-2 border-dashed border-health-border'
                        }
                      `}>
                        {day.completed && <CheckCircle2 className="w-6 h-6 text-white" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* График настроения и энергии */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Динамика самочувствия</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="day" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="#10B981" 
                      fillOpacity={1} 
                      fill="url(#colorEnergy)" 
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#6366F1" 
                      fillOpacity={1} 
                      fill="url(#colorMood)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-health-excellent" />
                    <span className="text-sm text-text-secondary">Энергия</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="text-sm text-text-secondary">Настроение</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Быстрые действия */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4">Быстрые действия</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card 
                  className="p-4 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setActiveTab('medications')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-health-excellent/10 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-health-excellent" />
                    </div>
                    <div>
                      <p className="font-medium">Принять лекарства</p>
                      <p className="text-sm text-text-secondary">2 из 3 сегодня</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-secondary ml-auto" />
                  </div>
                </Card>
                
                <Card 
                  className="p-4 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => navigate('/analytics')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-health-good/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-health-good" />
                    </div>
                    <div>
                      <p className="font-medium">Добавить замеры</p>
                      <p className="text-sm text-text-secondary">Пульс, давление</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-secondary ml-auto" />
                  </div>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Карта здоровья */}
          <TabsContent value="map" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Map className="w-5 h-5 text-health-excellent" />
                    <h3 className="text-lg font-semibold">Интерактивная карта здоровья</h3>
                  </div>
                  <Badge variant="outline" className="text-health-excellent">
                    Индекс: 8.4/10
                  </Badge>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  Визуализация связей между различными показателями вашего здоровья
                </p>
                <div className="h-[70vh] rounded-lg overflow-hidden">
                  <HealthMapFlow />
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Лекарства */}
          <TabsContent value="medications" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">График приема</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </div>
            
            {medicationSchedule.map((med, index) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-4 ${med.taken ? 'bg-health-surface/50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{med.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{med.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {med.dosage}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-text-secondary flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {med.time}
                          </span>
                          <span className="text-sm text-text-secondary">
                            {med.frequency}
                          </span>
                          {med.streak > 0 && (
                            <Badge className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                              <Flame className="w-3 h-3 mr-1" />
                              {med.streak} дней
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {med.taken ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-health-excellent border-health-excellent"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Принято
                        </Button>
                      ) : (
                        <>
                          <Button 
                            size="sm"
                            onClick={() => handleMedicationTaken(med.id)}
                          >
                            Принять
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {}}
                          >
                            <Bell className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            
            {/* Статистика приема */}
            <Card className="p-6 mt-6 bg-gradient-to-br from-health-surface/50 to-health-excellent/10">
              <h4 className="font-semibold mb-4">Статистика за месяц</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-health-excellent">94%</div>
                  <div className="text-sm text-text-secondary">Выполнение</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-health-good">28</div>
                  <div className="text-sm text-text-secondary">Дней подряд</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-health-warning">2</div>
                  <div className="text-sm text-text-secondary">Пропущено</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Прогресс */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Прогресс по рекомендациям</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="sleep" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="energy" fill="#10B981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="mood" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            
            {/* Детальная статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Сон</h4>
                  <Info className="w-4 h-4 text-text-secondary" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">7.2ч</div>
                <Progress value={72} className="mb-2" />
                <p className="text-sm text-text-secondary">Среднее за неделю</p>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Активность</h4>
                  <Info className="w-4 h-4 text-text-secondary" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                <Progress value={85} className="mb-2" />
                <p className="text-sm text-text-secondary">Выполнение целей</p>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Питание</h4>
                  <Info className="w-4 h-4 text-text-secondary" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">2100</div>
                <Progress value={90} className="mb-2" />
                <p className="text-sm text-text-secondary">Калорий в день</p>
              </Card>
            </div>
          </TabsContent>

          {/* Цели */}
          <TabsContent value="goals" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Ежедневные цели</h3>
              <Button size="sm" variant="outline">
                Настроить
              </Button>
            </div>
            
            {healthGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{goal.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{goal.title}</h4>
                        <span className="text-sm font-medium">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress value={goal.progress} className="h-3" />
                        <div 
                          className={`absolute inset-0 h-3 rounded-full bg-gradient-to-r ${goal.color} opacity-20`} 
                        />
                      </div>
                    </div>
                    {goal.progress >= 100 && (
                      <CheckCircle2 className="w-6 h-6 text-health-excellent" />
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
            
            {/* Мотивационный блок */}
            <Card className="p-6 bg-gradient-to-br from-health-excellent/10 to-health-good/10 border-health-excellent/20">
              <div className="text-center">
                <Award className="w-12 h-12 text-health-excellent mx-auto mb-3" />
                <h4 className="font-semibold text-lg mb-2">Отличная работа!</h4>
                <p className="text-text-secondary">
                  Вы выполнили 80% целей на этой неделе. Продолжайте в том же духе!
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}