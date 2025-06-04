import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

// Create public axios instance
export const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:8000/api/v1",
});

// Create authenticated axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

// Request interceptor for authenticated instance
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for authenticated instance
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Optional: clear localStorage
      localStorage.removeItem("token");

      // Optional: notify app (e.g., redirect, reload)
      console.warn("Unauthorized, please log in again.");
    }
    return Promise.reject(error);
  }
);

// Custom hook for public axios instance
export const useAxiosPublic = () => {
  return axiosPublic;
};

export default axiosInstance;
