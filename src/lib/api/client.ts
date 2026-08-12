import axios from 'axios';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unwrap .data and provide rich error objects
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const responseData = error.response?.data;
    let errorMsg = 'An unexpected error occurred';

    if (responseData) {
      if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        // Try to parse ugly Spring Boot validation messages
        const firstError = responseData.errors[0];
        const match = firstError.match(/default message \[([^\[\]]+)\]\]\s*$/);
        if (match && match[1]) {
          errorMsg = match[1];
        } else {
          errorMsg = firstError;
        }
      } else {
        errorMsg = responseData.message || responseData.error || (typeof responseData === 'string' ? responseData : 'An unexpected error occurred');
      }
    } else if (error.message) {
      errorMsg = error.message;
    }

    const customError = new Error(errorMsg) as Error & {
      status?: number;
      data?: unknown;
    };
    customError.status = error.response?.status;
    customError.data = responseData;
    return Promise.reject(customError);
  }
);