export type CallRequest = {
  full_name: string;
  email: string;
  company?: string;
  notes?: string;
  timezone: string;
  start_at: string; // ISO
  end_at: string;   // ISO
  source?: string;  // 'website' | 'home' | 'contact'
};

export type CallStatus = 'requested' | 'confirmed' | 'cancelled';

export type Call = CallRequest & {
  id: string;
  status: CallStatus;
  created_at: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  tags: string[];
  content: string;
};