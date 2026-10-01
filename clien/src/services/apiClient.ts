import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_STORAGE_KEY = '@oanh_auth_token';
export const USER_STORAGE_KEY = '@oanh_auth_user';

const getBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {

    if (Platform.OS === 'android' && envUrl.includes('localhost')) {
      return envUrl.replace('localhost', '10.0.2.2');
    }
    return envUrl;
  }


  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  return 'http://localhost:5000';
};

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
  [key: string]: any;
}

type UnauthorizedHandler = () => void;

class ApiClient {
  private unauthorizedHandler: UnauthorizedHandler | null = null;


  setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
    this.unauthorizedHandler = handler;
  }

  private get baseUrl(): string {
    return getBaseUrl();
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  }

 
  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let responseData: any = null;
      const text = await response.text();
      try {
        responseData = text ? JSON.parse(text) : {};
      } catch {
        responseData = { message: text };
      }

      if (!response.ok) {
        if (response.status === 401 && token && !endpoint.startsWith('/api/auth/')) {
          this.unauthorizedHandler?.();
        }
        const errorMessage =
          responseData?.error ||
          responseData?.message ||
          `Request failed with status ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).data = responseData;
        throw error;
      }

      return responseData as T;
    } catch (err: any) {
      clearTimeout(timeoutId);

      const msg = String(err?.message || '').toLowerCase();


      if (
        err?.name === 'AbortError' ||
        msg.includes('canceled') ||
        msg.includes('cancelled') ||
        msg.includes('aborted')
      ) {
        const timeoutError = new Error(
          `Máy chủ không phản hồi (${this.baseUrl}). Kiểm tra backend đã chạy, cùng mạng Wi-Fi và EXPO_PUBLIC_API_URL đúng chưa.`
        );
        (timeoutError as any).isNetworkError = true;
        throw timeoutError;
      }

    
      if (
        msg.includes('network request failed') ||
        msg.includes('failed to fetch') ||
        msg.includes('fetch failed')
      ) {
        const networkError = new Error(
          `Không kết nối được tới backend (${this.baseUrl}). Hãy chắc chắn server đang chạy.`
        );
        (networkError as any).isNetworkError = true;
        throw networkError;
      }

      throw err;
    }
  }

  get<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T = any>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
