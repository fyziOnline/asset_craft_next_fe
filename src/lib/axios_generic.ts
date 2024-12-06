import { nkey } from '@/data/keyStore';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

// Custom error class for API errors
class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add authentication token if available
    const accessToken = Cookies.get(nkey.auth_token);
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

interface ApiErrorResponse {
  message: string;
  // Add other properties if any
  [key: string]: any;
}

// Response interceptor for global error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    // Transform axios error to custom ApiError
    if (error.response) {
      const errorData = error.response.data as ApiErrorResponse;
      // The request was made and the server responded with a status code
      throw new ApiError(
        errorData.message || 'An error occurred',
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new ApiError('No response received from server', 0);
    } else {
      // Something happened in setting up the request
      throw new ApiError('Error setting up the request', 0);
    }
  }
);

/**
 * Generic API service for making HTTP requests
 */
export const ApiService = {
  /**
   * GET request
   */
  async get<T>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.get(url, config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('An unexpected error occurred', 500);
    }
  },

  /**
   * POST request
   */
  async post<T, D = any>(
    url: string,
    data?: D,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('An unexpected error occurred', 500);
    }
  },

  /**
   * PUT request
   */
  async put<T, D = any>(
    url: string,
    data?: D,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.put(url, data, config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('An unexpected error occurred', 500);
    }
  },

  /**
   * DELETE request
   */
  async delete<T>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(url, config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('An unexpected error occurred', 500);
    }
  },

  /**
   * Convenient method to handle errors
   */
  handleError(error: unknown): string {
    if (error instanceof ApiError) {
      // Handle specific API errors
      switch (error.status) {
        case 400: return 'Bad Request: Invalid data provided';
        case 401:
          window.location.href = '/'
          return 'Unauthorized: Please log in again';
        case 403: return 'Forbidden: You do not have permission';
        case 404: return 'Not Found: Resource does not exist';
        case 500: return 'Server Error: Something went wrong';
        default: return error.message || 'An unexpected error occurred';
      }
    }
    return 'An unknown error occurred';
  }
};