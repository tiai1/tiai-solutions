import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/lib/viewport';
import { cn } from '@/lib/utils';

interface ChartData {
  name: string;
  data: any[];
  type: 'bar' | 'line' | 'waterfall';
}

interface ChartRevealProps {
  charts: ChartData[];
  activeChart: number;
  onChartChange: (index: number) => void;
}

export default function ChartReveal({ charts, activeChart, onChartChange }: ChartRevealProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { hasIntersected } = useIntersectionObserver(chartRef);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (hasIntersected && !isLoaded) {
      // Simulate chart loading delay
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [hasIntersected, isLoaded]);

  const renderMockChart = (chart: ChartData) => {
    if (chart.type === 'bar') {
      const maxValue = Math.max(...chart.data.map(item => item.actual));
      const minValue = Math.min(...chart.data.map(item => item.actual));
      const range = maxValue - minValue;
      
      return (
        <div className="relative h-80 bg-muted/30 rounded-lg p-8">
          <div className="relative h-64">
            {/* Month Labels at bottom */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between">
              {chart.data.map((item, index) => (
                <span key={index} className="text-xs text-muted-foreground font-medium">
                  {item.month}
                </span>
              ))}
            </div>
            
            {/* Trend Line Chart */}
            <svg 
              className="w-full h-full" 
              viewBox="0 0 600 240"
            >
              {/* Grid lines for reference */}
              <defs>
                <pattern id="grid" width="100" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 40" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Main trend line */}
              <motion.polyline 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="3"
                points={chart.data.map((item, i) => {
                  const x = 60 + (i * (600 - 120) / (chart.data.length - 1));
                  const y = 200 - ((item.actual - minValue) / range) * 160;
                  return `${x},${y}`;
                }).join(' ')}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              
              {/* Data points */}
              {chart.data.map((item, i) => {
                const x = 60 + (i * (600 - 120) / (chart.data.length - 1));
                const y = 200 - ((item.actual - minValue) / range) * 160;
                return (
                  <motion.circle 
                    key={i}
                    cx={x} 
                    cy={y} 
                    r="5" 
                    fill="hsl(var(--primary))"
                    stroke="white"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 + 0.5 }}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      );
    }

    if (chart.type === 'waterfall') {
      return (
        <div className="relative h-80 bg-muted/30 rounded-lg flex items-end justify-around p-4">
          <div className="flex items-end space-x-4 h-full">
            {chart.data.map((item, index) => {
              const isPositive = item.value > 0;
              const isStart = index === 0;
              const isEnd = index === chart.data.length - 1;
              
              return (
                <motion.div 
                  key={index}
                  className="flex flex-col items-center justify-end h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <motion.div 
                    className={cn(
                      'w-16 mb-2 rounded',
                      isStart || isEnd ? 'bg-primary' : 
                      isPositive ? 'bg-green-500' : 'bg-red-500'
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.abs(item.value) * 6}px` }}
                    transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
                  />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className={cn(
                    'text-xs font-bold',
                    isStart || isEnd ? 'text-primary' : 
                    isPositive ? 'text-green-500' : 'text-red-500'
                  )}>
                    {isStart || isEnd ? `${item.value}%` : `${isPositive ? '+' : ''}${item.value}%`}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }

    // Line chart
    return (
      <div className="relative h-80 bg-muted/30 rounded-lg flex items-center justify-center p-4">
        <div className="w-full h-full relative">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <motion.polyline 
              fill="none" 
              stroke="hsl(var(--primary))" 
              strokeWidth="3"
              points={chart.data.map((_, i) => `${50 + i * 100},${150 - chart.data[i].actual}`).join(' ')}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.polyline 
              fill="none" 
              stroke="hsl(var(--accent))" 
              strokeWidth="3" 
              strokeDasharray="5,5"
              points={chart.data.map((_, i) => `${50 + i * 100},${150 - chart.data[i].forecast}`).join(' ')}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            />
            {chart.data.map((item, i) => (
              <motion.circle 
                key={i}
                cx={50 + i * 100} 
                cy={150 - item.actual} 
                r="4" 
                fill="hsl(var(--primary))"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 + 1 }}
              />
            ))}
          </svg>
          
          {/* Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8">
            {chart.data.map((item, index) => (
              <span key={index} className="text-xs text-muted-foreground">
                {item.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      ref={chartRef}
      className="bg-card rounded-xl p-8 shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={hasIntersected ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
      data-testid="chart-reveal-container"
    >
      {/* Chart Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-muted rounded-lg p-1 inline-flex">
          {charts.map((chart, index) => (
            <button
              key={index}
              onClick={() => onChartChange(index)}
              className={cn(
                'px-6 py-3 rounded-md transition-all duration-200',
                activeChart === index
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-background'
              )}
              data-testid={`chart-tab-${index}`}
            >
              {chart.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Display */}
      <div className="relative">
        {isLoaded ? (
          <motion.div
            key={activeChart}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <h3 className="font-display font-semibold text-xl" data-testid="chart-title">
                {charts[activeChart].name}
              </h3>
              <p className="text-muted-foreground">
                Interactive visualization with automated data refresh
              </p>
            </div>
            {renderMockChart(charts[activeChart])}
          </motion.div>
        ) : (
          <div className="h-80 bg-muted/30 rounded-lg flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
