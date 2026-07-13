import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type {
  APIResponse,
  ChangePasswordPayload,
  HistoryEntry,
  HistoryQueryParams,
  LoginPayload,
  SignupPayload,
  StatsResponse,
  UserResponse,
  MoodSubmitPayload,
} from "../types";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials: true,
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await apiClient.post("/auth/refresh");
        return apiClient(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  signup: async (data: SignupPayload): Promise<UserResponse> => {
    const res = await apiClient.post<UserResponse>("/auth/signup", data);
    return res.data;
  },
  login: async (data: LoginPayload): Promise<UserResponse> => {
    const res = await apiClient.post<UserResponse>("/auth/login", data);
    return res.data;
  },
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
  getMe: async (): Promise<UserResponse> => {
    const res = await apiClient.get<UserResponse>("/auth/me");
    return res.data;
  },
  updateProfile: async (data: { display_name: string }): Promise<UserResponse> => {
    const res = await apiClient.put<UserResponse>("/auth/profile", data);
    return res.data;
  },
  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<{ avatar_url: string }>("/auth/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  changePassword: async (data: ChangePasswordPayload): Promise<{ message: string }> => {
    const res = await apiClient.put<{ message: string }>("/auth/change-password", data);
    return res.data;
  },
  deleteAccount: async (): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ message: string }>("/auth/account");
    return res.data;
  },
};

export const moodApi = {
  submitMood: async (data: MoodSubmitPayload): Promise<APIResponse> => {
    const res = await apiClient.post<APIResponse>("/mood/places", data);
    return res.data;
  },
  getHistory: async (params: HistoryQueryParams): Promise<HistoryEntry[]> => {
    const res = await apiClient.get<HistoryEntry[]>("/mood/history", { params });
    return res.data;
  },
  getEntry: async (id: string): Promise<HistoryEntry & { places_suggested: unknown[] }> => {
    const res = await apiClient.get(`/mood/history/${id}`);
    return res.data;
  },
  getStats: async (): Promise<StatsResponse> => {
    const res = await apiClient.get<StatsResponse>("/mood/stats");
    return res.data;
  },
  deleteEntry: async (id: string): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ message: string }>(`/mood/history/${id}`);
    return res.data;
  },
};

export default apiClient;
