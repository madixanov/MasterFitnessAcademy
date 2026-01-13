import Cookies from "js-cookie";
import { refreshToken } from "./auth/refreshToken";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL не задан");

export interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
  skipAuth?: boolean; // 🔥 важно
}

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

export async function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const token = Cookies.get("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token && !options.skipAuth) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // ✅ токен протух
  if (res.status === 401 && !options.skipAuth) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        refreshQueue.forEach(cb => cb(newToken));
        refreshQueue = [];
      } catch (e) {
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        throw e;
      } finally {
        isRefreshing = false;
      }
    }

    // ⏳ ждём, пока обновится токен
    return new Promise<T>(resolve => {
      refreshQueue.push((newToken: string) => {
        resolve(
          apiClient<T>(endpoint, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          })
        );
      });
    });
  }

  let data: T | null = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error((data as any)?.message || "Произошла ошибка");
  }

  return data as T;
}
