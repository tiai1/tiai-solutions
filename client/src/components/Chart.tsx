import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';

interface ChartProps {
  options: any;
  height?: string | number;
  width?: string | number;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ 
  options, 
  height = '400px', 
  width = '100%', 
  className = '' 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (chartRef.current && options) {
      // Initialize chart
      chartInstance.current = echarts.init(chartRef.current);
      
      // Enhanced options with animations
      const animatedOptions = {
        ...options,
        animation: true,
        animationDuration: 2000,
        animationEasing: 'cubicOut',
        animationDelay: (idx: number) => idx * 100,
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'cubicInOut',
        series: options.series?.map((series: any) => ({
          ...series,
          animation: true,
          animationDuration: 2000,
          animationEasing: 'elasticOut',
          animationDelay: (idx: number) => idx * 150,
          // Enhanced animation for different chart types
          ...(series.type === 'line' && {
            animationDuration: 3000,
            animationEasing: 'cubicOut',
          }),
          ...(series.type === 'bar' && {
            animationDuration: 1500,
            animationEasing: 'bounceOut',
            animationDelay: (idx: number) => idx * 100,
          }),
        }))
      };
      
      // Set options with animations
      chartInstance.current.setOption(animatedOptions);
      setIsLoading(false);

      // Handle window resize
      const handleResize = () => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartInstance.current) {
          chartInstance.current.dispose();
        }
      };
    }
  }, [options]);

  // Update chart when options change with smooth transitions
  useEffect(() => {
    if (chartInstance.current && options) {
      const animatedOptions = {
        ...options,
        animation: true,
        animationDuration: 1500,
        animationEasing: 'cubicInOut',
        animationDurationUpdate: 1200,
        animationEasingUpdate: 'cubicOut',
        series: options.series?.map((series: any, seriesIndex: number) => ({
          ...series,
          animation: true,
          animationDuration: 1200,
          animationEasing: 'cubicOut',
          animationDelay: seriesIndex * 200,
          animationDurationUpdate: 800,
          animationEasingUpdate: 'cubicInOut',
        }))
      };
      
      // Use merge mode for smooth transitions
      chartInstance.current.setOption(animatedOptions, {
        notMerge: false,
        lazyUpdate: false,
        silent: false
      });
    }
  }, [options]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-lg"
          style={{ height, width }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div
        ref={chartRef}
        style={{ height, width }}
        className="rounded-lg"
      />
    </div>
  );
};

export default Chart;