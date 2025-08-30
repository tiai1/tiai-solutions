import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Search, ArrowRight, Star, Calendar, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Section from '@/components/Section';
import { trackPageView, trackButtonClick, trackDownload } from '@/lib/analytics';
import { tools, toolCategories, toolStats, type Tool } from '@/data/tools';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Tools() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  const { toast } = useToast();

  useEffect(() => {
    trackPageView('tools');
  }, []);

  useEffect(() => {
    let filtered = tools;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredTools(filtered);
  }, [selectedCategory, searchQuery]);

  const handleDownload = async (tool: Tool) => {
    trackDownload(tool.name);
    trackButtonClick('download-template', 'tools');
    
    // Track download with API
    try {
      await api.download({
        template_name: tool.name,
        email: 'user@example.com', // In real app, this would come from auth or form
        company: 'Demo User'
      });
    } catch (error) {
      console.error('Download tracking failed:', error);
    }

    toast({
      title: 'Download Started',
      description: `${tool.name} is being prepared for download.`,
    });

    // In a real implementation, this would trigger an actual file download
    // For demo purposes, we'll just show the success message
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      accent: 'bg-accent/10 text-accent border-accent/20',
      success: 'bg-green-500/10 text-green-500 border-green-500/20',
      purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
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
              data-testid="tools-page-title"
            >
              Tools & <span className="gradient-text">Templates</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              data-testid="tools-page-subtitle"
            >
              Ready-to-use automation tools and templates to jumpstart your data transformation.
              Professional-grade solutions you can implement immediately.
            </motion.p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {toolStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                className="text-center"
                data-testid={`tool-stat-${index}`}
              >
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Filters and Search */}
      <Section className="py-8 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tools and templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="search-tools"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48" data-testid="filter-category">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {toolCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* Tools Grid */}
      <Section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTools.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">No tools found matching your criteria</div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card 
                    className="h-full hover:shadow-xl transition-all duration-300 relative"
                    data-testid={`tool-card-${tool.id}`}
                  >
                    {tool.isPopular && (
                      <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full z-10">
                        POPULAR
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(tool.color)}`}>
                        {tool.icon}
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {tool.category}
                        </Badge>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <HardDrive className="h-3 w-3" />
                          <span>{tool.fileSize}</span>
                        </div>
                      </div>
                      
                      <CardTitle className="font-display text-xl mb-2" data-testid="tool-name">
                        {tool.name}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm" data-testid="tool-description">
                        {tool.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-3">Features:</h4>
                        <ul className="space-y-2 mb-6">
                          {tool.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start text-sm">
                              <Star className="h-4 w-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Updated {new Date(tool.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <Button
                          className={`w-full ${getColorClasses(tool.color).replace(/border-\w+-\w+\/\d+/, '')}`}
                          onClick={() => handleDownload(tool)}
                          data-testid="button-download-tool"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Get Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Newsletter Signup */}
      <Section className="section-padding bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-card p-12 rounded-2xl shadow-lg"
            data-testid="tools-newsletter-section"
          >
            <h2 className="font-display text-3xl font-bold mb-4" data-testid="newsletter-title">
              Get New Tools First
            </h2>
            <p className="text-muted-foreground mb-8" data-testid="newsletter-subtitle">
              Subscribe to receive new automation tools and templates as soon as they're released.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                type="email"
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => trackButtonClick('newsletter-signup', 'tools')}
                data-testid="button-newsletter-signup"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
