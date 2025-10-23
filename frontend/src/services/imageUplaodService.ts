import { ImageUploadResponse } from "@/types/project";
import { apiClient } from "../lib/apiClient";
import { ApiResponse } from "../types/api";


class ImageService {
  // Upload multiple images
  async uploadMultiple(subFolder: "projects" | "blogs" | "certificates", files: File[]): Promise<ImageUploadResponse[]> {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const response = await apiClient.post<ApiResponse<ImageUploadResponse[]>>(
      `/images/upload/${subFolder}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data;
  }

  // Upload single image
  async uploadSingle(subFolder: "projects" | "blogs" | "certificates", file: File): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<ApiResponse<ImageUploadResponse>>(
      `/images/upload-single/${subFolder}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data;
  }

  // Delete image
  async delete(publicId: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/images/delete?publicId=${encodeURIComponent(publicId)}`);
  }
}

const imageService = new ImageService();
export default imageService;
