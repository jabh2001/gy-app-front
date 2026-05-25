import axios, { type AxiosError, type AxiosResponse } from 'axios';

export const baseURL = 'http://127.0.0.1:5000/api';
// export const baseURL = '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.defaults.xsrfCookieName = 'csrf_access_token';
api.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';

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

export function normalizeApiError(error: unknown): ApiErrorInfo {
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
  (error: AxiosError<unknown>) => {
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
