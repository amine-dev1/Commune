import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor to handle CSRF token
api.interceptors.request.use(async config => {
    // Only get CSRF token for non-GET requests
    if (config.method !== 'get') {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
    }
    return config;
});

export default api;