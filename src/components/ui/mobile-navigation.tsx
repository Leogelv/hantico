import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Settings, User, HelpCircle, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileNavigation({ isOpen, onToggle }: MobileNavigationProps) {
  const navigationItems = [
    { icon: MessageCircle, label: 'Чат', href: '/chat' },
    { icon: User, label: 'Профиль', href: '/profile' },
    { icon: Settings, label: 'Настройки', href: '/settings' },
    { icon: HelpCircle, label: 'Помощь', href: '/help' },
  ];

  return (
    <>
      {/* Кнопка меню */}
      <motion.div
        className="fixed top-4 right-4 z-50 sm:hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onToggle}
          size="sm"
          variant="ghost"
          className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Slide-out menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 right-0 z-40 w-64 h-full bg-white shadow-2xl sm:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="p-6 pt-16">
              <div className="space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors group"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <item.icon className="w-4 h-4 text-red-600" />
                    </motion.div>
                    <span className="font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                      {item.label}
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Дополнительная информация */}
              <motion.div
                className="mt-8 p-4 bg-gray-50 rounded-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center">
                  <img 
                    src="/logohantico.png" 
                    alt="Hantico" 
                    className="w-8 h-8 mx-auto mb-2 object-contain"
                  />
                  <h3 className="font-semibold text-sm text-gray-800">NeiroSync</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    AI консультант для вашего бизнеса
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}