import { useEffect } from 'react';

interface SplineViewerProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SplineViewer({ url, className, style }: SplineViewerProps) {
  useEffect(() => {
    // Загружаем Spline viewer скрипт
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.38/build/spline-viewer.js';
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://unpkg.com/@splinetool/viewer@1.10.38/build/spline-viewer.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <spline-viewer 
      url={url}
      className={className}
      style={style}
    />
  );
}