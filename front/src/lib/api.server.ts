import { PUBLIC_API_BASE_URI } from '$env/static/public';
import axios from 'axios';

export const client = axios.create({
    baseURL: PUBLIC_API_BASE_URI,
});
