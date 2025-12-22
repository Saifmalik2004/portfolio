import { apiClient } from "../lib/apiClient";
import { ApiResponse } from "../types/api";
import { Certificate } from "@/types/certificate";
import { PaginatedResponse } from "@/types/paginatedReponse";

class CertificateService {

  // ✅ PAGINATED
  async getPaginatedCertificates(
    page = 0,
    size = 6
  ): Promise<PaginatedResponse<Certificate>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Certificate>>
    >(`/certificates?page=${page}&size=${size}`);

    return response.data.data;
  }

  // (admin / internal)
  async createCertificate(certificate: Certificate): Promise<Certificate> {
    const response = await apiClient.post<ApiResponse<Certificate>>(
      "/certificates",
      certificate
    );
    return response.data.data;
  }

  async updateCertificate(id: number, certificate: Certificate): Promise<Certificate> {
    const response = await apiClient.put<ApiResponse<Certificate>>(
      `/certificates/${id}`,
      certificate
    );
    return response.data.data;
  }

  async deleteCertificate(id: number): Promise<void> {
    await apiClient.delete(`/certificates/${id}`);
  }
}

const certificateService = new CertificateService();
export default certificateService;
