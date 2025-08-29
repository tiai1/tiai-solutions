export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  message: string;
  timeframe?: string;
  budget?: string;
  honeypot?: string;
};

export type LeadPayload = {
  source: string;
  payload: Record<string, any>;
};

export type DownloadPayload = {
  template_name: string;
  email: string;
  company?: string;
};

export interface APIClient {
  contact(data: ContactPayload): Promise<{ success: boolean; message?: string; error?: string }>;
  lead(data: LeadPayload): Promise<{ success: boolean; leadId?: string; error?: string }>;
  download(data: DownloadPayload): Promise<{ success: boolean; downloadId?: string; error?: string }>;
  health(): Promise<{ status: string; timestamp: string }>;
}

function createMockAPI(): APIClient {
  return {
    async contact(data: ContactPayload) {
      console.log('[MOCK] Contact submission:', data);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate occasional failures for testing
      if (Math.random() < 0.1) {
        return { success: false, error: 'Mock API: Simulated server error' };
      }
      
      return { 
        success: true, 
        message: 'Thank you for your message. We\'ll respond within 24 hours.' 
      };
    },

    async lead(data: LeadPayload) {
      console.log('[MOCK] Lead tracking:', data);
      await new Promise(resolve => setTimeout(resolve, 200));
      return { success: true, leadId: `mock-${Date.now()}` };
    },

    async download(data: DownloadPayload) {
      console.log('[MOCK] Download tracking:', data);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, downloadId: `mock-${Date.now()}` };
    },

    async health() {
      return { status: 'healthy', timestamp: new Date().toISOString() };
    }
  };
}

function createSupabaseAPI(): APIClient {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing, falling back to mock API');
    return createMockAPI();
  }

  const baseUrl = `${supabaseUrl}/functions/v1`;

  return {
    async contact(data: ContactPayload) {
      try {
        const response = await fetch(`${baseUrl}/contact-form`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.text();
          return { success: false, error };
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Supabase API error:', error);
        return { success: false, error: 'Network error. Please try again.' };
      }
    },

    async lead(data: LeadPayload) {
      try {
        const response = await fetch(`${baseUrl}/lead-intake`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.text();
          return { success: false, error };
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Supabase lead API error:', error);
        return { success: false, error: 'Network error' };
      }
    },

    async download(data: DownloadPayload) {
      // For downloads, we might just track the event and return a direct link
      await this.lead({ source: 'template_download', payload: data });
      return { success: true, downloadId: `download-${Date.now()}` };
    },

    async health() {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
          },
        });
        return { status: response.ok ? 'healthy' : 'error', timestamp: new Date().toISOString() };
      } catch (error) {
        return { status: 'error', timestamp: new Date().toISOString() };
      }
    }
  };
}

function createCloudflareAPI(): APIClient {
  const baseUrl = import.meta.env.VITE_CLOUDFLARE_API_BASE;
  
  if (!baseUrl) {
    console.warn('Cloudflare API base URL missing, falling back to mock API');
    return createMockAPI();
  }

  return {
    async contact(data: ContactPayload) {
      try {
        const response = await fetch(`${baseUrl}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.text();
          return { success: false, error };
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Cloudflare API error:', error);
        return { success: false, error: 'Network error. Please try again.' };
      }
    },

    async lead(data: LeadPayload) {
      try {
        const response = await fetch(`${baseUrl}/lead`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.text();
          return { success: false, error };
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Cloudflare lead API error:', error);
        return { success: false, error: 'Network error' };
      }
    },

    async download(data: DownloadPayload) {
      await this.lead({ source: 'template_download', payload: data });
      return { success: true, downloadId: `download-${Date.now()}` };
    },

    async health() {
      try {
        const response = await fetch(`${baseUrl}/health`);
        const result = await response.json();
        return result;
      } catch (error) {
        return { status: 'error', timestamp: new Date().toISOString() };
      }
    }
  };
}

export function createAPI(): APIClient {
  const provider = import.meta.env.VITE_API_PROVIDER || 'mock';
  
  console.log(`[API] Using provider: ${provider}`);
  
  switch (provider) {
    case 'supabase':
      return createSupabaseAPI();
    case 'cloudflare':
      return createCloudflareAPI();
    default:
      return createMockAPI();
  }
}

export const api = createAPI();

// Data fetchers for JSON files
export async function fetchCharts() {
  try {
    const response = await fetch('/data/charts.json');
    if (!response.ok) {
      throw new Error('Failed to fetch charts data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching charts:', error);
    return null;
  }
}

export async function fetchServices() {
  try {
    const response = await fetch('/data/services.json');
    if (!response.ok) {
      throw new Error('Failed to fetch services data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    return null;
  }
}

export async function fetchCaseStudies() {
  try {
    const response = await fetch('/data/caseStudies.json');
    if (!response.ok) {
      throw new Error('Failed to fetch case studies data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return null;
  }
}

export async function fetchTools() {
  try {
    const response = await fetch('/data/tools.json');
    if (!response.ok) {
      throw new Error('Failed to fetch tools data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tools:', error);
    return null;
  }
}

export async function fetchTestimonials() {
  try {
    const response = await fetch('/data/testimonials.json');
    if (!response.ok) {
      throw new Error('Failed to fetch testimonials data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return null;
  }
}
