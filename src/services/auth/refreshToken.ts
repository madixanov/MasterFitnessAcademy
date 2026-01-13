// services/auth/refreshToken.ts
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

export async function refreshToken(): Promise<string> {
  const refresh = Cookies.get("refreshToken");
  if (!refresh) throw new Error("Нет refreshToken");

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: refresh }),
  });

  if (!res.ok) throw new Error("Refresh token истёк");

  const data: RefreshResponse = await res.json();

  Cookies.set("token", data.accessToken, { path: "/" });
  if (data.refreshToken) {
    Cookies.set("refreshToken", data.refreshToken, { path: "/" });
  }

  return data.accessToken;
}
