import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { createElement } from 'react';

export const baseURL = 'http://127.0.0.1:5000/api';
// export const baseURL = '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.defaults.xsrfCookieName = 'csrf_access_token';
api.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  pendingQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });
  pendingQueue = [];
}

export type SuccessResponse<T> = {
  status: true;
  data: T;
};

export type ErrorResponse = {
  status: false;
  error: string;
  errors: unknown[];
  status_code: number;
};

export type ApiResult<T> = {
  data?: T;
  error?: ApiErrorInfo;
};

export type ApiErrorInfo =
  | {
      type: 'backend';
      payload: ErrorResponse;
      message: string;
    }
  | {
      type: 'axios';
      message: string;
      status?: number;
      details?: unknown;
    }
  | {
      type: 'unknown';
      message: string;
      original?: unknown;
    };

export function isSuccessResponse<T>(value: unknown): value is SuccessResponse<T> {
  return Boolean(value && typeof value === 'object' && (value as any).status === true && 'data' in (value as any));
}

export function isErrorResponse(value: unknown): value is ErrorResponse {
  return Boolean(value && typeof value === 'object' && (value as any).status === false && typeof (value as any).error === 'string');
}

function flattenErrors(errors: unknown): string[] {
  const result: string[] = [];

  if (errors === null || errors === undefined) {
    return result;
  }

  if (typeof errors === 'string') {
    result.push(errors);
    return result;
  }

  if (Array.isArray(errors)) {
    errors.forEach((item) => result.push(...flattenErrors(item)));
    return result;
  }

  if (typeof errors === 'object') {
    Object.entries(errors as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === 'string') {
        result.push(`${key}: ${value}`);
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === 'string') {
            result.push(`${key}: ${item}`);
          } else {
            result.push(...flattenErrors(item).map((line) => `${key}: ${line}`));
          }
        });
      } else if (value !== null && value !== undefined) {
        result.push(...flattenErrors(value).map((line) => `${key}: ${line}`));
      }
    });
    return result;
  }

  result.push(String(errors));
  return result;
}

export function formatApiError(error: unknown): { title: string; lines: string[] } {
  const normalized = normalizeApiError(error);

  if (normalized.type === 'backend') {
    const fieldErrors = flattenErrors(normalized.payload.errors);

    return {
      title: normalized.payload.error || 'Error del servidor',
      lines: fieldErrors.filter(Boolean),
    };
  }

  return {
    title: 'Error',
    lines: [normalized.message].filter(Boolean),
  };
}

export function showApiError(error: unknown, fallbackTitle = 'Error'): void {
  const { title, lines } = formatApiError(error);
  const displayTitle = title || fallbackTitle;

  if (lines.length === 0) {
    toast.error(displayTitle);
    return;
  }

  if (lines.length === 1) {
    toast.error(`${displayTitle}\n${lines[0]}`);
    return;
  }

  toast.error(
    createElement(
      'div',
      { className: 'space-y-1' },
      createElement('p', { className: 'font-medium' }, displayTitle),
      createElement(
        'ul',
        { className: 'list-disc pl-4 space-y-0.5 text-sm' },
        lines.map((line, idx) => createElement('li', { key: idx }, line))
      )
    )
  );
}

export function normalizeApiError(error: unknown): ApiErrorInfo {
  if (typeof error === 'object' && error !== null && (error as any).type === 'backend' && (error as any).payload) {
    const backendPayload = (error as any).payload as ErrorResponse;
    return {
      type: 'backend',
      payload: backendPayload,
      message: backendPayload.error || 'Error del servidor',
    };
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<unknown>;
    const responseData = axiosError.response?.data;

    if (isErrorResponse(responseData)) {
      return {
        type: 'backend',
        payload: responseData,
        message: responseData.error || 'Error del servidor',
      };
    }

    return {
      type: 'axios',
      message: axiosError.message,
      status: axiosError.response?.status,
      details: axiosError.response?.data,
    };
  }

  if (isErrorResponse(error)) {
    return {
      type: 'backend',
      payload: error as ErrorResponse,
      message: (error as ErrorResponse).error || 'Error del servidor',
    };
  }

  return {
    type: 'unknown',
    message: error instanceof Error ? error.message : String(error),
    original: error,
  };
}

api.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    const payload = response.data;

    if (isSuccessResponse<any>(payload)) {
      return payload.data;
    }

    if (isErrorResponse(payload)) {
      return Promise.reject({ type: 'backend', payload, message: payload.error });
    }

    return response.data;
  },
  async (error: AxiosError<unknown>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const url = originalRequest?.url ?? '';

    if (error.response?.status === 401 && !originalRequest._retry && !url.includes('/auth/refresh/') && !url.includes('/auth/clear-session/')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh/');
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        try {
          await api.post('/auth/clear-session/');
        } catch {
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('session-expired'));
        }
        toast.error('Tu sesión ha expirado. Inicia sesión de nuevo.');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.data && isErrorResponse(error.response.data)) {
      return Promise.reject({
        type: 'backend',
        payload: error.response.data,
        message: error.response.data.error,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
