import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Calendar, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Section from '@/components/Section';
import TestimonialCard from '@/components/TestimonialCard';
import { trackPageView, trackButtonClick } from '@/lib/analytics';
import { caseStudies, caseStudyStats } from '@/data/caseStudies';

export default function CaseStudies() {
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null);

  useEffect(() => {
    trackPageView('case-studies');
  }, []);

  const handleLearnMore = (studyId: string) => {
    setSelectedStudy(studyId);
    trackButtonClick('case-study-details', 'case-studies');
  };

  const handleContactUs = (studyTitle: string) => {
    trackButtonClick('contact-from-case-study', 'case-studies');
    window.location.href = `/contact?interest=${encodeURIComponent(studyTitle)}`;
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
              data-testid="case-studies-page-title"
            >
              Success <span className="gradient-text">Stories</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              data-testid="case-studies-page-subtitle"
            >
              Real automation solutions that transformed how our clients work with data.
              See the measurable impact of our automation-first approach.
            </motion.p>
          </div>
        </div>
      </Section>

      {/* Case Study Statistics */}
      <Section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {caseStudyStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
                data-testid={`case-study-stat-${index}`}
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Case Studies Grid */}
      <Section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card 
                  className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleLearnMore(study.id)}
                  data-testid={`case-study-card-${study.id}`}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 bg-${study.color}/10 rounded-lg flex items-center justify-center mb-4`}>
                      {study.icon}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {study.industry}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {study.timeline}
                      </div>
                    </div>
                    <CardTitle className="font-display text-xl mb-2" data-testid="case-study-title">
                      {study.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm" data-testid="case-study-subtitle">
                      {study.subtitle}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-6" data-testid="case-study-description">
                      {study.description}
                    </p>
                    
                    <div className="space-y-4 mb-6">
                      {study.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{result.metric}</span>
                          <span className="font-semibold">{result.value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {study.technologies.slice(0, 3).map((tech, techIndex) => (
                          <Badge 
                            key={techIndex} 
                            variant="outline" 
                            className={`text-xs bg-${study.color}/10 text-${study.color} border-${study.color}/20`}
                          >
                            {tech}
                          </Badge>
                        ))}
                        {study.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{study.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        className={`w-full text-${study.color} hover:bg-${study.color}/10`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLearnMore(study.id);
                        }}
                        data-testid="button-view-case-study"
                      >
                        View Case Study
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Detailed Case Study Modal/Section */}
      {selectedStudy && (
        <Section className="section-padding bg-muted/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {(() => {
              const study = caseStudies.find(s => s.id === selectedStudy);
              if (!study) return null;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="bg-card p-8 rounded-xl shadow-lg"
                  data-testid="case-study-detail"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-display text-3xl font-bold mb-2" data-testid="case-study-detail-title">
                        {study.title}
                      </h2>
                      <p className="text-muted-foreground">{study.subtitle}</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedStudy(null)}
                      data-testid="button-close-case-study"
                    >
                      ×
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Target className="h-5 w-5 mr-2 text-red-500" />
                        Challenge
                      </h3>
                      <p className="text-muted-foreground text-sm">{study.challenge}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-blue-500" />
                        Solution
                      </h3>
                      <p className="text-muted-foreground text-sm">{study.solution}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Results</h3>
                      <div className="space-y-3">
                        {study.results.map((result, index) => (
                          <div key={index} className="bg-muted/50 p-3 rounded-lg">
                            <div className={`text-lg font-bold text-${study.color} mb-1`}>
                              {result.value}
                            </div>
                            <div className="text-xs text-muted-foreground">{result.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {study.clientQuote && (
                    <div className="bg-muted/50 p-6 rounded-lg mb-8">
                      <blockquote className="text-muted-foreground italic mb-4">
                        "{study.clientQuote.text}"
                      </blockquote>
                      <div className="font-semibold">
                        {study.clientQuote.author}, {study.clientQuote.role}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-8">
                    {study.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleContactUs(study.title)}
                      data-testid="button-contact-similar-project"
                    >
                      Start a Similar Project
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => trackButtonClick('download-case-study', 'case-studies')}
                      data-testid="button-download-case-study"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Download Full Case Study
                    </Button>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </Section>
      )}

      {/* CTA Section */}
      <Section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-primary/10 via-accent/5 to-purple-500/10 p-12 rounded-2xl"
            data-testid="case-studies-cta-section"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" data-testid="case-studies-cta-title">
              Ready for Your Success Story?
            </h2>
            <p className="text-xl text-muted-foreground mb-8" data-testid="case-studies-cta-subtitle">
              Let's discuss how we can create a similar transformation for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => trackButtonClick('start-project-from-cases', 'case-studies-cta')}
                data-testid="button-start-project-from-cases"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => trackButtonClick('view-tools-from-cases', 'case-studies-cta')}
                data-testid="button-view-tools-from-cases"
              >
                Explore Our Tools
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
