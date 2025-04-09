import { API_BASE_URL, REQUEST_TIMEOUT, getDefaultHeaders } from './config';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

interface RequestOptions {
  method?: RequestMethod;
  body?: any;
  token?: string;
  timeout?: number;
}

// ApiError class for handling API errors
export class ApiError extends Error {
  public status: number;
  public data: any;
  
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Utility function to check if the API is reachable
 * @returns Promise<boolean>
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: getDefaultHeaders(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });
    
    return response.ok;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
};

/**
 * Generic API request function
 * @param endpoint API endpoint path
 * @param options Request options
 * @returns Promise with typed data
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const {
    method = 'GET',
    body,
    token,
    timeout = REQUEST_TIMEOUT,
  } = options;
  
  const headers = getDefaultHeaders(token);
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const contentType = response.headers.get('content-type');
    let data: ApiResponse<T>;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      throw new ApiError('Invalid response format', response.status);
    }
    
    if (!response.ok) {
      throw new ApiError(
        data.error || 'An unknown error occurred',
        response.status,
        data
      );
    }
    
    if (!data.success) {
      throw new ApiError(
        data.error || 'Operation failed',
        response.status,
        data
      );
    }
    
    return data.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    
    throw new ApiError(
      (error as Error)?.message || 'Network request failed',
      500
    );
  }
};

// Shorthand API methods
export const apiGet = <T>(endpoint: string, token?: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'GET', token });
};

export const apiPost = <T>(endpoint: string, data: any, token?: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'POST', body: data, token });
};

export const apiPut = <T>(endpoint: string, data: any, token?: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'PUT', body: data, token });
};

export const apiDelete = <T>(endpoint: string, token?: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'DELETE', token });
}; 