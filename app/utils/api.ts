'use client';

// Классы ошибок API
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public response?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, status: number, response?: string) {
    super(message, status, 'Validation Error', response);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'Unauthorized');
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error') {
    super(message);
    this.name = 'NetworkError';
  }
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private getAuthHeaders: () => Record<string, string>;
  private refreshTokenCallback?: () => Promise<boolean>;

  constructor(baseUrl: string, getAuthHeaders: () => Record<string, string>) {
    this.baseUrl = baseUrl;
    this.getAuthHeaders = getAuthHeaders;
  }

  setRefreshTokenCallback(callback: () => Promise<boolean>) {
    this.refreshTokenCallback = callback;
  }

  async request(endpoint: string, options: ApiOptions = {}) {
    const {
      method = 'GET',
      body,
      headers = {},
      requireAuth = true
    } = options;

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    if (requireAuth) {
      Object.assign(requestHeaders, this.getAuthHeaders());
    }

    const config: RequestInit = {
      method,
      headers: requestHeaders
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      let response = await fetch(url, config);

      if (response.status === 401 && requireAuth && this.refreshTokenCallback) {
        const refreshed = await this.refreshTokenCallback();
        
        if (refreshed) {
          const newHeaders = {
            ...requestHeaders,
            ...this.getAuthHeaders()
          };
          
          const newConfig: RequestInit = {
            ...config,
            headers: newHeaders
          };
          
          response = await fetch(url, newConfig);
        } else {
          window.location.href = '/login';
          throw new AuthenticationError();
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        
        // Пытаемся парсить JSON ошибку
        let errorMessage = errorText || response.statusText;
        let parsedError: unknown = null;
        
        try {
          parsedError = JSON.parse(errorText);
          if (parsedError && typeof parsedError === 'object' && 'message' in parsedError) {
            errorMessage = (parsedError as { message: string }).message;
          } else if (parsedError && typeof parsedError === 'object' && 'error' in parsedError) {
            errorMessage = (parsedError as { error: string }).error;
          }
        } catch {
          // Если не удалось парсить JSON, используем текст как есть
        }

        // Создаем специфичные ошибки в зависимости от статуса
        switch (response.status) {
          case 400:
            throw new ValidationError(errorMessage, response.status, errorText);
          case 401:
            throw new AuthenticationError(errorMessage);
          case 403:
            throw new ApiError(errorMessage, response.status, 'Forbidden', errorText);
          case 404:
            throw new ApiError(errorMessage, response.status, 'Not Found', errorText);
          case 422:
            throw new ValidationError(errorMessage, response.status, errorText);
          case 500:
            throw new ApiError('Внутренняя ошибка сервера', response.status, 'Internal Server Error', errorText);
          default:
            throw new ApiError(errorMessage, response.status, response.statusText, errorText);
        }
      }

      return await response.json();
    } catch (error) {
      // Обработка сетевых ошибок
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError('Ошибка сети. Проверьте подключение к интернету.');
      }
      
      // Если это уже наша ошибка, просто пробрасываем её
      if (error instanceof ApiError || error instanceof NetworkError) {
        throw error;
      }
      
      // Для остальных ошибок создаем общую ошибку API
      throw new ApiError(
        error instanceof Error ? error.message : 'Неизвестная ошибка',
        0,
        'Unknown Error'
      );
    }
  }

  // Удобные методы
  get(endpoint: string, options?: Omit<ApiOptions, 'method'>) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  delete(endpoint: string, options?: Omit<ApiOptions, 'method'>) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Создаем экземпляр API клиента
let apiClient: ApiClient | null = null;

export function initApi(baseUrl: string, getAuthHeaders: () => Record<string, string>) {
  apiClient = new ApiClient(baseUrl, getAuthHeaders);
}

export function setRefreshTokenCallback(callback: () => Promise<boolean>) {
  if (apiClient) {
    apiClient.setRefreshTokenCallback(callback);
  }
}

export function api() {
  if (!apiClient) {
    throw new Error('API client not initialized. Call initApi() first.');
  }
  return apiClient;
}

export async function fetchApi(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: unknown) {
  return api().request(endpoint, { method, body });
}

export async function getApi(endpoint: string) {
  return api().get(endpoint);
}

export async function postApi(endpoint: string, body?: unknown, requireAuth: boolean = true) {
  return api().post(endpoint, body, { requireAuth });
}

export async function putApi(endpoint: string, body?: unknown) {
  return api().put(endpoint, body);
}

export async function deleteApi(endpoint: string) {
  return api().delete(endpoint);
}
