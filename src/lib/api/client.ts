import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  clearAuth,
  getAccessToken,
  setAccessToken,
} from "@/stores/auth";
import { ApiClientError } from "./errors";
import { type ApiErrorResponse } from "./types";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
  // Credentials are required so the browser stores and sends the httpOnly
  // `refresh_token` cookie that the BE sets on login/refresh.
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---- Token refresh on 401 ---- */

const REFRESH_PATH = "/auth/refresh";
const RETRY_FLAG = "_authRetried";

let refreshPromise: Promise<void> | null = null;

function isRefreshRequest(url?: string): boolean {
  return url?.endsWith(REFRESH_PATH) ?? false;
}

function redirectToSignIn(): void {
  if (typeof window !== "undefined") {
    window.location.assign("/auth/sign-in");
  }
}

/**
 * Exchanges the httpOnly `refresh_token` cookie for a new access token. A
 * single shared promise deduplicates concurrent 401s so the browser only ever
 * calls /auth/refresh once per batch. On failure the session is cleared and the
 * user is bounced to sign-in.
 */
export function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ success: boolean; data: { accessToken: string } }>(
        `${baseURL}/auth/refresh`,
        null,
        { withCredentials: true, timeout: 30_000 }
      )
      .then((response) => {
        setAccessToken(response.data.data.accessToken);
      })
      .catch((error: unknown) => {
        clearAuth();
        redirectToSignIn();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as
      | (InternalAxiosRequestConfig & { [RETRY_FLAG]?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      config &&
      !config[RETRY_FLAG] &&
      !isRefreshRequest(config.url)
    ) {
      config[RETRY_FLAG] = true;
      try {
        await refreshAccessToken();
        return apiClient(config);
      } catch (refreshError) {
        // Auth was cleared and the user redirected by refreshAccessToken.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

function unwrap<T>(
  response: AxiosResponse<{ success: boolean; data: T }>
): T {
  return response.data.data;
}

function toApiError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) return error;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const payload = axiosError.response?.data;
    if (payload?.error) {
      return new ApiClientError(
        payload.error.code,
        payload.error.message,
        axiosError.response?.status,
        payload.error.details
      );
    }
    return new ApiClientError(
      "NETWORK_ERROR",
      "Unable to reach the server. Please check your connection and try again.",
      axiosError.response?.status
    );
  }

  return new ApiClientError(
    "UNKNOWN_ERROR",
    "An unexpected error occurred. Please try again."
  );
}

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.get<{ success: boolean; data: T }>(
      url,
      config
    );
    return unwrap<T>(response);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function post<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.post<{ success: boolean; data: T }>(
      url,
      body,
      config
    );
    return unwrap<T>(response);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function patch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.patch<{ success: boolean; data: T }>(
      url,
      body,
      config
    );
    return unwrap<T>(response);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function put<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.put<{ success: boolean; data: T }>(
      url,
      body,
      config
    );
    return unwrap<T>(response);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.delete<{ success: boolean; data: T }>(
      url,
      config
    );
    return unwrap<T>(response);
  } catch (error) {
    throw toApiError(error);
  }
}
