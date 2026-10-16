import { apiRequest, setStoredToken, removeStoredToken } from './api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth';

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (data.token) {
    setStoredToken(data.token);
  }
  return data;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (data.token) {
    setStoredToken(data.token);
  }
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const data = await apiRequest<{ user: User }>('/auth/me', {
    method: 'GET',
  });
  return data.user;
}

export function logout(): void {
  removeStoredToken();
}
