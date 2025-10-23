// ✅ Enum (already defined)
export enum ProjectType {
  Freelance = "Freelance",
  Personal = "Personal",
  Internship = "Internship",
}

// ✅ Image upload response
export interface ImageUploadResponse {
  publicId: string; // Cloudinary public ID
  url: string;      // Image URL
}

// ✅ Request object (frontend -> backend)
export interface ProjectRequest {
  title: string;
  slug: string;
  description: string;
  githubUrl: string;
  liveDemoUrl: string;
  live: boolean;
  published: boolean;
  featured: boolean;
  type: ProjectType;
  keyFeatures: string[];
  images: ImageUploadResponse[];      // just URLs or file references to upload
  technologies: number[]; // id references (backend me store honge)
}

// ✅ Response object (backend -> frontend)
export interface ProjectResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
  githubUrl: string;
  liveDemoUrl: string;
  live: boolean;
  published: boolean;
  featured: boolean;
  type: ProjectType;
  keyFeatures: string[];
  images: ImageUploadResponse[]; // now an array of ImageUploadResponse
  technologies: string[]; 
  createdAt: string; 
  updatedAt: string;
}
