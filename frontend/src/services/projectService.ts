import { apiClient } from "../lib/apiClient";

import { ApiResponse } from "../types/api";
import { ProjectRequest, ProjectResponse } from "../types/project";

class ProjectService {
  async getAllProjects(): Promise<ProjectResponse[]> {
    const response = await apiClient.get<ApiResponse<ProjectResponse[]>>("/projects");
    return response.data.data;
  }
  async getAllFeaturedProjects(): Promise<ProjectResponse[]> {
    const response = await apiClient.get<ApiResponse<ProjectResponse[]>>("/projects/featured");
    return response.data.data;
  }

  async getProjectById(id: number): Promise<ProjectResponse> {
    const response = await apiClient.get<ApiResponse<ProjectResponse>>(`/projects/${id}`);
    return response.data.data;
  }

  async getProjectBySlug(slug: string): Promise<ProjectResponse> {
    const response = await apiClient.get<ApiResponse<ProjectResponse>>(`/projects/slug/${slug}`);
    return response.data.data;
  }

  async getProjectsByType(type: string): Promise<ProjectResponse[]> {
    const response = await apiClient.get<ApiResponse<ProjectResponse[]>>(`/projects/type/${type}`);
    return response.data.data;
  }

  async createProject(project: ProjectRequest): Promise<ProjectResponse> {
    const response = await apiClient.post<ApiResponse<ProjectResponse>>("/projects", project);
    return response.data.data;
  }

  async updateProject(id: number, project: ProjectRequest): Promise<ProjectResponse> {
    const response = await apiClient.put<ApiResponse<ProjectResponse>>(`/projects/${id}`, project);
    return response.data.data;
  }

  async deleteProject(id: number): Promise<ProjectResponse> {
    const response = await apiClient.delete<ApiResponse<ProjectResponse>>(`/projects/${id}`);
    return response.data.data;
  }

  async toggleLive(id: number): Promise<ProjectResponse> {
    const response = await apiClient.patch<ApiResponse<ProjectResponse>>(`/projects/${id}/live`);
    return response.data.data;
  }

  async togglePublished(id: number): Promise<ProjectResponse> {
    const response = await apiClient.patch<ApiResponse<ProjectResponse>>(`/projects/${id}/published`);
    return response.data.data;
  }

  async toggleFeatured(id: number): Promise<ProjectResponse> {
    const response = await apiClient.patch<ApiResponse<ProjectResponse>>(`/projects/${id}/featured`);
    return response.data.data;
  }
}

const projectService = new ProjectService();
export default projectService;