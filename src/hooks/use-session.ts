import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginRequest, logout as logoutRequest, register as registerRequest, profile as profileRequest, updateProfile as updateProfileRequest, clearSession as clearSessionRequest, type AuthLoginPayload, type AuthRegisterPayload } from '@/api/auth';
import { normalizeApiError, showApiError } from '@/api/index';
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
  forceClearSession: () => Promise<void>;
  updateProfile: (payload: Partial<Pick<User, 'email' | 'username'>> & { password?: string }) => Promise<User>;
  isAuthenticated: () => boolean;
  hasRole: (role: User['role']) => boolean;
  hasAnyRole: (roles: User['role'][]) => boolean;
}

if (typeof window !== 'undefined') {
  window.addEventListener('session-expired', () => {
    useSession.getState().forceClearSession();
  });
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      user: null,
      status: 'unauthenticated',
      error: undefined,
      hasCheckedSession: false,

      checkSession: async () => {
        if (!get().user) {
          set({ hasCheckedSession: true, status: 'unauthenticated', user: null });
          return null;
        }

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
          const sessionId = typeof window !== 'undefined' ? window.localStorage.getItem('cart_session_id') ?? undefined : undefined;
          const response = await loginRequest(payload, sessionId);
          set({ user: response.user, status: 'authenticated' });
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('cart-refetch'));
          }
          return response.user;
        } catch (errorData) {
          const apiError = normalizeApiError(errorData);
          set({ error: apiError.message, status: 'error' });
          throw apiError;
        }
      },

      updateProfile: async (payload: Partial<Pick<User, 'email' | 'username'>> & { password?: string }) => {
        set({ status: 'loading', error: undefined });
        try {
          const updatedUser = await updateProfileRequest(payload);
          set({ user: updatedUser, status: 'authenticated' });
          return updatedUser;
        } catch (errorData) {
          const apiError = normalizeApiError(errorData);
          set({ error: apiError.message, status: 'error' });
          throw apiError;
        }
      },

      register: async (payload: AuthRegisterPayload) => {
        set({ status: 'loading', error: undefined });
        try {
          const sessionId = typeof window !== 'undefined' ? window.localStorage.getItem('cart_session_id') ?? undefined : undefined;
          const newUser = await registerRequest(payload, sessionId);
          set({ user: newUser, status: 'authenticated' });
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('cart-refetch'));
          }
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
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('cart-refetch'));
          }
        } catch (errorData) {
          const apiError = normalizeApiError(errorData);
          set({ error: apiError.message, status: 'error' });
          throw apiError;
        }
      },

      forceClearSession: async () => {
        try {
          await clearSessionRequest();
        } catch {
        }
        set({ user: null, status: 'unauthenticated', hasCheckedSession: true, error: undefined });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('cart-refetch'));
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
