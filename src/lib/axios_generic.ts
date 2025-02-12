import { nkey } from '@/data/keyStore';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { urls } from '@/apis/urls';

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

// Add new interface for token response
interface TokenResponse {
  isSuccess: boolean;
  errorOnFailure?: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
  message?: string;
}

// Add interface for error response
interface TokenErrorResponse {
  isSuccess: boolean;
  message: string;
  status: 'Valid' | 'AccessTokenExpired' | 'RefreshTokenExpired' | 'TokenInvalid';
}

// Create a flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
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

// Update the response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<TokenErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Check if error is token expired and request hasn't been retried
    if (error.response?.data.status === 'AccessTokenExpired' && !originalRequest._retry) {
      if (isRefreshing) {
        // If refreshing, queue the request
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get(nkey.refresh_token);
        const currentToken = Cookies.get(nkey.auth_token);
        
        if (!refreshToken || !currentToken) {
          throw new Error('No refresh token available');
        }

        const response = await apiClient.post<TokenResponse>(urls.refresh_token, {
          refreshToken,
          accessToken: currentToken
        });

        if (response.data.isSuccess) {
          // Update tokens
          Cookies.set(nkey.auth_token, response.data.accessToken);
          Cookies.set(nkey.refresh_token, response.data.refreshToken);
          Cookies.set(nkey.refresh_token_expiry, response.data.refreshTokenExpiryTime);
          
          // Update Authorization header
          originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
          
          // Process queued requests
          processQueue(null, response.data.accessToken);
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear all auth cookies on refresh failure
        Cookies.remove(nkey.auth_token);
        Cookies.remove(nkey.refresh_token);
        Cookies.remove(nkey.refresh_token_expiry);
        Cookies.remove(nkey.email_login);
        Cookies.remove(nkey.client_ID);
        Cookies.remove(nkey.userID);
        Cookies.remove(nkey.userRole);
      } finally {
        isRefreshing = false;
      }
    }

    // Transform axios error to custom ApiError
    if (error.response) {
      const errorData = error.response.data as ApiErrorResponse;
      throw new ApiError(
        errorData.message || 'An error occurred',
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      throw new ApiError('No response received from server', 0);
    } else {
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
  handleError(error: unknown): { statusCode: number; message: string } {
    if (error instanceof ApiError) {
      // Handle specific API errors
      switch (error.status) {
        case 400:
          return { statusCode: 400, message: 'Bad Request: Invalid data provided' };
        case 401:
          return { statusCode: 401, message: 'Unauthorized: Please log in again' };
        case 403:
          return { statusCode: 403, message: 'Forbidden: You do not have permission' };
        case 404:
          return { statusCode: 404, message: 'Not Found: Resource does not exist' };
        case 500:
          return { statusCode: 500, message: 'Server Error: Something went wrong' };
        default:
          return {
            statusCode: error.status ?? 500,
            message: error.message || 'An unexpected error occurred',
          };
      }
    }
    return { statusCode: 0, message: 'An unknown error occurred' };
  }
};