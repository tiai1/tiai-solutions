import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ServiceFeature {
  title: string;
  description: string;
}

interface ServiceCardProps {
  title: string;
  description: string;
  features: ServiceFeature[];
  icon: React.ReactNode;
  color: 'primary' | 'accent' | 'success' | 'purple';
  isPopular?: boolean;
  ctaText: string;
  onCTAClick: () => void;
  delay?: number;
}

const colorClasses = {
  primary: {
    icon: 'bg-primary/10 text-primary',
    border: 'border-primary',
    button: 'bg-primary text-primary-foreground hover:bg-primary/90',
    badge: 'bg-primary/10 text-primary',
  },
  accent: {
    icon: 'bg-accent/10 text-accent',
    border: 'border-accent',
    button: 'bg-accent/10 text-accent hover:bg-accent/20',
    badge: 'bg-accent/10 text-accent',
  },
  success: {
    icon: 'bg-green-500/10 text-green-500',
    border: 'border-green-500',
    button: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    badge: 'bg-green-500/10 text-green-500',
  },
  purple: {
    icon: 'bg-purple-500/10 text-purple-500',
    border: 'border-purple-500',
    button: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
    badge: 'bg-purple-500/10 text-purple-500',
  },
};

export default function ServiceCard({ 
  title, 
  description, 
  features, 
  icon, 
  color,
  isPopular,
  ctaText,
  onCTAClick,
  delay = 0 
}: ServiceCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        'service-tier bg-card p-8 rounded-xl shadow-lg relative flex flex-col h-full',
        isPopular && `border-2 ${colors.border}`
      )}
      data-testid={`service-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className={cn(
          'absolute -top-3 left-1/2 transform -translate-x-1/2 text-xs px-3 py-1 rounded-full',
          colors.badge
        )}>
          POPULAR
        </div>
      )}

      <div className="text-center mb-6">
        <div className={cn('w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4', colors.icon)}>
          {icon}
        </div>
        <h3 className="font-display text-2xl font-bold mb-2" data-testid="service-title">
          {title}
        </h3>
        <p className="text-muted-foreground" data-testid="service-description">
          {description}
        </p>
      </div>
      
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: delay + index * 0.1 }}
            className="flex items-start"
            data-testid={`service-feature-${index}`}
          >
            <CheckCircle className="text-green-500 mr-3 mt-1 h-5 w-5 flex-shrink-0" />
            <div>
              <div className="font-semibold">{feature.title}</div>
              <div className="text-sm text-muted-foreground">{feature.description}</div>
            </div>
          </motion.li>
        ))}
      </ul>
      
      <Button 
        onClick={onCTAClick}
        className={cn('w-full', colors.button)}
        data-testid="service-cta-button"
      >
        {ctaText}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
}
