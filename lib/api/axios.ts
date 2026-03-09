import axios from "axios";
import { getAuthToken } from "../cookie";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) throw new Error("NEXT_PUBLIC_API_URL is not defined");

const axiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token && config.headers) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { clearAuthCookies } = await import("../cookie");
      await clearAuthCookies();
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;