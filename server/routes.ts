import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertLeadSchema, insertDownloadSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Rate limiting store (simple in-memory for demo)
  const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  // Simple rate limiting middleware
  const rateLimit = (maxRequests = 5, windowMs = 60000) => {
    return (req: any, res: any, next: any) => {
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();
      const windowKey = `${clientIP}:${Math.floor(now / windowMs)}`;
      
      const current = rateLimitStore.get(windowKey) || { count: 0, resetTime: now + windowMs };
      
      if (current.count >= maxRequests) {
        return res.status(429).json({ 
          error: 'Too many requests. Please try again later.' 
        });
      }
      
      current.count++;
      rateLimitStore.set(windowKey, current);
      
      // Clean up old entries
      Array.from(rateLimitStore.entries()).forEach(([key, value]) => {
        if (value.resetTime < now) {
          rateLimitStore.delete(key);
        }
      });
      
      next();
    };
  };

  // CORS middleware for API routes
  app.use('/api/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Contact form endpoint
  app.post('/api/contact', rateLimit(5, 300000), async (req, res) => {
    try {
      // Honeypot check
      if (req.body.honeypot && req.body.honeypot.trim() !== '') {
        return res.status(400).json({ error: 'Spam detected' });
      }

      // Validate input
      const validatedData = insertContactSchema.parse(req.body);
      
      // Create contact
      const contact = await storage.createContact(validatedData);
      
      // Log lead for analytics
      await storage.createLead({
        source: 'contact_form',
        payload: { contactId: contact.id, ...validatedData }
      });

      // TODO: Send email notification using Resend API
      // This would be implemented with the Resend API key from environment
      console.log('Contact form submission:', contact);
      
      res.json({ 
        success: true, 
        message: 'Thank you for your message. We\'ll respond within 24 hours.' 
      });
    } catch (error) {
      console.error('Contact form error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Invalid form data', 
          details: error.errors 
        });
      }
      
      res.status(500).json({ 
        error: 'Something went wrong. Please try again or email us directly.' 
      });
    }
  });

  // Lead tracking endpoint
  app.post('/api/lead', rateLimit(10, 60000), async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      
      res.json({ success: true, leadId: lead.id });
    } catch (error) {
      console.error('Lead tracking error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Invalid lead data', 
          details: error.errors 
        });
      }
      
      res.status(500).json({ error: 'Failed to track lead' });
    }
  });

  // Download tracking endpoint
  app.post('/api/download', rateLimit(10, 60000), async (req, res) => {
    try {
      const validatedData = insertDownloadSchema.parse(req.body);
      const download = await storage.createDownload(validatedData);
      
      res.json({ success: true, downloadId: download.id });
    } catch (error) {
      console.error('Download tracking error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Invalid download data', 
          details: error.errors 
        });
      }
      
      res.status(500).json({ error: 'Failed to track download' });
    }
  });

  // Serve JSON data files
  app.get('/data/:filename', async (req, res) => {
    try {
      const filename = req.params.filename;
      if (!filename.endsWith('.json')) {
        return res.status(400).json({ error: 'Only JSON files are allowed' });
      }
      
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const filePath = path.resolve(import.meta.dirname, "..", "public", "data", filename);
      const data = await fs.readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(data);
      
      res.json(jsonData);
    } catch (error) {
      console.error('Error serving data file:', error);
      res.status(404).json({ error: 'File not found' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
