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
      const maxValue = 180; // Fixed max for consistent display
      
      return (
        <div className="relative h-80 bg-muted/30 rounded-lg p-6">
          <div className="relative h-full flex items-end justify-between pb-8">
            {chart.data.map((item, index) => {
              const height = (item.actual / maxValue) * 200;
              return (
                <motion.div 
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Value display */}
                  <div className="text-sm font-semibold text-primary mb-2">
                    {item.actual}
                  </div>
                  
                  {/* Simple bar */}
                  <motion.div 
                    className="w-12 bg-primary rounded-t mb-3"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}px` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                  />
                  
                  {/* Month label */}
                  <span className="text-xs text-muted-foreground font-medium">
                    {item.month}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }

    if (chart.type === 'waterfall') {
      // Calculate cumulative values for waterfall
      let cumulativeValue = 0;
      const waterfallData = chart.data.map((item, index) => {
        const isStart = index === 0;
        const isEnd = index === chart.data.length - 1;
        
        if (isStart) {
          cumulativeValue = item.value;
          return { ...item, startValue: 0, endValue: item.value, cumulativeValue };
        } else if (isEnd) {
          return { ...item, startValue: 0, endValue: item.value, cumulativeValue: item.value };
        } else {
          const startValue = cumulativeValue;
          cumulativeValue += item.value;
          return { ...item, startValue, endValue: cumulativeValue, cumulativeValue };
        }
      });
      
      const maxValue = Math.max(...waterfallData.map(item => Math.max(item.endValue, item.startValue || 0)));
      
      return (
        <div className="relative h-80 bg-muted/30 rounded-lg p-4">
          <div className="flex items-end justify-around h-full space-x-2">
            {waterfallData.map((item, index) => {
              const isPositive = item.value > 0;
              const isStart = index === 0;
              const isEnd = index === chart.data.length - 1;
              const baseHeight = isStart || isEnd ? 0 : (item.startValue / maxValue) * 240;
              const barHeight = isStart || isEnd ? (item.value / maxValue) * 240 : (Math.abs(item.value) / maxValue) * 240;
              
              return (
                <motion.div 
                  key={index}
                  className="flex flex-col items-center justify-end h-full relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  {/* Base for floating bars (middle elements) */}
                  {!isStart && !isEnd && (
                    <div 
                      className="w-16 bg-transparent border-l-2 border-dashed border-muted-foreground/30"
                      style={{ height: `${baseHeight}px` }}
                    />
                  )}
                  
                  {/* Main bar */}
                  <motion.div 
                    className={cn(
                      'w-16 mb-2 rounded relative',
                      isStart || isEnd ? 'bg-primary' : 
                      isPositive ? 'bg-green-500' : 'bg-red-500'
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeight}px` }}
                    transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
                  />
                  
                  {/* Label */}
                  <span className="text-xs text-muted-foreground text-center">{item.label}</span>
                  
                  {/* Value */}
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
