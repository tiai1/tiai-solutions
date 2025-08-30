import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/lib/viewport';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dataSection?: string;
  parallax?: boolean;
  delay?: number;
}

export default function Section({ 
  children, 
  className, 
  id, 
  dataSection, 
  parallax = false, 
  delay = 0 
}: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting, hasIntersected } = useIntersectionObserver(sectionRef);

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      data-section={dataSection}
      className={cn('relative', className)}
      initial={{ opacity: 0, y: 50 }}
      animate={hasIntersected ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={parallax ? {
        transform: isIntersecting ? 'translateY(0)' : 'translateY(20px)',
        transition: 'transform 0.6s ease-out'
      } : undefined}
    >
      {children}
    </motion.section>
  );
}
