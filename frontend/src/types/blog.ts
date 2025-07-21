export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  is_published: boolean;
  read_time: string;
  author: string;
  tags: string[];
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  isPublished?: boolean;
  author?: string;
}

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  is_published: boolean;
  read_time: string;
  author: string;
  tags: string[];
  meta_description: string;
}