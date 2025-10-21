'use client';

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
        throw new Error('Authentication failed');
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    return await response.json();
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
