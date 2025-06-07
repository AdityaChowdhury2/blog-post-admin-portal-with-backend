import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getLocalStorage } from "./localStorage";

// Set your server URL, fallback to localhost
const BASE_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:8000/api/v1";

// --- Public axios instance ---
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// --- Authenticated axios instance ---
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// --- Request interceptor for authenticated instance ---
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ensure headers object exists
    config.headers = config.headers || {};
    const token = getLocalStorage("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// --- Optional: React hook for authenticated axios instance ---
export const useAxiosInstance = () => axiosInstance;

// --- Optional: React hook for public axios instance ---
export const useAxiosPublic = () => axiosPublic;

export default axiosInstance;
