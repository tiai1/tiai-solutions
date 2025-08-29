import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Section from '@/components/Section';
import ServiceCard from '@/components/ServiceCard';
import { trackPageView, trackButtonClick } from '@/lib/analytics';
import ScheduleCallModal from '@/components/ScheduleCallModal';
import { services, faqItems } from '@/data/services';

export default function Services() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  
  useEffect(() => {
    trackPageView('services');
  }, []);

  const handleServiceCTA = (tierName: string) => {
    trackButtonClick(`service-${tierName.toLowerCase()}`, 'services');
    // Navigate to contact with pre-filled service type
    window.location.href = `/contact?service=${encodeURIComponent(tierName)}`;
  };

  return (
    <div className="pt-16">
      {/* Header */}
      <Section className="section-padding bg-gradient-to-b from-muted/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h1 
              className="font-display text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              data-testid="services-page-title"
            >
              Automation <span className="gradient-text">Tiers</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              data-testid="services-page-subtitle"
            >
              From essential insights to advanced decision systems, we scale with your needs.
              Each tier builds upon the previous, creating a comprehensive automation ecosystem.
            </motion.p>
          </div>
        </div>
      </Section>

      {/* Service Tiers */}
      <Section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {services.tiers.map((tier, index) => (
              <ServiceCard
                key={index}
                title={tier.title}
                description={tier.description}
                features={tier.features}
                icon={tier.icon}
                color={tier.color as any}
                isPopular={tier.isPopular}
                ctaText={tier.ctaText}
                onCTAClick={() => handleServiceCTA(tier.title)}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Process Timeline */}
      <Section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="process-title">
              Our Automation Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="process-subtitle">
              A systematic approach to transforming your data operations.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: '01',
                  title: 'Assessment & Planning',
                  description: 'We analyze your current data processes, identify automation opportunities, and create a detailed implementation roadmap.',
                  duration: '1-2 weeks'
                },
                {
                  step: '02',
                  title: 'Foundation Building',
                  description: 'Set up clean data sources, establish KPI frameworks, and create the infrastructure for automation.',
                  duration: '2-3 weeks'
                },
                {
                  step: '03',
                  title: 'Automation Implementation',
                  description: 'Deploy automated workflows, create dynamic dashboards, and implement monitoring systems.',
                  duration: '3-6 weeks'
                },
                {
                  step: '04',
                  title: 'Testing & Optimization',
                  description: 'Validate accuracy, optimize performance, and train your team on the new automated systems.',
                  duration: '1-2 weeks'
                },
                {
                  step: '05',
                  title: 'Launch & Support',
                  description: 'Go live with full automation and provide ongoing support and enhancements.',
                  duration: 'Ongoing'
                }
              ].map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-6"
                  data-testid={`process-step-${index + 1}`}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {phase.step}
                  </div>
                  <div className="flex-1 bg-card p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display text-xl font-bold">{phase.title}</h3>
                      <span className="text-sm text-muted-foreground font-mono">{phase.duration}</span>
                    </div>
                    <p className="text-muted-foreground">{phase.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="faq-title">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="faq-subtitle">
              Everything you need to know about our automation solutions.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  <div className="flex items-center">
                    <HelpCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    {item.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* CTA */}
      <Section className="section-padding bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-card p-12 rounded-2xl shadow-lg"
            data-testid="services-cta-section"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" data-testid="services-cta-title">
              Ready to Start Your Automation Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8" data-testid="services-cta-subtitle">
              Choose the tier that fits your needs or let us recommend the best approach for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  trackButtonClick('get-recommendation', 'services-cta');
                  setIsScheduleModalOpen(true);
                }}
                data-testid="button-get-recommendation"
              >
                Get a Custom Recommendation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => trackButtonClick('view-case-studies', 'services-cta')}
                data-testid="button-view-case-studies"
              >
                View Case Studies
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>
      
      {/* Schedule Call Modal */}
      <ScheduleCallModal 
        open={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
        source="services"
      />
    </div>
  );
}
