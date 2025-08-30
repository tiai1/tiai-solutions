import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Bot, Database, Brain, CheckCircle, Users, Award, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Section from '@/components/Section';
import { trackPageView, trackButtonClick } from '@/lib/analytics';

export default function About() {
  useEffect(() => {
    trackPageView('about');
  }, []);

  const expertise = [
    {
      title: 'Financial Analytics',
      description: 'KPI dashboards, margin analysis, and budget planning automation',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'primary'
    },
    {
      title: 'Process Automation',
      description: 'VBA scripting, Power Automate flows, and report generation',
      icon: <Bot className="h-6 w-6" />,
      color: 'accent'
    },
    {
      title: 'Data Integration',
      description: 'Power Query pipelines and multi-source data consolidation',
      icon: <Database className="h-6 w-6" />,
      color: 'success'
    },
    {
      title: 'Decision Systems',
      description: 'Scenario modeling, optimization, and predictive analytics',
      icon: <Brain className="h-6 w-6" />,
      color: 'purple'
    }
  ];

  const companyStats = [
    { value: '50+', label: 'Projects Completed', icon: <Target className="h-6 w-6" /> },
    { value: '200+', label: 'Hours Saved Weekly', icon: <Clock className="h-6 w-6" /> },
    { value: '95%', label: 'Client Satisfaction', icon: <Award className="h-6 w-6" /> },
    { value: '24hr', label: 'Response Time', icon: <Users className="h-6 w-6" /> },
  ];

  const values = [
    {
      title: 'Automation First',
      description: 'We believe every manual process is an opportunity for improvement. Our solutions prioritize automation to eliminate repetitive tasks and reduce human error.',
      icon: <Bot className="h-8 w-8" />
    },
    {
      title: 'Data-Driven Decisions',
      description: 'Numbers tell stories, but only when properly analyzed. We transform raw data into actionable insights that drive strategic decisions.',
      icon: <BarChart3 className="h-8 w-8" />
    },
    {
      title: 'Practical Excellence',
      description: 'We build on familiar tools like Excel and Power BI, ensuring solutions are powerful yet accessible to your entire team.',
      icon: <CheckCircle className="h-8 w-8" />
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
              data-testid="about-page-title"
            >
              About <span className="gradient-text">TIAI Solutions</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              data-testid="about-page-subtitle"
            >
              We're automation specialists who believe data should drive decisions, not consume time.
            </motion.p>
          </div>
        </div>
      </Section>

      {/* Mission and Story */}
      <Section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-4xl font-bold mb-6" data-testid="mission-title">
                Our Mission
              </h2>
              <p className="text-muted-foreground mb-6" data-testid="mission-description">
                At TIAI Solutions, we transform how businesses interact with their data. Our automation-first approach 
                eliminates manual processes, reduces errors, and provides real-time insights that drive strategic decisions.
              </p>
              <p className="text-muted-foreground mb-8">
                We specialize in creating sophisticated yet user-friendly automation solutions using familiar tools 
                like Excel, Power BI, and VBA, combined with modern cloud technologies for scalable, reliable performance.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {companyStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                    data-testid={`company-stat-${index}`}
                  >
                    <div className="text-primary mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="font-display text-2xl font-bold mb-6" data-testid="expertise-title">
                Our Expertise
              </h3>
              
              <div className="space-y-4">
                {expertise.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start p-4 bg-card rounded-lg shadow-sm"
                    data-testid={`expertise-item-${index}`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-${item.color}/10 text-${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="values-title">
              What Drives Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="values-subtitle">
              Our core principles guide every project and client relationship.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full text-center p-8" data-testid={`value-card-${index}`}>
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-primary">{value.icon}</div>
                    </div>
                    <CardTitle className="font-display text-xl mb-4">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Team Section */}
      <Section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="team-title">
              Meet the Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="team-subtitle">
              Experienced professionals with deep expertise in business automation and data analytics.
            </p>
          </div>
          
          <div className="bg-card p-12 rounded-2xl shadow-lg text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-4" data-testid="team-intro-title">
              Automation Specialists
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our team combines deep technical expertise with practical business knowledge. We understand 
              both the complexities of enterprise data and the need for user-friendly solutions that teams 
              can actually adopt and maintain.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-muted/50 p-6 rounded-lg">
                <BarChart3 className="h-8 w-8 text-primary mb-4" />
                <h4 className="font-semibold mb-2">Business Intelligence</h4>
                <p className="text-sm text-muted-foreground">
                  15+ years in financial modeling, KPI design, and dashboard automation
                </p>
              </div>
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <Bot className="h-8 w-8 text-accent mb-4" />
                <h4 className="font-semibold mb-2">Process Automation</h4>
                <p className="text-sm text-muted-foreground">
                  Expert-level VBA, Power Query, and Power Automate implementation
                </p>
              </div>
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <Brain className="h-8 w-8 text-green-500 mb-4" />
                <h4 className="font-semibold mb-2">Advanced Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Statistical modeling, optimization, and predictive analytics expertise
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="section-padding bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-primary/10 via-accent/5 to-purple-500/10 p-12 rounded-2xl"
            data-testid="about-cta-section"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" data-testid="about-cta-title">
              Ready to Work Together?
            </h2>
            <p className="text-xl text-muted-foreground mb-8" data-testid="about-cta-subtitle">
              Let's discuss how our automation expertise can transform your data processes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => trackButtonClick('start-conversation', 'about-cta')}
                data-testid="button-start-conversation"
              >
                Start the Conversation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => trackButtonClick('view-case-studies-from-about', 'about-cta')}
                data-testid="button-view-case-studies-from-about"
              >
                View Our Work
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
