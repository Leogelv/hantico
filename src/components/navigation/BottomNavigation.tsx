import { motion } from 'framer-motion';
import { Home, MessageCircle, Heart, User, Activity } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    icon: Home,
    label: 'Главное',
    path: '/',
    color: 'text-health-good'
  },
  {
    icon: MessageCircle,
    label: 'AI Чат',
    path: '/chat',
    color: 'text-health-warning'
  },
  {
    icon: Heart,
    label: 'Здоровье',
    path: '/health',
    color: 'text-health-excellent'
  },
  {
    icon: Activity,
    label: 'Анализы',
    path: '/analytics',
    color: 'text-health-critical'
  },
  {
    icon: User,
    label: 'Профиль',
    path: '/profile',
    color: 'text-health-surface'
  }
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Скрываем на экранах онбординга
  if (location.pathname.includes('/onboarding') || location.pathname.includes('/welcome')) {
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-health-border/20"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/health' && location.pathname === '/health-map');
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.path}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`
                    flex flex-col items-center gap-1 px-3 py-2 h-auto rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'bg-health-surface text-health-excellent' 
                      : 'hover:bg-health-surface/50 text-text-secondary hover:text-health-good'
                    }
                  `}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? item.color : ''}`} />
                  </motion.div>
                  <span className="text-xs font-medium">{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 left-1/2 w-1 h-1 bg-health-excellent rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      layoutId="active-tab"
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}