import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Heart, 
  Activity, 
  Calendar,
  Download,
  Share2,
  Edit3,
  LogOut,
  ChevronRight,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/lib/store/useUserStore';
import { useHealthStore } from '@/lib/store/useHealthStore';

export function ProfileScreen() {
  const { user } = useUserStore();
  const { healthScore } = useHealthStore();
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const achievements = [
    {
      id: '1',
      title: 'Первые шаги',
      description: 'Завершили онбординг',
      icon: Trophy,
      color: 'text-health-excellent',
      completed: true,
      progress: 100
    },
    {
      id: '2',
      title: 'Постоянство',
      description: '7 дней подряд в приложении',
      icon: Target,
      color: 'text-health-good',
      completed: user?.streak >= 7,
      progress: Math.min((user?.streak || 0) / 7 * 100, 100)
    },
    {
      id: '3',
      title: 'Аналитик',
      description: 'Загрузили 5 анализов',
      icon: Activity,
      color: 'text-health-warning',
      completed: false,
      progress: 60
    },
    {
      id: '4',
      title: 'Эксперт здоровья',
      description: 'Индекс здоровья выше 8.0',
      icon: Zap,
      color: 'text-health-excellent',
      completed: healthScore >= 8.0,
      progress: Math.min(healthScore / 8.0 * 100, 100)
    }
  ];

  const healthSummary = {
    totalAnalyses: 12,
    lastCheckup: '15 янв 2024',
    nextReminder: '15 фев 2024',
    improvementTrend: '+12%'
  };

  const menuItems = [
    {
      section: 'Здоровье',
      items: [
        { icon: Heart, label: 'Мои цели', description: 'Управление целями здоровья', href: '/goals' },
        { icon: Activity, label: 'История анализов', description: 'Все загруженные анализы', href: '/analytics' },
        { icon: Calendar, label: 'Напоминания', description: 'Расписание обследований', href: '/reminders' },
      ]
    },
    {
      section: 'Приложение',
      items: [
        { icon: Bell, label: 'Уведомления', description: 'Настройка уведомлений', component: 'notifications' },
        { icon: Shield, label: 'Приватность', description: 'Управление данными', component: 'privacy' },
        { icon: Download, label: 'Экспорт данных', description: 'Скачать все данные', href: '/export' },
        { icon: Share2, label: 'Поделиться', description: 'Рассказать о приложении', component: 'share' },
      ]
    },
    {
      section: 'Аккаунт',
      items: [
        { icon: Edit3, label: 'Редактировать профиль', description: 'Изменить личные данные', href: '/edit-profile' },
        { icon: Settings, label: 'Настройки', description: 'Общие настройки', href: '/settings' },
        { icon: LogOut, label: 'Выйти', description: 'Выход из аккаунта', component: 'logout' },
      ]
    }
  ];

  const handleMenuClick = (item: any) => {
    switch (item.component) {
      case 'notifications':
        setNotifications(!notifications);
        break;
      case 'privacy':
        setDataSharing(!dataSharing);
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'Проверьте это приложение для здоровья!',
            text: 'Отличное приложение для мониторинга здоровья с AI',
            url: window.location.origin
          });
        }
        break;
      case 'logout':
        // Здесь логика выхода
        console.log('Logout');
        break;
      default:
        console.log(`Navigate to ${item.href}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-br from-health-surface/30 to-background p-6 rounded-b-3xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Profile Info */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6">
          <Avatar className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-gradient-to-br from-health-excellent to-health-good text-white text-xl sm:text-2xl font-bold">
              {user?.name?.charAt(0) || 'П'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary truncate">{user?.name || 'Пользователь'}</h1>
            <p className="text-text-secondary text-sm sm:text-base truncate">{user?.email || 'user@example.com'}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className="bg-health-good/10 text-health-good border-health-good/20 text-xs">
                {user?.streak || 0} дней подряд
              </Badge>
              <Badge className="bg-health-excellent/10 text-health-excellent border-health-excellent/20 text-xs">
                Индекс: {healthScore}/10
              </Badge>
            </div>
          </div>
        </div>

        {/* Health Summary */}
        <Card className="p-3 sm:p-4 bg-gradient-to-br from-health-excellent/10 to-health-good/10 border-health-excellent/20">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-health-excellent">{healthSummary.totalAnalyses}</div>
              <div className="text-xs text-text-secondary">Анализов</div>
            </div>
            <div>
              <div className="text-lg font-bold text-health-good">{healthSummary.improvementTrend}</div>
              <div className="text-xs text-text-secondary">Улучшение</div>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="text-center space-y-1">
            <div className="text-xs sm:text-sm text-text-secondary">Последний чекап: {healthSummary.lastCheckup}</div>
            <div className="text-xs sm:text-sm text-health-warning">Следующий: {healthSummary.nextReminder}</div>
          </div>
        </Card>
      </motion.div>

      <div className="p-6 space-y-6">
        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold mb-4">Достижения</h2>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className={`p-3 sm:p-4 ${achievement.completed ? 'bg-health-surface/30 border-health-excellent/20' : ''}`}>
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${achievement.color} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-xs sm:text-sm text-text-primary truncate">{achievement.title}</h3>
                        <p className="text-xs text-text-secondary truncate">{achievement.description}</p>
                      </div>
                    </div>
                    <Progress value={achievement.progress} className="h-1" />
                    <div className="text-xs text-right mt-1 text-text-secondary">
                      {Math.round(achievement.progress)}%
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Menu Sections */}
        {menuItems.map((section, sectionIndex) => (
          <motion.div
            key={section.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + sectionIndex * 0.1 }}
          >
            <h3 className="text-md font-semibold mb-3 text-text-primary">{section.section}</h3>
            <Card className="overflow-hidden">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.label}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 sm:p-4 rounded-none"
                      onClick={() => handleMenuClick(item)}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 w-full">
                        <Icon className="w-5 h-5 text-health-excellent flex-shrink-0" />
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-medium text-sm sm:text-base text-text-primary truncate">{item.label}</div>
                          <div className="text-xs sm:text-sm text-text-secondary truncate">{item.description}</div>
                        </div>
                        {item.component === 'notifications' && (
                          <Switch checked={notifications} className="flex-shrink-0" />
                        )}
                        {item.component === 'privacy' && (
                          <Switch checked={dataSharing} className="flex-shrink-0" />
                        )}
                        {!item.component?.includes('Switch') && (
                          <ChevronRight className="w-4 h-4 text-text-secondary flex-shrink-0" />
                        )}
                      </div>
                    </Button>
                    {index < section.items.length - 1 && <Separator />}
                  </div>
                );
              })}
            </Card>
          </motion.div>
        ))}

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-4 text-center">
            <h3 className="font-semibold text-health-excellent mb-2">Персональный ассистент здоровья</h3>
            <p className="text-sm text-text-secondary mb-2">Версия 1.0.0</p>
            <p className="text-xs text-text-secondary">
              Управляйте здоровьем с помощью AI и данных
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}