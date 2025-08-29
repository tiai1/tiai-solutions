import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Section from '@/components/Section';
import ContactForm from '@/components/ContactForm';
import ScheduleCallModal from '@/components/ScheduleCallModal';
import { trackPageView, trackButtonClick } from '@/lib/analytics';

export default function Contact() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  useEffect(() => {
    trackPageView('contact');
  }, []);

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      label: 'Email',
      value: 'hello@tiai-solutions.com',
      href: 'mailto:hello@tiai-solutions.com',
      description: 'Primary contact for all inquiries'
    },
    {
      icon: <Phone className="h-6 w-6" />,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      description: 'Business hours: 9 AM - 6 PM PST'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      label: 'Location',
      value: 'San Francisco, CA',
      href: '#',
      description: 'Serving clients nationwide'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      label: 'Response Time',
      value: '< 24 hours',
      href: '#',
      description: 'Typical response time for inquiries'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Initial Consultation',
      description: 'We discuss your current data challenges and automation goals in a 30-minute discovery call.',
      duration: '30 minutes'
    },
    {
      step: '02',
      title: 'Assessment & Proposal',
      description: 'Our team analyzes your needs and provides a detailed proposal with timeline and investment.',
      duration: '2-3 days'
    },
    {
      step: '03',
      title: 'Project Kickoff',
      description: 'We begin implementation with clear milestones and regular progress updates.',
      duration: '1 week'
    },
    {
      step: '04',
      title: 'Delivery & Training',
      description: 'Complete solution delivery with comprehensive training and documentation.',
      duration: '2-8 weeks'
    }
  ];

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
              data-testid="contact-page-title"
            >
              Start Your <span className="gradient-text">Automation Journey</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              data-testid="contact-page-subtitle"
            >
              Ready to transform your data processes? Let's discuss your automation needs and 
              create a solution that drives real results for your organization.
            </motion.p>
          </div>
        </div>
      </Section>

      {/* Contact Form and Info */}
      <Section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-display text-3xl font-bold mb-6" data-testid="contact-form-title">
                  Tell Us About Your Project
                </h2>
                <ContactForm />
              </motion.div>
            </div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="font-display text-2xl font-bold mb-6" data-testid="contact-info-title">
                Get in Touch
              </h3>
              
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-primary">{info.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{info.label}</h4>
                        {info.href.startsWith('mailto:') || info.href.startsWith('tel:') ? (
                          <a 
                            href={info.href}
                            className="text-primary hover:text-primary/80 font-medium"
                            data-testid={`contact-${info.label.toLowerCase()}`}
                          >
                            {info.value}
                          </a>
                        ) : (
                          <div className="text-primary font-medium" data-testid={`contact-${info.label.toLowerCase()}`}>
                            {info.value}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Process Overview */}
      <Section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="process-title">
              How We Work Together
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="process-subtitle">
              Our proven process ensures successful automation implementation from discovery to delivery.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-6"
                  data-testid={`process-step-${index + 1}`}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1 bg-card p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display text-xl font-bold">{step.title}</h3>
                      <span className="text-sm text-muted-foreground font-mono">{step.duration}</span>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Preview */}
      <Section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-card p-12 rounded-2xl shadow-lg"
            data-testid="contact-faq-section"
          >
            <h2 className="font-display text-3xl font-bold mb-6" data-testid="contact-faq-title">
              Have Questions Before Starting?
            </h2>
            <p className="text-muted-foreground mb-8" data-testid="contact-faq-subtitle">
              Check our FAQ section for common questions about our automation solutions and process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  trackButtonClick('view-faq', 'contact');
                  window.location.href = '/services#faq';
                }}
                data-testid="button-view-faq"
              >
                View FAQ
              </Button>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  trackButtonClick('schedule-call', 'contact');
                  setIsScheduleModalOpen(true);
                }}
                data-testid="button-schedule-call"
              >
                Schedule a Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>
      
      {/* Schedule Call Modal */}
      <ScheduleCallModal 
        open={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
        source="contact"
      />
    </div>
  );
}
