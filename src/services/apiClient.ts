import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL не задан");

export interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
  skipAuth?: boolean;          
  includeCredentials?: boolean; // оставляем только для refresh токена
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  // получаем токен из cookie
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

  let data: T | null = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    if (res.status === 401 && !options.skipAuth) {
      // ⚡️ редирект на клиенте
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
        return new Promise(() => {}); // чтобы код дальше не выполнялся
      }
    }
    throw new Error((data as any)?.message || "Произошла ошибка");
  }

  return data as T;
}
