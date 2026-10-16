const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'travelmate_auth_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.error('Failed to store auth token:', err);
  }
}

export function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.error('Failed to remove auth token:', err);
  }
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: Array<{ field: string; message: string }>;
  code?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error: ApiError = {
        message: data.error || data.message || `Request failed with status ${response.status}`,
        statusCode: response.status,
        details: data.details,
        code: data.code,
      };
      throw error;
    }

    return data as T;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    // Network or offline error
    const netError: ApiError = {
      message: error.message || 'Unable to connect to the server. Please check your internet connection.',
      statusCode: 0,
    };
    throw netError;
  }
}
