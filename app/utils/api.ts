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

  constructor(baseUrl: string, getAuthHeaders: () => Record<string, string>) {
    this.baseUrl = baseUrl;
    this.getAuthHeaders = getAuthHeaders;
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

    const response = await fetch(url, config);

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
