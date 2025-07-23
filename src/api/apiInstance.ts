import axios from 'axios';
import Cookies from 'js-cookie';


const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.log('API Error:', error.response.data);
        } else if (error.request) {
            console.log('API Request Error:', error.request);
        } else {
            console.log('API Setup Error:', error.message);
        }
        return Promise.reject(error);
    }
);


const apiRequest = (
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data: any = {},
    params: any = {},
    headers: Record<string, string> = {}
) => {
    const contentType =
        data instanceof FormData ? 'multipart/form-data' : 'application/json';

    const combinedHeaders = {
        'Content-Type': contentType,
        ...headers,
    };

    return apiInstance({
        method,
        url,
        data,
        params,
        headers: combinedHeaders,
    });
};


export default apiRequest;
