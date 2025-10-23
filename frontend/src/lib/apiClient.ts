import axios from "axios";
import type { ApiResponse, TokenResponse } from "@/types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ allow cookies (for refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add access token before each request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401 (auto refresh)
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) prom.resolve(apiClient(prom.request));
    else prom.reject(error);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⚠️ Skip certain routes
    const skip =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token");

    if (error.response?.status === 401 && !originalRequest._retry && !skip) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, request: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post<ApiResponse<TokenResponse>>(
          `${API_BASE_URL}/auth/refresh-token`,
          null,
          { withCredentials: true }
        );

        const newToken = res.data.data.accessToken;
        if (!newToken) throw new Error("No access token returned");

        localStorage.setItem("accessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
