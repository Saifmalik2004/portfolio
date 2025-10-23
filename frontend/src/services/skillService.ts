import { apiClient } from "../lib/apiClient";
import { ApiResponse } from "../types/api";
import { Skill } from "../types/skill";

class SkillService {
  async getAllSkills(): Promise<Skill[]> {
    const response = await apiClient.get<ApiResponse<Skill[]>>("/skills");
    return response.data.data;
  }

  async getSkillById(id: number): Promise<Skill> {
    const response = await apiClient.get<ApiResponse<Skill>>(`/skills/${id}`);
    return response.data.data;
  }

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    const response = await apiClient.get<ApiResponse<Skill[]>>(`/skills/category/${category}`);
    return response.data.data;
  }

  async createSkill(skill: Skill): Promise<Skill> {
    const response = await apiClient.post<ApiResponse<Skill>>("/skills", skill);
    return response.data.data;
  }

  async updateSkill(id: number, skill: Skill): Promise<Skill> {
    const response = await apiClient.put<ApiResponse<Skill>>(`/skills/${id}`, skill);
    return response.data.data;
  }

  async deleteSkill(id: number): Promise<Skill> {
    const response = await apiClient.delete<ApiResponse<Skill>>(`/skills/${id}`);
    return response.data.data;
  }
}

const skillService = new SkillService();
export default skillService;
