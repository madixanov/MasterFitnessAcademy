import Cookies from "js-cookie";
import { apiClient } from "@/services/apiClient";

export interface UpdateUserPayload {
  name?: string;
  phoneNumber?: string;
  img?: string;
}

/**
 * Получение профиля пользователя
 */
export const getProfile = async (): Promise<any> => {
  const token = Cookies.get("accessToken");
  return apiClient<any>("/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

/**
 * Загрузка фото профиля
 */
export async function uploadProfilePhoto(file: File) {
  const token = Cookies.get("accessToken");

  const formData = new FormData();
  formData.append("image", file, file.name);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/upload`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) {
    throw new Error("Ошибка при загрузке фото");
  }

  return res.json();
}

/**
 * Обновление данных пользователя
 */
export async function patchUser(
  userId: string,
  payload: UpdateUserPayload
): Promise<any> {
  const token = Cookies.get("accessToken");

  return apiClient<any>(`/user/user/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
}
