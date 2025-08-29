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
      
      // Set options
      chartInstance.current.setOption(options);
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

  // Update chart when options change
  useEffect(() => {
    if (chartInstance.current && options) {
      chartInstance.current.setOption(options, true);
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