import axios, { type AxiosRequestConfig, type Method } from 'axios';
import { Platform } from 'react-native';
import type { ApiResponseModel } from './types';

// On Android emulator, localhost is the emulator itself; use 10.0.2.2 to reach host machine.
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'https://demo.unitedinternetservice.in';
    // return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
};
const BASE_URL = getBaseUrl();

interface RequestConfig {
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
  responseType?: 'json' | 'text';
}

async function request<T>(
  path: string,
  config: RequestConfig = {},
): Promise<T> {
  const { method = 'GET', body, headers = {} } = config;
  const url = `${BASE_URL}${path}`;

  const axiosConfig: AxiosRequestConfig = {
    url,
    method,
    headers: {
      'Content-Type': 'application/json',
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
