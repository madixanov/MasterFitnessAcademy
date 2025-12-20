import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";

export interface UpdateUserPayload {
  name?: string;
  phoneNumber?: string;
  img?: string;
}

export const getProfile = async (accessToken: string): Promise<any> => {
  return apiClient<any>("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export async function uploadProfilePhoto(file: File) {
  const token = Cookies.get("token");
  if (!token) throw new Error("Нет токена");

  const formData = new FormData();
  formData.append("image", file, file.name);

  // В fetch с FormData НЕ ставим Content-Type
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Ошибка при загрузке фото");
  }

  return res.json(); // возвращаем то, что отдаёт сервер
}

export async function patchUser(
  userId: string,
  payload: UpdateUserPayload
): Promise<any> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Нет токена");

  return apiClient<any>(`/user/user/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}