import api from './index';
import type { User } from './models';

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

export async function register(payload: AuthRegisterPayload): Promise<User> {
  return api.post('/auth/register', payload);
}
export async function profile(): Promise<User> {
  return api.get('/auth/profile');
}

export async function login(payload: AuthLoginPayload): Promise<AuthLoginResponse> {
  return api.post('/auth/login', payload);
}

export async function logout(): Promise<{ msg: string }> {
  return api.post('/auth/logout');
}
