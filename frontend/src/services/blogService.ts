import { apiClient } from "../lib/apiClient";
import { ApiResponse } from "../types/api";
import { BlogRequest, BlogResponse, PaginatedBlogResponse } from "../types/blog";

class BlogService {
  // ✅ Get paginated blogs
  async getAllBlogs(page = 0, size = 6): Promise<PaginatedBlogResponse> {
    const response = await apiClient.get<ApiResponse<PaginatedBlogResponse>>(
      "/blogs",
      {
        params: { page, size },
      }
    );
    return response.data.data;
  }

  async getBlogById(id: number): Promise<BlogResponse> {
    const response = await apiClient.get<ApiResponse<BlogResponse>>(
      `/blogs/${id}`
    );
    return response.data.data;
  }

  async getBlogBySlug(slug: string): Promise<BlogResponse> {
    const response = await apiClient.get<ApiResponse<BlogResponse>>(
      `/blogs/slug/${encodeURIComponent(slug)}`
    );
    return response.data.data;
  }

  // ✅ Get paginated blogs by category
  async getBlogsByCategory(
    category: string,
    page = 0,
    size = 6
  ): Promise<PaginatedBlogResponse> {
    const response = await apiClient.get<ApiResponse<PaginatedBlogResponse>>(
      `/blogs/category/${encodeURIComponent(category)}`,
      {
        params: { page, size },
      }
    );
    return response.data.data;
  }

  async createBlog(blog: BlogRequest): Promise<BlogResponse> {
    const response = await apiClient.post<ApiResponse<BlogResponse>>(
      "/blogs",
      blog
    );
    return response.data.data;
  }

  async updateBlog(id: number, blog: BlogRequest): Promise<BlogResponse> {
    const response = await apiClient.put<ApiResponse<BlogResponse>>(
      `/blogs/${id}`,
      blog
    );
    return response.data.data;
  }

  async deleteBlog(id: number): Promise<BlogResponse> {
    const response = await apiClient.delete<ApiResponse<BlogResponse>>(
      `/blogs/${id}`
    );
    return response.data.data;
  }
}

const blogService = new BlogService();
export default blogService;
