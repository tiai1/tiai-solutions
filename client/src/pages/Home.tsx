import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Section from '@/components/Section';
import BeforeAfter from '@/components/BeforeAfter';
import ChartReveal from '@/components/ChartReveal';
import ServiceCard from '@/components/ServiceCard';
import TestimonialCard from '@/components/TestimonialCard';
import { trackPageView, trackButtonClick } from '@/lib/analytics';
import { salesTrend, marginBridge, forecastVsActual } from '@/data/charts';
import { services } from '@/data/services';
import { testimonials } from '@/data/testimonials';

export default function Home() {
  const [activeChart, setActiveChart] = useState(0);
  
  const charts = [
    { name: 'Sales Trend', data: salesTrend, type: 'bar' as const },
    { name: 'Plan vs Actual', data: marginBridge, type: 'waterfall' as const },
    { name: 'Forecast Accuracy', data: forecastVsActual, type: 'line' as const },
  ];

  useEffect(() => {
    trackPageView('home');
  }, []);

  return (
    <div className="pt-16">
      {/* Scene 1: Hero */}
      <Section 
        id="hero" 
        dataSection="hero" 
        className="min-h-screen flex items-center justify-center relative particle-bg hero-gradient"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6" data-testid="hero-title">
              <span className="block">From Data</span>
              <span className="block gradient-text">to Decisions</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12" data-testid="hero-subtitle">
              Automation-first consulting that turns your numbers into momentum.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/contact">
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold hover:bg-primary/90 transition-all transform hover:scale-105"
                onClick={() => trackButtonClick('start-project', 'hero')}
                data-testid="button-start-project"
              >
                Start a Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="border-border text-foreground px-8 py-4 text-lg font-semibold hover:bg-muted transition-all"
              onClick={() => trackButtonClick('see-dashboards', 'hero')}
              data-testid="button-see-dashboards"
            >
              <Play className="mr-2 h-5 w-5" />
              See Live Dashboards
            </Button>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            data-testid="scroll-indicator"
          >
            <ChevronDown className="text-muted-foreground h-6 w-6" />
          </motion.div>
        </motion.div>
      </Section>

      {/* Scene 2: Problem → Shift */}
      <Section 
        id="problem" 
        dataSection="problem" 
        className="section-padding bg-muted/50"
        delay={0.2}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="problem-title">
              Transform Your Data Chaos
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="problem-subtitle">
              Move from scattered spreadsheets to automated insights that drive action.
            </p>
          </div>
          
          <BeforeAfter />
        </div>
      </Section>

      {/* Scene 3: Capabilities Carousel */}
      <Section 
        id="capabilities" 
        dataSection="capabilities" 
        className="section-padding"
        delay={0.3}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="capabilities-title">
              Automated Intelligence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="capabilities-subtitle">
              From KPI dashboards to cost control systems, we automate what matters most.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.capabilities.map((capability: any, index: number) => (
              <ServiceCard
                key={index}
                title={capability.title}
                description={capability.description}
                features={capability.features}
                icon={capability.icon}
                color={capability.color as any}
                ctaText="Learn More"
                onCTAClick={() => {
                  trackButtonClick('capability-learn-more', 'capabilities');
                  // Navigate to services page or show more details
                }}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Scene 4: Animated Charts */}
      <Section 
        id="charts" 
        dataSection="charts" 
        className="section-padding bg-muted/50"
        delay={0.4}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="charts-title">
              Data That Drives Decisions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="charts-subtitle">
              Interactive visualizations that reveal insights and guide strategic choices.
            </p>
          </div>
          
          <ChartReveal
            charts={charts}
            activeChart={activeChart}
            onChartChange={setActiveChart}
          />
        </div>
      </Section>

      {/* Scene 5: Social Proof + CTA */}
      <Section 
        id="testimonials" 
        dataSection="testimonials" 
        className="section-padding"
        delay={0.5}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="testimonials-title">
              Trusted by Data Leaders
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="testimonials-subtitle">
              See how automation has transformed decision-making for our clients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial: any, index: number) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                company={testimonial.company}
                content={testimonial.content}
                rating={testimonial.rating}
                delay={index * 0.1}
              />
            ))}
          </div>
          
          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center bg-gradient-to-r from-primary/10 via-accent/5 to-purple-500/10 p-12 rounded-2xl"
            data-testid="final-cta-section"
          >
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4" data-testid="cta-title">
              Let's automate what slows you down
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="cta-subtitle">
              Transform your data processes from manual to automated. Get insights that drive decisions, not just reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button 
                  size="lg"
                  className="bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold hover:bg-primary/90 transition-all transform hover:scale-105"
                  onClick={() => trackButtonClick('start-automation-journey', 'final-cta')}
                  data-testid="button-start-automation-journey"
                >
                  Start Your Automation Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="border-border text-foreground px-8 py-4 text-lg font-semibold hover:bg-muted transition-all"
                onClick={() => trackButtonClick('schedule-demo', 'final-cta')}
                data-testid="button-schedule-demo"
              >
                Schedule a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
