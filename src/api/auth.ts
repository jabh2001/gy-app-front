import api from './index';
import type { User } from './models';

const STORAGE_KEY = 'cart_session_id';

function getSessionId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.localStorage.getItem(STORAGE_KEY) ?? undefined;
}

export type AuthRegisterPayload = {
  email: string;
  username?: string;
  password: string;
};

export type AuthLoginPayload = {
  email: string;
  password: string;
};

export type AuthLoginResponse = {
  user: User;
};

export async function register(payload: AuthRegisterPayload, session_id?: string): Promise<User> {
  const headers = {
    'X-Session-ID': session_id || getSessionId() || undefined,
  };
  return api.post('/auth/register/', payload, { headers });
}
export async function profile(): Promise<User> {
  return api.get('/auth/profile/');
}

export async function login(payload: AuthLoginPayload, session_id?: string): Promise<AuthLoginResponse> {
  const headers = {
    'X-Session-ID': session_id || getSessionId() || undefined,
  };
  return api.post('/auth/login/', payload, { headers });
}

export async function logout(): Promise<{ msg: string }> {
  return api.post('/auth/logout/');
}

export async function updateProfile(payload: Partial<Pick<User, 'email' | 'username'>> & { password?: string }): Promise<User> {
  return api.put('/auth/profile/', payload);
}
