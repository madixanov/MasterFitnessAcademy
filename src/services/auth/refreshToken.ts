// services/auth/refreshToken.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface RefreshResponse {
  message: string;
}

// Функция просто вызывает endpoint, сервер обновляет httpOnly cookies
export async function refreshToken(): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include", // важно: отправляем cookies автоматически
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Refresh token истёк или отсутствует");

  // Сервер может вернуть сообщение или данные, если нужно
  const data: RefreshResponse = await res.json();
  return;
}
