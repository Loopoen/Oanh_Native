import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  apiClient,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from './apiClient';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  error?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Basic Validation Helpers (reused by existing screens)
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  return { isValid: true };
};

/**
 * Real Authentication Service
 * Interacts with backend /api/auth endpoints via apiClient
 */
class AuthService {
  /**
   * Log in user with real credentials via POST /api/auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const emailValidation = validateEmail(credentials.email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    const passwordValidation = validatePassword(credentials.password);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.error };
    }

    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (response.success && response.token && response.user) {
        // Store JWT token and user info securely in AsyncStorage
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.token);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

        return {
          success: true,
          token: response.token,
          user: response.user,
          message: response.message || 'Login successful',
        };
      }

      return {
        success: false,
        error: response.error || 'Login failed. Please check your credentials.',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unable to log in. Please try again.',
      };
    }
  }

  /**
   * Register user via POST /api/auth/register
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const emailValidation = validateEmail(credentials.email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    const passwordValidation = validatePassword(credentials.password);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.error };
    }

    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/register', {
        email: credentials.email.trim(),
        password: credentials.password,
        name: credentials.name,
      });

      if (response.success && response.token && response.user) {
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.token);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

        return {
          success: true,
          token: response.token,
          user: response.user,
          message: response.message,
        };
      }

      return {
        success: false,
        error: response.error || 'Registration failed.',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed. Please try again.',
      };
    }
  }

  /**
   * Request password reset instructions
   */
  async requestPasswordReset(email: string): Promise<ResetPasswordResponse> {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return { success: false, message: '', error: emailValidation.error };
    }

    return {
      success: true,
      message: `If an account exists for ${email.trim()}, password reset instructions have been sent.`,
    };
  }

  /**
   * Log out user and clear stored JWT session
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear auth session', e);
    }
  }

  /**
   * Get the current active user from local storage
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return userJson ? (JSON.parse(userJson) as User) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get the active token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Restore session on app launch:
   * Validates stored token against protected GET /api/auth/me endpoint.
   * If expired or invalid, clears storage.
   */
  async restoreSession(): Promise<User | null> {
    try {
      const token = await this.getToken();
      if (!token) {
        return null;
      }

      // Verify token with backend
      const res = await apiClient.get<{ success: boolean; user: User }>('/api/auth/me');
      if (res?.success && res.user) {
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
        return res.user;
      }

      // If server rejected token
      await this.logout();
      return null;
    } catch (err: any) {
      // If 401 Unauthorized, token is expired/invalid
      if (err.status === 401) {
        await this.logout();
        return null;
      }
      // If offline / network error, return cached user
      return await this.getCurrentUser();
    }
  }

  /**
   * Check if a user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return Boolean(token);
  }
}

export const authService = new AuthService();
