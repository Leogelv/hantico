import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom Node Components
const SymptomNode = ({ data }: any) => {
  return (
    <div className="bg-card border-2 border-health-warning rounded-lg p-3 shadow-card min-w-[150px]">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-health-warning" />
        <span className="font-medium text-text-primary text-sm">{data.label}</span>
      </div>
      <div className="text-xs text-text-muted">{data.duration}</div>
      <div className="mt-2 w-full bg-muted rounded-full h-1">
        <div 
          className="bg-health-warning h-1 rounded-full transition-all"
          style={{ width: `${(data.severity / 10) * 100}%` }}
        />
      </div>
    </div>
  );
};

const AnalysisNode = ({ data }: any) => {
  const statusColors = {
    normal: 'border-health-excellent text-health-excellent',
    warning: 'border-health-attention text-health-attention',
    critical: 'border-health-warning text-health-warning'
  };

  return (
    <div className={`bg-card border-2 ${statusColors[data.status]} rounded-lg p-3 shadow-card min-w-[150px]`}>
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4" />
        <span className="font-medium text-text-primary text-sm">{data.label}</span>
      </div>
      <div className="text-xs text-text-muted">{data.date}</div>
      <div className="text-xs font-mono mt-1">{data.value} {data.unit}</div>
    </div>
  );
};

const TreatmentNode = ({ data }: any) => {
  return (
    <div className="bg-card border-2 border-health-excellent rounded-lg p-3 shadow-card min-w-[150px]">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-4 h-4 text-health-excellent" />
        <span className="font-medium text-text-primary text-sm">{data.label}</span>
      </div>
      <div className="text-xs text-text-muted">{data.type}</div>
    </div>
  );
};

const nodeTypes = {
  symptom: SymptomNode,
  analysis: AnalysisNode,
  treatment: TreatmentNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'symptom',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Хроническая усталость',
      severity: 7,
      duration: '3 месяца'
    }
  },
  {
    id: '2',
    type: 'analysis',
    position: { x: 400, y: 100 },
    data: {
      label: 'Гемоглобин',
      date: '15.01.2025',
      status: 'warning',
      value: '110',
      unit: 'г/л'
    }
  },
  {
    id: '3',
    type: 'analysis',
    position: { x: 400, y: 250 },
    data: {
      label: 'Витамин D',
      date: '15.01.2025',
      status: 'critical',
      value: '18',
      unit: 'нг/мл'
    }
  },
  {
    id: '4',
    type: 'treatment',
    position: { x: 700, y: 175 },
    data: {
      label: 'Прием железа',
      type: 'Добавка'
    }
  },
  {
    id: '5',
    type: 'symptom',
    position: { x: 100, y: 300 },
    data: { 
      label: 'Плохой сон',
      severity: 6,
      duration: '2 месяца'
    }
  }
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#f59e0b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
    label: 'может вызывать'
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    animated: true,
    style: { stroke: '#ef4444', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
    label: 'связано с'
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    style: { stroke: '#10b981', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
    label: 'лечение'
  },
  {
    id: 'e5-1',
    source: '5',
    target: '1',
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
    label: 'усиливает'
  }
];

export function HealthGraphScreen() {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Граф здоровья</h1>
              <p className="text-text-secondary">Визуализация связей между симптомами и анализами</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm text-text-secondary">AI Анализ</span>
          </div>
        </div>

        {/* Main Graph */}
        <Card className="h-[calc(100vh-200px)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Интерактивный граф связей
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full p-0">
            <div className="h-full w-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                className="bg-surface rounded-b-lg"
              >
                <Background color="#e2e8f0" gap={16} />
                <Controls />
                <MiniMap 
                  className="bg-card border border-border rounded"
                  nodeColor={(node) => {
                    switch (node.type) {
                      case 'symptom': return '#ef4444';
                      case 'analysis': return '#3b82f6';
                      case 'treatment': return '#10b981';
                      default: return '#6366f1';
                    }
                  }}
                />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-health-warning rounded-full"></div>
                <div>
                  <div className="font-medium text-text-primary">Симптомы</div>
                  <div className="text-xs text-text-muted">Текущие жалобы и проявления</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-health-good rounded-full"></div>
                <div>
                  <div className="font-medium text-text-primary">Анализы</div>
                  <div className="text-xs text-text-muted">Лабораторные показатели</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-health-excellent rounded-full"></div>
                <div>
                  <div className="font-medium text-text-primary">Лечение</div>
                  <div className="text-xs text-text-muted">Рекомендации и терапия</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}