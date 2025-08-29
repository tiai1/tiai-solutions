import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, User, Building, MessageSquare, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createCall } from '@/lib/api';
import type { CallRequest } from '../types';

const scheduleSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  notes: z.string().optional(),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  duration: z.string().default('30'),
  timezone: z.string().min(1, 'Timezone is required'),
});

type ScheduleForm = z.infer<typeof scheduleSchema>;

interface ScheduleCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
}

// Generate time slots (9 AM - 5 PM, 30-minute intervals)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const display = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      slots.push({ value: time, label: display });
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Get user's timezone
const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Generate ICS file content
const generateICS = (callRequest: CallRequest, callId: string) => {
  const start = new Date(callRequest.start_at).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = new Date(callRequest.end_at).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TIAI Solutions//Schedule Call//EN
BEGIN:VEVENT
UID:tiai-call-${callId}@tiai-solutions.com
DTSTAMP:${now}
DTSTART:${start}
DTEND:${end}
SUMMARY:Intro Call — TIAI Solutions
DESCRIPTION:Discovery call to discuss your automation needs.${callRequest.notes ? '\\n\\nNotes: ' + callRequest.notes : ''}
LOCATION:Online (details will be sent via email)
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;
};

// Download ICS file
const downloadICS = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function ScheduleCallModal({ 
  open, 
  onOpenChange,
  source = 'website' 
}: ScheduleCallModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<CallRequest | null>(null);
  const { toast } = useToast();

  const form = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      full_name: '',
      email: '',
      company: '',
      notes: '',
      date: '',
      time: '',
      duration: '30',
      timezone: getUserTimezone(),
    },
  });

  const onSubmit = async (values: ScheduleForm) => {
    setIsSubmitting(true);
    
    try {
      // Combine date and time into start/end timestamps
      const startDateTime = new Date(`${values.date}T${values.time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + parseInt(values.duration) * 60 * 1000);
      
      const callRequest: CallRequest = {
        full_name: values.full_name,
        email: values.email,
        company: values.company,
        notes: values.notes,
        timezone: values.timezone,
        start_at: startDateTime.toISOString(),
        end_at: endDateTime.toISOString(),
        source,
      };

      const id = await createCall(callRequest);
      
      setCallId(id);
      setSubmittedRequest(callRequest);
      setIsSuccess(true);
      
      toast({
        title: 'Call Scheduled Successfully!',
        description: 'We\'ll send you a calendar invitation and confirmation email shortly.',
      });
      
    } catch (error) {
      console.error('Error scheduling call:', error);
      toast({
        title: 'Scheduling Failed',
        description: 'Please try again or contact us directly at hello@tiai-solutions.com',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCalendar = () => {
    if (callId && submittedRequest) {
      const icsContent = generateICS(submittedRequest, callId);
      downloadICS(icsContent, 'TIAI-Call.ics');
      
      toast({
        title: 'Calendar Event Downloaded',
        description: 'The calendar event has been saved to your downloads.',
      });
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setCallId(null);
    setSubmittedRequest(null);
    form.reset();
    onOpenChange(false);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Get maximum date (30 days from now)
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md" data-testid="schedule-success-modal">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              Call Scheduled Successfully! 🎉
            </DialogTitle>
            <DialogDescription className="text-center">
              We'll send you a calendar invitation and confirmation email shortly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 pt-4">
            <Button
              onClick={handleDownloadCalendar}
              className="w-full"
              data-testid="button-download-calendar"
            >
              <Download className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Didn't receive an email? Contact us at:</p>
              <a 
                href="mailto:hello@tiai-solutions.com" 
                className="text-primary hover:underline"
                data-testid="link-contact-email"
              >
                hello@tiai-solutions.com
              </a>
            </div>
            
            <Button variant="outline" onClick={handleClose} data-testid="button-close-success">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" data-testid="schedule-call-modal">
        <DialogHeader>
          <DialogTitle>Schedule a Call</DialogTitle>
          <DialogDescription>
            Book a 30-minute discovery call to discuss your automation needs.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="John Doe" 
                          className="pl-10" 
                          {...field} 
                          data-testid="input-full-name"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="john@company.com" 
                        {...field} 
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Your Company" 
                        className="pl-10" 
                        {...field} 
                        data-testid="input-company"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date & Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="date" 
                          min={today}
                          max={maxDate}
                          className="pl-10" 
                          {...field} 
                          data-testid="input-date"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                          <SelectTrigger className="pl-10" data-testid="select-time">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      readOnly
                      className="bg-muted"
                      data-testid="input-timezone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea 
                        placeholder="Tell us about your automation needs..." 
                        className="pl-10 min-h-[80px]" 
                        {...field} 
                        data-testid="textarea-notes"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
                data-testid="button-schedule-call"
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Call'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}