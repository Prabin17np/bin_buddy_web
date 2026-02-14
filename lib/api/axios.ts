import axios from 'axios';
import { getAuthToken } from '../cookie';

const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050').replace(/\/+$/, '');

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getAuthToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Clean URL in case of trailing whitespace/newline
        if (config.url) {
            config.url = config.url.trim();
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
