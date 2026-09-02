import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { getAccessToken } from "@/stores/auth";
import { ApiClientError } from "./errors";
import { type ApiErrorResponse } from "./types";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
