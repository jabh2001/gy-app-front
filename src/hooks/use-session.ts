import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginRequest, logout as logoutRequest, register as registerRequest, profile as profileRequest, type AuthLoginPayload, type AuthRegisterPayload } from '@/api/auth';
import { normalizeApiError } from '@/api/index';
import type { User } from '@/api/models';

const SESSION_STORAGE_KEY = 'gy_app_user_session';

type SessionStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface SessionState {
  user: User | null;
  status: SessionStatus;
  error?: string;
  hasCheckedSession: boolean;
  checkSession: () => Promise<User | null>;
  login: (payload: AuthLoginPayload) => Promise<User>;
  register: (payload: AuthRegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  hasRole: (role: User['role']) => boolean;
  hasAnyRole: (roles: User['role'][]) => boolean;
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      user: null,
      status: 'unauthenticated',
      error: undefined,
      hasCheckedSession: false,

      checkSession: async () => {
        set({ status: 'loading', error: undefined });

        try {
          const user = await profileRequest();

          set({
            user,
            status: 'authenticated',
            hasCheckedSession: true,
            error: undefined,
          });

          return user;
        } catch (errorData) {
          set({
            user: null,
            status: 'unauthenticated',
            hasCheckedSession: true,
            error: undefined,
          });

          return null;
        }
      },

      login: async (payload: AuthLoginPayload) => {
        set({ status: 'loading', error: undefined });
        try {
          const response = await loginRequest(payload);
          set({ user: response.user, status: 'authenticated' });
          return response.user;
        } catch (errorData) {
          const apiError = normalizeApiError(errorData);
          set({ error: apiError.message, status: 'error' });
          throw apiError;
        }
      },

      register: async (payload: AuthRegisterPayload) => {
        set({ status: 'loading', error: undefined });
        try {
          const newUser = await registerRequest(payload);
          set({ user: newUser, status: 'authenticated' });
          return newUser;
        } catch (errorData) {
          const apiError = normalizeApiError(errorData);
          set({ error: apiError.message, status: 'error' });
          throw apiError;
        }
      },

      logout: async () => {
        set({ status: 'loading', error: undefined });
        try {
          await logoutRequest();
          set({ user: null, status: 'unauthenticated' });
        } catch (errorData) {
          const apiError = normalizeApiError(errorData);
          set({ error: apiError.message, status: 'error' });
          throw apiError;
        }
      },

      isAuthenticated: () => Boolean(get().user),
      hasRole: (role: User['role']) => Boolean(get().user?.role === role),
      hasAnyRole: (roles: User['role'][]) => {
        const user = get().user;
        return Boolean(user && roles.includes(user.role));
      },
    }),
    {
      name: SESSION_STORAGE_KEY,
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          state.status = 'authenticated';
        }
      },
    }
  )
);
