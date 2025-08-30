import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating?: number;
  delay?: number;
}

export default function TestimonialCard({ 
  name, 
  role, 
  company, 
  content, 
  rating = 5, 
  delay = 0 
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      data-testid={`testimonial-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Rating */}
      <div className="flex items-center mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      
      {/* Content */}
      <blockquote className="text-muted-foreground mb-6 italic" data-testid="testimonial-content">
        "{content}"
      </blockquote>
      
      {/* Author */}
      <div className="flex items-center">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-semibold" data-testid="testimonial-name">{name}</div>
          <div className="text-sm text-muted-foreground" data-testid="testimonial-role">
            {role}, {company}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
