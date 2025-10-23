import { ApiResponse } from "@/types/api";
import { ChatRequest, ChatResponse } from "@/types/chat";
import { apiClient } from "../lib/apiClient";


class ChatService {
   async GetReply(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ApiResponse<ChatResponse>>("/assistant/chat",request);
    return response.data.data;
  }
}
const chatService = new ChatService();
export default chatService;