import Cookies from "js-cookie";
import { ApiError, apiClient } from "@/services/apiClient";

export interface UserProfile {
  id: string;
  name: string;
  surname?: string;
  email: string;
  phoneNumber?: string;
  img?: string | null;
  createdAt: string;
}

export interface UpdateUserPayload {
  name?: string;
  phoneNumber?: string;
  img?: string;
}

/**
 * Получение профиля пользователя
 */
export const getProfile = async (): Promise<UserProfile> => {
  const token = Cookies.get("accessToken");
  return apiClient<UserProfile>("/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

/**
 * Загрузка фото профиля
 */
export async function uploadProfilePhoto(file: File): Promise<unknown> {
  const token = Cookies.get("accessToken");

  const formData = new FormData();
  formData.append("image", file, file.name);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/upload`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) {
    const body = await res.text();
    let message = body;
    try {
      const payload = JSON.parse(body) as { message?: unknown; error?: unknown };
      message =
        (typeof payload.message === "string" && payload.message) ||
        (typeof payload.error === "string" && payload.error) ||
        body;
    } catch {
      // Non-JSON error responses use their text body as the message.
    }
    throw new ApiError(
      message || "Ошибка при загрузке фото",
      res.status
    );
  }

  return res.json();
}

/**
 * Обновление данных пользователя
 */
export async function patchUser(
  userId: string,
  payload: UpdateUserPayload
): Promise<UserProfile> {
  const token = Cookies.get("accessToken");

  return apiClient<UserProfile>(`/user/user/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
}
