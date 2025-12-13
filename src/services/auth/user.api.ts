import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";

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

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Content-Type не указываем
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Ошибка при загрузке фото: ${errorText}`);
  }

  return res.json();
}