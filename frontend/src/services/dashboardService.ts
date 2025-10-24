import { apiClient } from "../lib/apiClient";
import { ApiResponse } from "../types/api";

class DashboardService {
  // -------- GET --------
  async getDashboardStats(): Promise<Record<string, number>> {
    const response = await apiClient.get<ApiResponse<Record<string, number>>>(
      "/dashboard"
    );
    return response.data.data;
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
