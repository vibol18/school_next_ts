import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Attach Access Token to every request
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Handle responses and preserve error structure for debugging
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const responseData = error.response?.data;
    
    // Extract a human-readable message
    const errorMsg =
      responseData?.message ||
      responseData?.error ||
      (typeof responseData === 'string' ? responseData : undefined) ||
      error.message ||
      'An unexpected error occurred';

    // Create a rich error object so you can access status & response payload
    const customError = new Error(errorMsg) as Error & {
      status?: number;
      data?: any;
    };

    customError.status = error.response?.status;
    customError.data = responseData;

    return Promise.reject(customError);
  }
);