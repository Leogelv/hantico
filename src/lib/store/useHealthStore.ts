import { create } from 'zustand';

export interface Analysis {
  id: string;
  name: string;
  value: number;
  unit: string;
  refMin: number;
  refMax: number;
  status: 'low' | 'normal' | 'high' | 'critical';
  aiExplanation: string;
  date: string;
}

export interface Symptom {
  id: string;
  name: string;
  severity: number; // 1-10
  duration: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  notes?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'supplement' | 'exercise' | 'diet' | 'lifestyle' | 'medical';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  dueDate?: string;
}

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'attention' | 'warning';
  lastUpdated: string;
}

interface HealthStore {
  analyses: Analysis[];
  symptoms: Symptom[];
  recommendations: Recommendation[];
  healthMetrics: HealthMetric[];
  healthScore: number;
  lastCalculated: string;
  
  // Actions
  addAnalysis: (analysis: Analysis) => void;
  addSymptom: (symptom: Symptom) => void;
  updateRecommendation: (id: string, updates: Partial<Recommendation>) => void;
  calculateHealthScore: () => void;
  uploadFiles: (files: File[]) => Promise<void>;
  isProcessing: boolean;
  processingProgress: number;
  setProcessing: (processing: boolean) => void;
  setProgress: (progress: number) => void;
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  analyses: [],
  symptoms: [],
  recommendations: [],
  healthMetrics: [],
  healthScore: 85,
  lastCalculated: new Date().toISOString(),
  isProcessing: false,
  processingProgress: 0,

  addAnalysis: (analysis) => {
    set((state) => ({
      analyses: [...state.analyses, analysis]
    }));
    get().calculateHealthScore();
  },

  addSymptom: (symptom) => {
    set((state) => ({
      symptoms: [...state.symptoms, symptom]
    }));
  },

  updateRecommendation: (id, updates) => {
    set((state) => ({
      recommendations: state.recommendations.map(rec =>
        rec.id === id ? { ...rec, ...updates } : rec
      )
    }));
  },

  calculateHealthScore: () => {
    const { analyses, symptoms } = get();
    
    // Простая логика расчета score
    let score = 100;
    
    // Уменьшаем за плохие анализы
    analyses.forEach(analysis => {
      if (analysis.status === 'critical') score -= 15;
      else if (analysis.status === 'high' || analysis.status === 'low') score -= 10;
    });
    
    // Уменьшаем за тяжелые симптомы
    symptoms.forEach(symptom => {
      if (symptom.severity >= 8) score -= 10;
      else if (symptom.severity >= 6) score -= 5;
    });
    
    score = Math.max(0, Math.min(100, score));
    
    set({
      healthScore: score,
      lastCalculated: new Date().toISOString()
    });
  },

  uploadFiles: async (files) => {
    set({ isProcessing: true, processingProgress: 0 });
    
    // Симуляция обработки файлов
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      set({ processingProgress: i });
    }
    
    // Добавляем моковые результаты анализов
    const mockAnalyses: Analysis[] = [
      {
        id: '1',
        name: 'Гемоглобин',
        value: 110,
        unit: 'г/л',
        refMin: 120,
        refMax: 160,
        status: 'low',
        aiExplanation: 'Уровень гемоглобина ниже нормы, что может быть причиной вашей усталости. Рекомендую проверить уровень железа и B12.',
        date: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Витамин D',
        value: 18,
        unit: 'нг/мл',
        refMin: 30,
        refMax: 100,
        status: 'low',
        aiExplanation: 'Дефицит витамина D влияет на энергию, иммунитет и настроение. Рекомендуется прием добавок.',
        date: new Date().toISOString()
      }
    ];
    
    set((state) => ({
      analyses: [...state.analyses, ...mockAnalyses],
      isProcessing: false,
      processingProgress: 100
    }));
    
    get().calculateHealthScore();
  },

  setProcessing: (processing) => {
    set({ isProcessing: processing });
  },

  setProgress: (progress) => {
    set({ processingProgress: progress });
  }
}));