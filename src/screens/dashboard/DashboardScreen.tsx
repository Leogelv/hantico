import { motion } from 'framer-motion';
import { HealthAvatar3D } from '@/components/3d/HealthAvatar3D';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, Activity, TrendingUp, Calendar, Flame, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/lib/store/useUserStore';
import { useHealthStore } from '@/lib/store/useHealthStore';
import { mockBloodTests, mockDailyTasks, mockHealthScore } from '@/lib/mockData';
import { useEffect } from 'react';

export function DashboardScreen() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { analyses } = useHealthStore();

  const healthScore = mockHealthScore;
  const completedTasks = mockDailyTasks.filter(task => task.completed).length;
  const totalTasks = mockDailyTasks.length;
  const dailyProgress = (completedTasks / totalTasks) * 100;

  useEffect(() => {
    // Загружаем Spline viewer скрипт
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.38/build/spline-viewer.js';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-surface/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-4">
              <h1 className="text-xl sm:text-2xl font-bold truncate">
                Добро пожаловать, {user?.name || 'Пользователь'}!
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base hidden sm:block">
                {new Date().toLocaleDateString('ru-RU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-muted-foreground text-sm sm:hidden">
                {new Date().toLocaleDateString('ru-RU', { 
                  day: 'numeric',
                  month: 'short'
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Settings className="w-4 h-4" />
              </Button>
              <Badge variant="outline" className="gap-1 text-xs sm:text-sm">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="hidden sm:inline">дней</span>
                {user?.streak || 0}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Health Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${getScoreGradient(healthScore)} opacity-10`} />
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">Ваш индекс здоровья</CardTitle>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="relative"
              >
                <div className="w-32 h-32 mx-auto relative">
                  {/* Background circle */}
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/20"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className={getScoreColor(healthScore)}
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - healthScore / 100) }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${getScoreColor(healthScore)}`}>
                      {healthScore}
                    </span>
                  </div>
                </div>
              </motion.div>
              <p className="text-muted-foreground mt-4">
                {healthScore >= 80 ? 'Отличные показатели!' : 
                 healthScore >= 60 ? 'Хорошие результаты' : 
                 'Есть что улучшить'}
              </p>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 3D Avatar Section with Spline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-[400px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  3D Модель здоровья
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[320px] p-0">
                <div className="h-full w-full bg-surface rounded-b-lg relative overflow-hidden">
                  <spline-viewer 
                    url="https://prod.spline.design/GpwHEUeTGYXiyPe5/scene.splinecode"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Latest Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Последние анализы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockBloodTests.slice(0, 3).map((test) => (
                  <div key={test.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm sm:text-base truncate">{test.name}</span>
                      <Badge variant={
                        test.status === 'normal' ? 'default' :
                        test.status === 'low' ? 'destructive' :
                        'secondary'
                      } className="text-xs flex-shrink-0">
                        {test.status === 'normal' ? 'Норма' :
                         test.status === 'low' ? 'Низкий' : 'Высокий'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                      <span>{test.value} {test.unit}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">Норма: {test.refMin}-{test.refMax}</span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-muted-foreground/30"
                        style={{ 
                          left: `${(test.refMin / (test.refMax * 1.2)) * 100}%`,
                          width: `${((test.refMax - test.refMin) / (test.refMax * 1.2)) * 100}%`
                        }}
                      />
                      <div 
                        className={`absolute top-0 w-1 h-full ${
                          test.status === 'normal' ? 'bg-green-500' :
                          test.status === 'low' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                        style={{ 
                          left: `${(test.value / (test.refMax * 1.2)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button className="w-full mt-4" variant="outline">
                  <Brain className="w-4 h-4 mr-2" />
                  AI рекомендации
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Daily Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  План на сегодня
                </CardTitle>
                <Badge variant="secondary">
                  {completedTasks}/{totalTasks}
                </Badge>
              </div>
              <Progress value={dailyProgress} className="mt-2" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {mockDailyTasks.slice(0, 4).map((task) => (
                <motion.div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface/30 border"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                    task.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-muted-foreground'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${task.completed ? 'line-through opacity-60' : ''}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{task.time}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="text-center">
            <CardContent className="pt-4 sm:pt-6">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-red-500" />
              <p className="text-xl sm:text-2xl font-bold">72</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Пульс</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-4 sm:pt-6">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-xl sm:text-2xl font-bold">8,234</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Шаги</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-4 sm:pt-6">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-500" />
              <p className="text-xl sm:text-2xl font-bold">+12%</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Улучшение</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-4 sm:pt-6">
              <Flame className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-xl sm:text-2xl font-bold">{user?.streak || 0}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Дней подряд</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Button 
            variant="outline" 
            className="h-auto p-4 sm:p-6 flex flex-col gap-2"
            onClick={() => navigate('/onboarding/chat')}
          >
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <span className="font-medium text-sm sm:text-base">Поговорить с AI</span>
            <span className="text-xs sm:text-sm text-muted-foreground text-center">Задать вопрос о здоровье</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto p-4 sm:p-6 flex flex-col gap-2"
            onClick={() => navigate('/onboarding/upload')}
          >
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <span className="font-medium text-sm sm:text-base">Загрузить анализы</span>
            <span className="text-xs sm:text-sm text-muted-foreground text-center">Добавить новые данные</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto p-4 sm:p-6 flex flex-col gap-2"
            onClick={() => navigate('/health-graph')}
          >
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <span className="font-medium text-sm sm:text-base">Граф здоровья</span>
            <span className="text-xs sm:text-sm text-muted-foreground text-center">Анализ связей</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}