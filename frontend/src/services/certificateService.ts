import { apiClient } from "../lib/apiClient";

import { ApiResponse } from "../types/api";
import { Certificate } from "@/types/certificate";


class CertificateService {
  async getAllCertificates(): Promise<Certificate[]> {
    const response = await apiClient.get<ApiResponse<Certificate[]>>("/certificates");
    return response.data.data;
  }

  async getCertificateById(id: number): Promise<Certificate> {
    const response = await apiClient.get<ApiResponse<Certificate>>(`/certificates/${id}`);
    return response.data.data;
  }


  async createCertificate(certificate: Certificate): Promise<Certificate> {
    const response = await apiClient.post<ApiResponse<Certificate>>("/certificates", certificate);
    return response.data.data;
  }

  async updateCertificate(id: number, certificate: Certificate): Promise<Certificate> {
    const response = await apiClient.put<ApiResponse<Certificate>>(`/certificates/${id}`, certificate);
    return response.data.data;
  }

  async deleteCertificate(id: number): Promise<Certificate> {
    const response = await apiClient.delete<ApiResponse<Certificate>>(`/certificates/${id}`);
    return response.data.data;
  }
}

const certificateService = new CertificateService();
export default certificateService;
