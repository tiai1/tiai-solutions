import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIStatProps {
  value: string;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'accent' | 'success' | 'purple';
  delay?: number;
}

const colorClasses = {
  primary: 'text-primary bg-primary/10',
  accent: 'text-accent bg-accent/10', 
  success: 'text-green-500 bg-green-500/10',
  purple: 'text-purple-500 bg-purple-500/10',
};

export default function KPIStat({ 
  value, 
  label, 
  trend = 'neutral', 
  trendValue, 
  color = 'primary',
  delay = 0 
}: KPIStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'p-6 rounded-xl border hover:border-primary/50 transition-all duration-300 hover:shadow-lg',
        colorClasses[color]
      )}
      data-testid={`kpi-stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={cn('text-3xl font-bold mb-2', colorClasses[color].split(' ')[0])}>
        {value}
      </div>
      <div className="text-sm text-muted-foreground mb-2">
        {label}
      </div>
      {trend !== 'neutral' && trendValue && (
        <div className="flex items-center">
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={cn(
            'text-sm font-medium',
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          )}>
            {trendValue}
          </span>
        </div>
      )}
    </motion.div>
  );
}
