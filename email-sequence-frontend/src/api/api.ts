import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Base API
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Get token
const getAuthToken = (): string | null => localStorage.getItem("token");

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      console.warn("Unauthorized - Token removed");
      // Optional: redirect to login
    }
    return Promise.reject(error);
  }
);

// Helper methods
export const apiGet = <T>(url: string, config?: AxiosRequestConfig) =>
  axiosInstance.get<T>(url, config);

export const apiPost = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => axiosInstance.post<T>(url, data, config);

export const apiPut = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => axiosInstance.put<T>(url, data, config);

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  axiosInstance.delete<T>(url, config);

export default axiosInstance;
