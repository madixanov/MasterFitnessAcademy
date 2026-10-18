import Cookies from "js-cookie";
import { withApiErrorToast } from "./apiErrorToast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL не задан");

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
  skipAuth?: boolean;
  includeCredentials?: boolean; // оставляем только для refresh токена
}

async function readResponseBody(res: Response): Promise<unknown> {
  const body = await res.text();
  if (!body) return null;

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(body) as unknown;
    } catch {
      if (res.ok) {
        throw new ApiError("Сервер вернул некорректный JSON", res.status);
      }
    }
  }

  return body;
}

async function apiClientRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const token = Cookies.get("accessToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: options.includeCredentials ? "include" : "same-origin",
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
  const data = await readResponseBody(res);

  if (!res.ok) {
    if (res.status === 401 && !options.skipAuth) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    }
    const payload = data && typeof data === "object" ? data as Record<string, unknown> : null;
    const message =
      (typeof payload?.message === "string" && payload.message) ||
      (typeof payload?.error === "string" && payload.error) ||
      (typeof data === "string" && data) ||
      res.statusText ||
      "Произошла ошибка";
    throw new ApiError(message, res.status);
  }

  return data as T;
}

export function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  return withApiErrorToast(() => apiClientRequest<T>(endpoint, options));
}
