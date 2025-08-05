// Типы для брифинг чата NeiroSync

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  audioFile?: string;
  isMarkdown?: boolean;
}

export interface BriefingSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
  questions: string[];
  description: string;
}

export interface BriefingData {
  company: {
    name?: string;
    sphere?: string;
    employees?: number;
    departments?: string[];
    callCenterOperators?: number;
  };
  qualityControl: {
    currentMethod?: string;
    checkPercentage?: number;
    criteria?: string[];
    problems?: string[];
    expectedResults?: string[];
  };
  aiUseCases: {
    selected?: string[];
    custom?: string[];
  };
  businessProcesses: {
    timeConsuming?: string[];
    toAutomate?: string[];
    aiIdeas?: string[];
  };
  integration: {
    dataStorage?: string;
    systems?: string[];
    requirements?: string[];
  };
}