import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, FileText, BarChart3, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    isDragging.current = true;
    setIsAutoPlaying(false); // Pause auto-play when user starts dragging
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const resetSlider = () => {
    setSliderPosition(0);
    setDirection(1);
    setIsAutoPlaying(true);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isDragging.current) {
      autoPlayInterval.current = setInterval(() => {
        setSliderPosition(prev => {
          const speed = 0.5; // Adjust speed here
          let newPosition = prev + (direction * speed);
          
          // Reverse direction at boundaries
          if (newPosition >= 100) {
            newPosition = 100;
            setDirection(-1);
          } else if (newPosition <= 0) {
            newPosition = 0;
            setDirection(1);
          }
          
          return newPosition;
        });
      }, 50); // Update every 50ms for smooth animation
    }

    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    };
  }, [isAutoPlaying, direction]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div 
        ref={containerRef}
        className="relative h-96 rounded-xl overflow-hidden cursor-ew-resize"
        data-testid="before-after-container"
      >
        {/* Before State */}
        <div className="absolute inset-0 bg-card border-2 border-red-500/20">
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-3 h-6 w-6" />
              <h3 className="font-display font-bold text-xl" data-testid="before-title">
                Before: Spreadsheet Chaos
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2 flex-1">
              {[
                { name: 'Q1_Sales_FINAL_v3.xlsx', status: 'Modified 2 weeks ago' },
                { name: 'Margins_Report_Copy.xlsx', status: 'Modified 1 month ago' },
                { name: 'KPI_Dashboard_Draft.xlsx', status: 'Modified 3 weeks ago' },
                { name: '❌ Formula Error', status: 'Manual calculation required', error: true },
                { name: 'Budget_vs_Actual.xlsx', status: 'Data missing' },
                { name: 'Weekly_Report.xlsx', status: 'Needs updating' },
              ].map((file, index) => (
                <div 
                  key={index}
                  className={cn(
                    'p-3 rounded text-sm',
                    file.error 
                      ? 'bg-red-500/20 border-2 border-red-500/50' 
                      : 'bg-red-500/10'
                  )}
                  data-testid={`before-file-${index}`}
                >
                  <div className="font-mono text-xs">{file.name}</div>
                  <div className="text-muted-foreground text-xs">{file.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* After State */}
        <motion.div 
          className="absolute inset-0 bg-card border-2 border-primary/20"
          style={{ 
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` 
          }}
          data-testid="after-state"
        >
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-center mb-4">
              <BarChart3 className="text-primary mr-3 h-6 w-6" />
              <h3 className="font-display font-bold text-xl" data-testid="after-title">
                After: Automated Dashboard
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="bg-primary/10 p-4 rounded-lg" data-testid="kpi-revenue">
                <div className="text-2xl font-bold text-primary mb-2">$2.4M</div>
                <div className="text-sm text-muted-foreground">Revenue (YTD)</div>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">+12%</span>
                </div>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg" data-testid="kpi-margin">
                <div className="text-2xl font-bold text-accent mb-2">24.5%</div>
                <div className="text-sm text-muted-foreground">Gross Margin</div>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">+2.1%</span>
                </div>
              </div>
              <div className="bg-green-500/10 p-4 rounded-lg" data-testid="kpi-accuracy">
                <div className="text-2xl font-bold text-green-500 mb-2">94%</div>
                <div className="text-sm text-muted-foreground">Forecast Accuracy</div>
              </div>
              <div className="bg-purple-500/10 p-4 rounded-lg" data-testid="kpi-time">
                <div className="text-2xl font-bold text-purple-500 mb-2">15min</div>
                <div className="text-sm text-muted-foreground">Report Generation</div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Slider Handle */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 z-10 w-1 h-16 bg-primary rounded-full cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          data-testid="slider-handle"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full border-3 border-white shadow-lg" />
        </div>
      </div>
      
      {/* Control Buttons */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={toggleAutoPlay}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          data-testid="auto-play-toggle"
        >
          {isAutoPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Play</span>
            </>
          )}
        </button>
        
        <button
          onClick={resetSlider}
          className="flex items-center space-x-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
          data-testid="reset-slider"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
