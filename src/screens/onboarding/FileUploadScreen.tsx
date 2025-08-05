import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, CheckCircle, ArrowLeft, X, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { useUserStore } from '@/lib/store/useUserStore';
import { sendAnalysisToAgent, saveAnalysisResults } from '@/lib/api/analysisApi';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
}

export function FileUploadScreen() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [actualFiles, setActualFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { nextStep, completeOnboarding } = useUserStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      status: 'uploading' as const,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setActualFiles(prev => [...prev, ...acceptedFiles]);

    // Simulate file upload
    newFiles.forEach((file) => {
      simulateUpload(file.id);
    });
  }, []);

  const simulateUpload = async (fileId: string) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress } : f
      ));
    }

    // Change to completed
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'completed' } : f
    ));
  };

  const removeFile = (fileId: string) => {
    const fileIndex = files.findIndex(f => f.id === fileId);
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (fileIndex !== -1) {
      setActualFiles(prev => prev.filter((_, index) => index !== fileIndex));
    }
  };

  const startProcessing = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    const sessionId = `onboarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Симуляция прогресса во время отправки
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 2;
        if (progress <= 80) {
          setProcessingProgress(progress);
        }
      }, 100);

      // Отправляем файлы для анализа
      const analysisResult = await sendAnalysisToAgent(actualFiles, sessionId);
      
      clearInterval(progressInterval);
      setProcessingProgress(90);

      // Сохраняем результаты
      saveAnalysisResults(analysisResult);
      
      setProcessingProgress(100);

      // Переход к результатам
      setTimeout(() => {
        nextStep();
        completeOnboarding();
        navigate('/analysis-result');
      }, 500);
    } catch (error) {
      console.error('Ошибка при анализе:', error);
      
      // В случае ошибки используем фоллбэк
      for (let progress = processingProgress; progress <= 100; progress += 2) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setProcessingProgress(progress);
      }

      setTimeout(() => {
        nextStep();
        completeOnboarding();
        navigate('/analysis-result');
      }, 500);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 5
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/onboarding/chat')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <OnboardingProgress currentStep={3} />
          <div className="w-9" />
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Загрузите ваши анализы</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Загрузите PDF файлы с результатами анализов или фотографии. 
            Наш AI проанализирует данные и создаст персональные рекомендации.
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-border rounded-3xl p-12 text-center cursor-pointer bg-surface/20 backdrop-blur-sm transition-colors hover:bg-surface/30"
            style={{
              borderColor: isDragActive ? 'hsl(var(--primary))' : 'hsl(var(--border))'
            }}
          >
            <input {...getInputProps()} />
            
            <AnimatePresence mode="wait">
              {isDragActive ? (
                <motion.div
                  key="drag-active"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-medium text-primary">Отпустите файлы здесь</p>
                </motion.div>
              ) : (
                <motion.div
                  key="drag-inactive"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Перетащите файлы сюда</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Поддерживаются PDF и изображения (до 5 файлов)
                  </p>
                  <Button variant="outline">
                    Выбрать файлы
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <h3 className="text-lg font-medium mb-4">Загруженные файлы</h3>
              <div className="space-y-3">
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-surface/50 border border-border rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === 'completed' && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="p-1"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="h-2" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing Animation */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center"
            >
              <div className="text-center px-4">
                <motion.div
                  className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity }
                  }}
                >
                  <Brain className="w-12 h-12 text-white" />
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  AI анализирует ваши данные
                </motion.h3>
                <motion.p 
                  className="text-muted-foreground mb-8 max-w-md mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Создаем персональные рекомендации на основе ваших анализов...
                </motion.p>
                
                <div className="max-w-sm mx-auto mb-4">
                  <Progress value={processingProgress} className="h-4" />
                  <p className="text-lg font-semibold mt-3">
                    {processingProgress}% завершено
                  </p>
                </div>

                {/* Processing particles animation */}
                <div className="relative h-32">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg"
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                      animate={{
                        x: [0, Math.cos(i * 30 * Math.PI / 180) * 80, 0],
                        y: [0, Math.sin(i * 30 * Math.PI / 180) * 80, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1.2, 0]
                      }}
                      transition={{
                        duration: 2.5,
                        delay: i * 0.1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {files.length > 0 && !isProcessing && (
            <Button
              onClick={startProcessing}
              size="lg"
              className="px-8"
            >
              Анализировать данные
            </Button>
          )}
          
          {files.length === 0 && (
            <Button
              onClick={() => {
                nextStep();
                completeOnboarding();
                navigate('/analysis-result');
              }}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Пропустить пока
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}