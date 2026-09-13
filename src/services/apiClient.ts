import axios, { type AxiosRequestConfig, type Method } from 'axios';
import AuthRepository from '../data/repositories/AuthRepository';

//const BASE_URL = 'https://demo.unitedinternetservice.in';
//const BASE_URL = 'http://10.0.2.2:5000';
const BASE_URL = 'http://192.168.1.39:5000';

interface RequestConfig {
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
  responseType?: 'json' | 'text';
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await AuthRepository.getToken();
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

async function request<T>(
  path: string,
  config: RequestConfig = {},
): Promise<T> {
  const { method = 'GET', body, headers = {} } = config;

  const isAbsoluteURL = /^https?:\/\//i.test(path);
  const url = isAbsoluteURL ? path : `${BASE_URL}${path}`;
  const authHeaders = await getAuthHeaders();

  const axiosConfig: AxiosRequestConfig = {
    url,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    data: body,
    responseType: config.responseType ?? 'json',
    timeout: 10000,
  };

  console.log(`[API] ${method} ${url}`);
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    console.log('[API] Request body:', JSON.stringify(body, null, 2));
  }

  const response = await axios<T>(axiosConfig);
  return response.data;
}

export const apiClient = {
  get: <T>(path: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    request<T>(path, { method: 'GET', ...(config ?? {}) }),
  post: <T>(
    path: string,
    body?: unknown,
    config?: Omit<RequestConfig, 'method' | 'body'>,
  ) => request<T>(path, { method: 'POST', body, ...(config ?? {}) }),
  put: <T>(
    path: string,
    body?: unknown,
    config?: Omit<RequestConfig, 'method' | 'body'>,
  ) => request<T>(path, { method: 'PUT', body, ...(config ?? {}) }),
  patch: <T>(
    path: string,
    body?: unknown,
    config?: Omit<RequestConfig, 'method' | 'body'>,
  ) => request<T>(path, { method: 'PATCH', body, ...(config ?? {}) }),
  delete: <T>(path: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    request<T>(path, { method: 'DELETE', ...(config ?? {}) }),
};
