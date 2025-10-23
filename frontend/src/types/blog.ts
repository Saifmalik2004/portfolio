import { ImageUploadResponse } from "./project";

// Blog response from API
export interface BlogResponse {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  readTime: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  image: ImageUploadResponse;
}

// Request payload for creating/updating blog
export interface BlogRequest {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  readTime: string;
  author: string;
  image: ImageUploadResponse;
}

// State types for blog pages
export interface BlogFilters {
  category?: string;
}