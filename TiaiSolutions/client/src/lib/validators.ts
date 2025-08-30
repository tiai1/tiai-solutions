import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100, 'Company name too long').optional(),
  role: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  timeframe: z.string().optional(),
  budget: z.string().optional(),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const downloadFormSchema = z.object({
  template_name: z.string().min(1, 'Template name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100, 'Company name too long').optional(),
});

export type DownloadFormData = z.infer<typeof downloadFormSchema>;
