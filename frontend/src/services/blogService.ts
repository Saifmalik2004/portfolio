import { apiClient } from "../lib/apiClient";
import { ApiResponse } from "../types/api";
import { BlogRequest, BlogResponse } from "../types/blog";

class BlogService {
  async getAllBlogs(): Promise<BlogResponse[]> {
    const response = await apiClient.get<ApiResponse<BlogResponse[]>>("/blogs");
    return response.data.data;
  }

  async getBlogById(id: number): Promise<BlogResponse> {
    const response = await apiClient.get<ApiResponse<BlogResponse>>(`/blogs/${id}`);
    return response.data.data;
  }

  async getBlogBySlug(slug: string): Promise<BlogResponse> {
    const response = await apiClient.get<ApiResponse<BlogResponse>>(`/blogs/slug/${slug}`);
    return response.data.data;
  }

  async getBlogsByCategory(category: string): Promise<BlogResponse[]> {
    const response = await apiClient.get<ApiResponse<BlogResponse[]>>(`/blogs/category/${category}`);
    return response.data.data;
  }

  async createBlog(blog: BlogRequest): Promise<BlogResponse> {
    const response = await apiClient.post<ApiResponse<BlogResponse>>("/blogs", blog);
    return response.data.data;
  }

  async updateBlog(id: number, blog: BlogRequest): Promise<BlogResponse> {
    const response = await apiClient.put<ApiResponse<BlogResponse>>(`/blogs/${id}`, blog);
    return response.data.data;
  }

  async deleteBlog(id: number): Promise<BlogResponse> {
    const response = await apiClient.delete<ApiResponse<BlogResponse>>(`/blogs/${id}`);
    return response.data.data;
  }
}

const blogService = new BlogService();
export default blogService;
