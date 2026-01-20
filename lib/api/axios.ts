import axios from "axios";

const BASE_URL = process.env.Next_PUBLIC_API_BASE_URL || "http://localhost:5050";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type" : "application/json",
  }
})

axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  if(token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
});

export default axiosInstance;