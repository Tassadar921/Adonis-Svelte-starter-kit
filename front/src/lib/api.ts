import axios, { type AxiosInstance } from 'axios';
import { PUBLIC_API_BASE_URI } from '$env/static/public';

const api: AxiosInstance = axios.create({
    baseURL: PUBLIC_API_BASE_URI,
});

export default api;
