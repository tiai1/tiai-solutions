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
      const maxValue = Math.max(...chart.data.map(item => Math.max(item.actual, item.plan)));
      const chartHeight = 240; // Fixed height for consistent scaling
      
      return (
        <div className="relative h-80 bg-muted/30 rounded-lg p-6">
          {/* Legend - moved to top */}
          <div className="flex justify-end mb-4 space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-3 bg-primary mr-2 rounded" />
              <span className="text-sm">Actual</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-3 bg-primary/40 mr-2 rounded" />
              <span className="text-sm">Plan</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 mr-2 rounded border-2 border-dashed border-accent bg-transparent" />
              <span className="text-sm">Trend</span>
            </div>
          </div>
          
          <div className="relative h-64">
            {/* Chart Grid */}
            <div className="absolute inset-0 flex justify-between items-end pb-6">
              {chart.data.map((item, index) => (
                <div key={index} className="flex flex-col items-center w-16">
                  {/* Bar Group */}
                  <div className="flex items-end space-x-1 mb-3">
                    {/* Actual Bar */}
                    <motion.div 
                      className="bg-primary w-6 rounded-t" 
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.actual / maxValue) * 200}px` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                    {/* Plan Bar */}
                    <motion.div 
                      className="bg-primary/40 w-6 rounded-t" 
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.plan / maxValue) * 200}px` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.1 }}
                    />
                  </div>
                  {/* Month Label */}
                  <span className="text-xs text-muted-foreground font-medium">{item.month}</span>
                </div>
              ))}
            </div>
            
            {/* Trend Line Overlay */}
            <div className="absolute inset-0 pb-6">
              <svg 
                className="w-full h-full pointer-events-none" 
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <motion.polyline 
                  fill="none" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth="0.8"
                  strokeDasharray="2,2"
                  points={chart.data.map((item, i) => 
                    `${8 + (i * 84 / (chart.data.length - 1))},${100 - (item.actual / maxValue) * 80}`
                  ).join(' ')}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                />
                {/* Trend Line Points */}
                {chart.data.map((item, i) => (
                  <motion.circle 
                    key={i}
                    cx={8 + (i * 84 / (chart.data.length - 1))} 
                    cy={100 - (item.actual / maxValue) * 80} 
                    r="1" 
                    fill="hsl(var(--accent))"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 + 1.2 }}
                  />
                ))}
              </svg>
            </div>
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
