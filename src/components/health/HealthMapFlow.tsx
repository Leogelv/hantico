import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  EdgeLabelRenderer,
  BaseEdge,
  getBezierPath,
  getSmoothStepPath,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { Heart, Brain, Activity, Zap, Shield, Target, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Custom Edge with Label
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: any) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: style?.strokeWidth || 4,
          stroke: style?.stroke || '#000000',
        }} 
      />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 1000,
            }}
            className="nodrag nopan"
          >
            <Card className="px-3 py-2 bg-white/95 backdrop-blur-sm border-health-good/50 shadow-lg">
              <p className="text-sm font-semibold text-health-good">{data.label}</p>
              {data.description && (
                <p className="text-xs text-text-secondary mt-0.5">{data.description}</p>
              )}
            </Card>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

// Custom node types
const HealthNode = ({ data }: { data: any }) => {
  const Icon = data.icon;
  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'excellent': return 'from-health-excellent to-health-good';
      case 'good': return 'from-health-good to-health-excellent';
      case 'warning': return 'from-health-warning to-yellow-600';
      case 'critical': return 'from-health-critical to-red-600';
      default: return 'from-health-surface to-gray-500';
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'excellent': return 'border-health-excellent/30';
      case 'good': return 'border-health-good/30';
      case 'warning': return 'border-health-warning/30';
      case 'critical': return 'border-health-critical/30';
      default: return 'border-health-border/30';
    }
  };

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`
        relative overflow-hidden rounded-2xl border-2 min-w-[150px] p-1
        bg-gradient-to-br ${getStatusGradient(data.status)} ${getStatusBorder(data.status)}
        shadow-lg hover:shadow-xl transition-all duration-300
      `}>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3">
          <div className="flex flex-col items-center gap-2">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center
              bg-gradient-to-br ${getStatusGradient(data.status)}
              shadow-inner
            `}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-sm text-text-primary">{data.label}</div>
              <div className="text-xs text-text-secondary font-medium">{data.value}</div>
              {data.details && (
                <div className="text-xs text-text-secondary/70 mt-1">{data.details}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Пульсирующий эффект для важных узлов */}
      {data.status === 'excellent' && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-health-excellent/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

const MetricNode = ({ data }: { data: any }) => {
  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch(trend) {
      case 'up': return 'text-health-good bg-health-good/10';
      case 'down': return 'text-health-critical bg-health-critical/10';
      default: return 'text-text-secondary bg-gray-100';
    }
  };

  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.02 }}
    >
      <Card className="bg-white/95 backdrop-blur-sm border-health-border/20 shadow-md hover:shadow-lg transition-all duration-300 min-w-[120px] p-3">
        <div className="flex flex-col items-center gap-1">
          <div className="text-xl font-bold bg-gradient-to-r from-health-excellent to-health-good bg-clip-text text-transparent">
            {data.value}
          </div>
          <div className="text-xs font-medium text-text-primary">{data.label}</div>
          {data.trend && (
            <Badge className={`text-xs ${getTrendColor(data.trend)} border-0 px-2 py-0.5`}>
              <span className="mr-1">{getTrendIcon(data.trend)}</span>
              {data.change}
            </Badge>
          )}
        </div>
        {/* Дополнительная информация при наведении */}
        {data.info && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ y: 5 }}
            whileHover={{ y: 0 }}
          >
            <Card className="px-2 py-1 bg-black/80 text-white text-xs whitespace-nowrap">
              {data.info}
            </Card>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

const nodeTypes = {
  health: HealthNode,
  metric: MetricNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export function HealthMapFlow() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Начальные узлы для карты здоровья - вертикальная мобильная компоновка
  const initialNodes: Node[] = [
    // Метрики сверху
    {
      id: 'pulse',
      type: 'metric',
      position: { x: 50, y: 50 },
      data: { 
        label: 'Пульс', 
        value: '68',
        trend: 'stable',
        change: 'стабильно',
        info: 'Норма: 60-80 уд/мин'
      },
    },
    {
      id: 'pressure',
      type: 'metric',
      position: { x: 200, y: 50 },
      data: { 
        label: 'Давление', 
        value: '120/80',
        trend: 'up',
        change: '+2%',
        info: 'Оптимальное значение'
      },
    },
    
    // Сердечно-сосудистая система
    {
      id: 'cardiovascular',
      type: 'health',
      position: { x: 125, y: 180 },
      data: { 
        label: 'Сердечно-сосудистая', 
        value: 'Отлично',
        status: 'excellent',
        icon: Heart,
        details: 'ЧСС, давление в норме'
      },
    },
    
    // Метрики нервной системы
    {
      id: 'sleep',
      type: 'metric',
      position: { x: 50, y: 320 },
      data: { 
        label: 'Сон', 
        value: '7.5ч',
        trend: 'up',
        change: '+0.5ч',
        info: 'Рекомендуется: 7-9ч'
      },
    },
    {
      id: 'stress',
      type: 'metric',
      position: { x: 200, y: 320 },
      data: { 
        label: 'Стресс', 
        value: 'Низкий',
        trend: 'down',
        change: '-15%',
        info: 'Отличный показатель'
      },
    },
    
    // Нервная система
    {
      id: 'nervous',
      type: 'health',
      position: { x: 125, y: 450 },
      data: { 
        label: 'Нервная система', 
        value: 'Хорошо',
        status: 'good',
        icon: Brain,
        details: 'Сон, стресс под контролем'
      },
    },
    
    // Центральный узел - индекс здоровья
    {
      id: 'health-score',
      type: 'health',
      position: { x: 125, y: 580 },
      data: { 
        label: 'Индекс здоровья', 
        value: '8.4/10',
        status: 'excellent',
        icon: Heart,
        details: 'Общая оценка'
      },
    },
    
    // Метрики иммунитета
    {
      id: 'nutrition',
      type: 'metric',
      position: { x: 50, y: 710 },
      data: { 
        label: 'Питание', 
        value: '8.2/10',
        trend: 'up',
        change: '+0.3',
        info: 'Сбалансированное'
      },
    },
    
    // Иммунитет
    {
      id: 'immune',
      type: 'health',
      position: { x: 125, y: 840 },
      data: { 
        label: 'Иммунитет', 
        value: 'Норма',
        status: 'good',
        icon: Shield,
        details: 'Защитные функции активны'
      },
    },
    
    // Активность
    {
      id: 'activity',
      type: 'metric',
      position: { x: 200, y: 970 },
      data: { 
        label: 'Активность', 
        value: '12k шагов',
        trend: 'up',
        change: '+2k',
        info: 'Цель достигнута!'
      },
    },
    
    // Энергия
    {
      id: 'energy',
      type: 'health',
      position: { x: 125, y: 1100 },
      data: { 
        label: 'Энергия', 
        value: 'Высокая',
        status: 'excellent',
        icon: Zap,
        details: 'Отличная активность'
      },
    },
  ];

  // ПРОСТЫЕ ПРЯМЫЕ СТРЕЛКИ БЕЗ ВСЯКОЙ ХУЙНИ
  const initialEdges: Edge[] = [
    // Метрики к сердечно-сосудистой системе
    { 
      id: 'e1', 
      source: 'pulse', 
      target: 'cardiovascular', 
      type: 'straight',
      animated: false,
      style: { strokeWidth: 6, stroke: '#000000' },
      markerEnd: { type: 'arrowclosed', color: '#000000', width: 40, height: 40 },
    },
    { 
      id: 'e2', 
      source: 'pressure', 
      target: 'cardiovascular', 
      type: 'straight',
      animated: false,
      style: { strokeWidth: 6, stroke: '#000000' },
      markerEnd: { type: 'arrowclosed', color: '#000000', width: 40, height: 40 },
    },
    
    // Метрики к нервной системе
    { 
      id: 'e3', 
      source: 'sleep', 
      target: 'nervous', 
      type: 'straight',
      animated: false,
      style: { strokeWidth: 6, stroke: '#000000' },
      markerEnd: { type: 'arrowclosed', color: '#000000', width: 40, height: 40 },
    },
    { 
      id: 'e4', 
      source: 'stress', 
      target: 'nervous', 
      type: 'straight',
      animated: false,
      style: { strokeWidth: 6, stroke: '#000000' },
      markerEnd: { type: 'arrowclosed', color: '#000000', width: 40, height: 40 },
    },
    
    // Системы к центральному индексу здоровья
    { 
      id: 'e5', 
      source: 'cardiovascular', 
      target: 'health-score', 
      type: 'straight',
      animated: false,
      style: { strokeWidth: 8, stroke: '#000000' },
      markerEnd: { type: 'arrowclosed', color: '#000000', width: 50, height: 50 },
    },
    { 
      id: 'e6', 
      source: 'nervous', 
      target: 'health-score', 
      type: 'straight',
      animated: false,
      style: { strokeWidth: 8, stroke: '#000000' },
      markerEnd: { type: 'arrowclosed', color: '#000000', width: 50, height: 50 },
    },
    
    // Питание к иммунитету
    { 
      id: 'e7', 
      source: 'nutrition', 
      target: 'immune', 
      type: 'straight',
      animated: false,
      style: { strokeWidth: 6, stroke: '#000000' },
      markerEnd: { type: 'arrowclosed', color: '#000000', width: 40, height: 40 },
    },
    
    // Иммунитет к индексу здоровья
    { 
      id: 'e8', 
      source: 'immune', 
      target: 'health-score', 
      type: 'straight',
      animated: false,
      style: { strokeWidth: 8, stroke: '#000000' },
      markerEnd: { type: 'arrowclosed', color: '#000000', width: 50, height: 50 },
    },
    
    // Активность к энергии
    { 
      id: 'e9', 
      source: 'activity', 
      target: 'energy', 
      type: 'straight',
      animated: false,
      style: { strokeWidth: 6, stroke: '#000000' },
      markerEnd: { type: 'arrowclosed', color: '#000000', width: 40, height: 40 },
    },
    
    // Энергия к индексу здоровья
    { 
      id: 'e10', 
      source: 'energy', 
      target: 'health-score', 
      type: 'straight',
      animated: false,
      style: { strokeWidth: 8, stroke: '#000000' },
      markerEnd: { type: 'arrowclosed', color: '#000000', width: 50, height: 50 },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Обработчик полноэкранного режима
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`
      bg-gradient-to-br from-health-surface/30 to-background rounded-xl overflow-hidden border border-health-border/20
      ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-full'}
    `}>
      {/* Кнопка полноэкранного режима */}
      <Button
        onClick={toggleFullscreen}
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </Button>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        style={{ backgroundColor: 'transparent' }}
        defaultEdgeOptions={{
          type: 'straight',
          style: { 
            strokeWidth: 6, 
            stroke: '#000000',
          },
          markerEnd: {
            type: 'arrowclosed',
            color: '#000000',
            width: 40,
            height: 40,
          },
        }}
      >
        <Background color="#10B981" gap={20} size={0.5} />
      </ReactFlow>
    </div>
  );
}