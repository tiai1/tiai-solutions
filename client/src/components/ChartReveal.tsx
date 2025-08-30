import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/lib/viewport';
import { cn } from '@/lib/utils';
import { fetchCharts } from '@/lib/api';
import Chart from './Chart';

interface ChartData {
  name: string;
  type: string;
  data: any[];
  options: any;
}

interface ChartRevealProps {
  activeChart?: number;
  onChartChange?: (index: number) => void;
}

export default function ChartReveal({ activeChart = 0, onChartChange }: ChartRevealProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { hasIntersected } = useIntersectionObserver(chartRef);
  const [isLoaded, setIsLoaded] = useState(false);
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [currentChart, setCurrentChart] = useState(activeChart);

  // Load charts data from JSON
  useEffect(() => {
    const loadCharts = async () => {
      try {
        const chartsData = await fetchCharts();
        if (chartsData && typeof chartsData === 'object') {
          const chartsArray = Object.entries(chartsData).map(([key, value]: [string, any]) => ({
            name: value.name,
            type: value.type,
            data: value.data,
            options: value.options
          }));
          setCharts(chartsArray);
          console.log('Charts loaded successfully:', chartsArray.length);
        } else {
          console.warn('No charts data available, using fallback');
          // Set a simple fallback chart
          setCharts([{
            name: 'Sample Dashboard',
            type: 'bar',
            data: [],
            options: {
              chart: { type: 'bar' },
              series: [{ name: 'Sample', data: [10, 20, 30, 40, 50] }],
              xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] }
            }
          }]);
        }
      } catch (error) {
        console.error('Failed to load charts:', error);
        // Set fallback chart on error
        setCharts([{
          name: 'Demo Dashboard',
          type: 'line',
          data: [],
          options: {
            chart: { type: 'line' },
            series: [{ name: 'Performance', data: [30, 40, 35, 50, 49, 60, 70] }],
            xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }
          }
        }]);
      }
    };

    loadCharts();
  }, []);

  useEffect(() => {
    if (hasIntersected && !isLoaded && charts.length > 0) {
      // Simulate chart loading delay
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [hasIntersected, isLoaded, charts.length]);

  const handleChartChange = (index: number) => {
    if (index !== currentChart) {
      setCurrentChart(index);
      onChartChange?.(index);
    }
  };

  if (charts.length === 0) {
    return (
      <div className="bg-card rounded-xl p-4 md:p-8 shadow-lg">
        <div className="h-60 md:h-80 bg-muted/30 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={chartRef}
      className="bg-card rounded-xl p-4 md:p-8 shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={hasIntersected ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
      data-testid="chart-reveal-container"
    >
      {/* Chart Tabs */}
      <div className="flex justify-center mb-6 md:mb-8">
        <div className="bg-muted rounded-lg p-1 inline-flex flex-wrap gap-1 md:gap-0">
          {charts.map((chart, index) => (
            <motion.button
              key={index}
              onClick={() => handleChartChange(index)}
              className={cn(
                'px-2 md:px-4 py-2 rounded-md transition-all duration-200 text-xs md:text-sm relative min-w-0 flex-shrink',
                currentChart === index
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-background'
              )}
              data-testid={`chart-tab-${index}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {currentChart === index && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-md"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">{chart.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart Display */}
      <div className="relative">
        {isLoaded ? (
          <motion.div
            key={currentChart}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ 
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              staggerChildren: 0.1
            }}
          >
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <h3 className="font-display font-semibold text-lg md:text-xl" data-testid="chart-title">
                {charts[currentChart].name}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Interactive visualization with automated data refresh
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Chart 
                options={charts[currentChart].options}
                height="300px"
                className="rounded-lg border md:h-[400px]"
              />
            </motion.div>
          </motion.div>
        ) : (
          <div className="h-60 md:h-80 bg-muted/30 rounded-lg flex items-center justify-center">
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