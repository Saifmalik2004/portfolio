// Request DTO (when creating a contact)
export interface ContactRequest {
  fullName: string;
  email: string;
  message: string;
}

// Response DTO (when receiving a contact from backend)
export interface ContactResponse {
  id: number;
  fullName: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO datetime format (LocalDateTime -> string)
}
