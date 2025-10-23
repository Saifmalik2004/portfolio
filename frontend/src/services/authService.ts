import { apiClient } from "@/lib/apiClient";
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendOtpRequest,
  TokenResponse,
  User,
} from "@/types/auth";

export const authService = {
  async register(data: RegisterRequest): Promise<ApiResponse<void>> {
    const res = await apiClient.post<ApiResponse<void>>("/auth/register", data);
    return res.data;
  },

  async login(data: LoginRequest): Promise<TokenResponse> {
    const res = await apiClient.post<ApiResponse<TokenResponse>>(
      "/auth/login",
      data
    );
    const tokens = res.data.data;
    localStorage.setItem("accessToken", tokens.accessToken);
    return tokens;
  },

  async verifyEmail(data: VerifyEmailRequest) {
    return (await apiClient.post<ApiResponse<void>>("/auth/verify-email", data))
      .data;
  },

  async resendVerifyOtp(data: ResendOtpRequest) {
    return (
      await apiClient.post<ApiResponse<void>>("/auth/resend-verify-otp", data)
    ).data;
  },

  async forgotPassword(data: ForgotPasswordRequest) {
    return (
      await apiClient.post<ApiResponse<void>>("/auth/forgot-password", data)
    ).data;
  },

  async resetPassword(data: ResetPasswordRequest) {
    return (await apiClient.post<ApiResponse<void>>("/auth/reset-password", data))
      .data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
    }
  },

  async refreshToken(): Promise<TokenResponse> {
    const res = await apiClient.post<ApiResponse<TokenResponse>>(
      "/auth/refresh-token",
      null,
      { withCredentials: true }
    );
    return res.data.data;
  },

  async getCurrentUser(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>("/auth/me");
    return res.data.data;
  },
};
