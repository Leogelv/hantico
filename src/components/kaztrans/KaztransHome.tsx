import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { agents } from './types';
import { Users, Bot, BarChart3, Globe, ArrowRight } from 'lucide-react';

const agentIcons: Record<number, React.ReactNode> = {
  1: <Users className="w-8 h-8" />,
  2: <Bot className="w-8 h-8" />,
  3: <BarChart3 className="w-8 h-8" />,
  4: <Globe className="w-8 h-8" />
};

const agentGradients: Record<number, string> = {
  1: 'from-blue-500 to-blue-600',
  2: 'from-green-500 to-green-600',
  3: 'from-purple-500 to-purple-600',
  4: 'from-orange-500 to-orange-600'
};

export function KaztransHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <span className="text-2xl font-bold">КТО</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            КазТрансОйл AI-Core
          </h1>
          <p className="text-lg text-gray-600">
            Интеллектуальная HR-экосистема для цифровой трансформации
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Декабрь 2024 • Демо-версия
          </div>
        </motion.div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/kaztrans/${agent.id}`}>
                <motion.div
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${agentGradients[agent.id]} p-6 text-white`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                          whileHover={{ rotate: 5 }}
                        >
                          {agentIcons[agent.id]}
                        </motion.div>
                        <div>
                          <h3 className="text-2xl font-bold">{agent.name}</h3>
                          <p className="text-white/90 text-sm mt-1">{agent.title}</p>
                        </div>
                      </div>
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        <ArrowRight className="w-6 h-6" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      {agent.description}
                    </p>
                    
                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-2">
                      {getAgentFeatures(agent.id).map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <motion.div 
                      className="mt-6 flex items-center justify-between"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-sm text-gray-500">
                        Нажмите для запуска
                      </span>
                      <div className={`px-4 py-2 bg-gradient-to-r ${agentGradients[agent.id]} text-white rounded-lg text-sm font-medium shadow-md`}>
                        Открыть чат →
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div 
          className="mt-12 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>© 2024 АО «КазТрансОйл» • AI-Core Platform</p>
          <p className="mt-2">Разработано совместно с Hantico AI Solutions</p>
        </motion.div>
      </div>
    </div>
  );
}

function getAgentFeatures(agentId: number): string[] {
  switch(agentId) {
    case 1:
      return ['Отпуска', 'Больничные', 'Справки', 'Обучение', 'HR-поддержка'];
    case 2:
      return ['Вакансии', 'Скоринг', 'Аналитика', 'Воронка найма', 'Прогнозы'];
    case 3:
      return ['Пульс команды', 'KPI', 'Безопасность', 'Обучение', 'Экология'];
    case 4:
      return ['ROI анализ', 'Кадровый резерв', 'Риски', 'Стратегия', 'Глобальные метрики'];
    default:
      return [];
  }
}