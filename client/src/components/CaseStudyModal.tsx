import { ArrowRight, ExternalLink, Building, Calendar, Target, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { trackButtonClick } from '@/lib/analytics';

interface CaseStudyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseStudy: any; // Using any for now since we're working with existing data structure
}

export default function CaseStudyModal({ 
  open, 
  onOpenChange, 
  caseStudy 
}: CaseStudyModalProps) {
  if (!caseStudy) return null;

  const handleContactUs = () => {
    trackButtonClick('contact-from-case-study-modal', 'case-study-modal');
    window.location.href = `/contact?project=${encodeURIComponent(caseStudy.title)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="case-study-modal">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {caseStudy.industry || 'Case Study'}
            </Badge>
            {caseStudy.duration && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {caseStudy.duration}
              </div>
            )}
          </div>
          <DialogTitle className="text-2xl md:text-3xl font-display" data-testid="case-study-title">
            {caseStudy.title}
          </DialogTitle>
          <DialogDescription className="text-base" data-testid="case-study-summary">
            {caseStudy.summary}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Challenge & Solution */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Target className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="font-semibold">Challenge</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  {caseStudy.challenge || 'Streamlining complex business processes and improving data visibility for better decision-making.'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="font-semibold">Solution</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  {caseStudy.solution || 'Custom automation system with integrated dashboards, real-time reporting, and streamlined workflows.'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {caseStudy.results && (
            <div>
              <h3 className="font-semibold mb-4">Key Results</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {caseStudy.results.map((result: any, index: number) => (
                  <Card key={index} className="bg-muted/50">
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold text-${caseStudy.color || 'primary'} mb-1`}>
                        {result.value}
                      </div>
                      <div className="text-xs text-muted-foreground">{result.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {caseStudy.technologies && caseStudy.technologies.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {caseStudy.technologies.map((tech: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Client Quote */}
          {caseStudy.clientQuote && (
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <blockquote className="text-muted-foreground italic mb-4">
                  "{caseStudy.clientQuote.text}"
                </blockquote>
                <div className="font-semibold">
                  {caseStudy.clientQuote.author}, {caseStudy.clientQuote.role}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleContactUs}
              data-testid="button-start-similar-project"
            >
              <Building className="mr-2 h-4 w-4" />
              Start a Similar Project
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                trackButtonClick('download-case-study', 'case-study-modal');
                // In a real implementation, this would download a PDF
                alert('Case study download would be available with a real document management system.');
              }}
              data-testid="button-download-case-study"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Download Full Case Study
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}