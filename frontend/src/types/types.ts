export interface Project {
  id: string;
  title: string;
  slug: string; // UNIQUE
  description: string;
  key_features: string[];
  github_url: string;
  live_demo_url: string;
  is_live: boolean;
  is_published: boolean;
  is_featured:boolean;
  technologies: string[];
  type: 'personal' | 'client' | 'internship';
  images: string[];
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface ProjectFilters {
  type?: 'personal' | 'client' | 'internship';
  technology?: string;
  isLive?: boolean;
}