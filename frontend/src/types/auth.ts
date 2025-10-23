export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  roles: string[];
  isEmailVerified: boolean;
  isActive: boolean;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}


