import { apiClient } from "../lib/apiClient";
import { ApiResponse } from "../types/api";
import { ContactRequest, ContactResponse } from "@/types/contact";

class ContactService {
  // -------- GET --------
  async getAllContacts(): Promise<ContactResponse[]> {
    const response = await apiClient.get<ApiResponse<ContactResponse[]>>("/contacts");
    return response.data.data;
  }

  async getUnreadContacts(): Promise<ContactResponse[]> {
    const response = await apiClient.get<ApiResponse<ContactResponse[]>>("/contacts/unread");
    return response.data.data;
  }

  async getContactById(id: number): Promise<ContactResponse> {
    const response = await apiClient.get<ApiResponse<ContactResponse>>(`/contacts/${id}`);
    return response.data.data;
  }

  // -------- CREATE --------
  async createContact(contact: ContactRequest): Promise<ContactResponse> {
    const response = await apiClient.post<ApiResponse<ContactResponse>>("/contacts", contact);
    return response.data.data;
  }

  // -------- UPDATE (Mark as Read) --------
  async markAsRead(id: number): Promise<ContactResponse> {
    const response = await apiClient.patch<ApiResponse<ContactResponse>>(`/contacts/${id}/read`);
    return response.data.data;
  }

  async markAllAsRead(): Promise<string> {
    const response = await apiClient.patch<ApiResponse<string>>("/contacts/read-all");
    return response.data.data;
  }

  // -------- DELETE --------
  async deleteContact(id: number): Promise<ContactResponse> {
    const response = await apiClient.delete<ApiResponse<ContactResponse>>(`/contacts/${id}`);
    return response.data.data;
  }
}

const contactService = new ContactService();
export default contactService;
