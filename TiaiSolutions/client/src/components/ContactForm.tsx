import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { contactFormSchema, type ContactFormData } from '@/lib/validators';
import { api } from '@/lib/api';
import { trackFormSubmission } from '@/lib/analytics';
import { Loader2, Send } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      role: '',
      message: '',
      timeframe: '',
      budget: '',
      honeypot: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const result = await api.contact(data);
      
      if (result.success) {
        toast({
          title: 'Message sent successfully!',
          description: result.message || 'We\'ll respond within 24 hours.',
        });
        
        form.reset();
        trackFormSubmission('contact', true);
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      toast({
        variant: 'destructive',
        title: 'Failed to send message',
        description: error instanceof Error ? error.message : 'Please try again or email us directly.',
      });
      
      trackFormSubmission('contact', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-card p-8 rounded-xl shadow-lg max-w-4xl mx-auto"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              {...form.register('name')}
              placeholder="Your name"
              className="mt-2"
              data-testid="input-name"
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              {...form.register('email')}
              type="email"
              placeholder="your.email@company.com"
              className="mt-2"
              data-testid="input-email"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Company Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              {...form.register('company')}
              placeholder="Your company"
              className="mt-2"
              data-testid="input-company"
            />
          </div>
          
          <div>
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => form.setValue('role', value)}>
              <SelectTrigger className="mt-2" data-testid="select-role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="finance">Finance Leader</SelectItem>
                <SelectItem value="operations">Operations Manager</SelectItem>
                <SelectItem value="analyst">Data Analyst</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Project Description */}
        <div>
          <Label htmlFor="message">Project Description *</Label>
          <Textarea
            {...form.register('message')}
            placeholder="Describe your current data challenges and automation goals..."
            rows={4}
            className="mt-2"
            data-testid="textarea-message"
          />
          {form.formState.errors.message && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.message.message}</p>
          )}
        </div>

        {/* Project Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="timeframe">Project Timeframe</Label>
            <Select onValueChange={(value) => form.setValue('timeframe', value)}>
              <SelectTrigger className="mt-2" data-testid="select-timeframe">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate (&lt; 1 month)</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="half-year">Next 6 months</SelectItem>
                <SelectItem value="year">Within a year</SelectItem>
                <SelectItem value="exploring">Just exploring</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="budget">Budget Range</Label>
            <Select onValueChange={(value) => form.setValue('budget', value)}>
              <SelectTrigger className="mt-2" data-testid="select-budget">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-10k">Under $10K</SelectItem>
                <SelectItem value="10k-25k">$10K - $25K</SelectItem>
                <SelectItem value="25k-50k">$25K - $50K</SelectItem>
                <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                <SelectItem value="over-100k">Over $100K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Honeypot field for spam protection */}
        <div style={{ display: 'none' }}>
          <Input {...form.register('honeypot')} tabIndex={-1} autoComplete="off" />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-4 text-lg font-semibold hover:bg-primary/90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-submit-contact"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Send Message
            </>
          )}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          We'll respond within 24 hours with next steps and a proposed approach.
        </p>
      </form>
    </motion.div>
  );
}
