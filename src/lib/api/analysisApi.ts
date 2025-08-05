// API для работы с анализом документов

export interface AnalysisResponse {
  response: string;
  analysis: {
    document_type: string;
    date: string;
    lab_name?: string;
    metrics: Array<{
      name: string;
      value: number;
      unit: string;
      ref_min: number;
      ref_max: number;
      status: 'normal' | 'low' | 'high' | 'critical';
      interpretation: string;
      category: string;
      priority: number;
    }>;
    insights: Array<{
      type: 'warning' | 'info' | 'success';
      title: string;
      description: string;
      related_metrics: string[];
      recommendations: string[];
    }>;
    health_score: number;
  };
  plan: Array<{
    action: string;
    reason: string;
    timeline: 'immediate' | 'this_week' | 'this_month';
    category: 'lifestyle' | 'nutrition' | 'supplements' | 'medical';
  }>;
}

export async function sendAnalysisToAgent(files: File[], sessionId: string): Promise<AnalysisResponse> {
  try {
    // Конвертируем файлы в base64
    const filesData = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        return {
          name: file.name,
          type: file.type,
          content: base64
        };
      })
    );

    const payload = {
      stage: 'analysis',
      sessionId: sessionId,
      files: filesData,
      timestamp: new Date().toISOString()
    };

    console.log('🚀 [Analysis] Отправляем файлы для анализа:', {
      ...payload,
      files: payload.files.map(f => ({ name: f.name, type: f.type }))
    });

    const response = await fetch('https://n8n.nooweb.online/webhook/selfagent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const text = await response.text();
    console.log('📄 [Analysis] Сырой ответ:', text);

    if (!text) {
      throw new Error('Пустой ответ от сервера');
    }

    try {
      const result = JSON.parse(text);
      
      // Обрабатываем формат ответа от n8n
      if (Array.isArray(result) && result.length > 0 && result[0].output) {
        const parsedOutput = JSON.parse(result[0].output);
        console.log('✅ [Analysis] Результат анализа:', parsedOutput);
        return parsedOutput;
      } else if (result.response && result.analysis) {
        return result;
      }
      
      throw new Error('Неверный формат ответа');
    } catch (parseError) {
      console.error('❌ [Analysis] Ошибка парсинга:', parseError);
      throw parseError;
    }
  } catch (error) {
    console.error('❌ [Analysis] Ошибка отправки:', error);
    throw error;
  }
}

// Сохранение результатов анализа в localStorage
export function saveAnalysisResults(results: AnalysisResponse): void {
  localStorage.setItem('latestAnalysisResults', JSON.stringify({
    ...results,
    timestamp: new Date().toISOString()
  }));
}

// Получение сохраненных результатов
export function getAnalysisResults(): AnalysisResponse | null {
  const saved = localStorage.getItem('latestAnalysisResults');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}