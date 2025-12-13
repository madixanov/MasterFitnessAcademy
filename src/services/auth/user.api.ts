import { apiClient } from "@/services/apiClient";

export const getProfile = async (accessToken: string): Promise<any> => {
  return apiClient<any>("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const uploadProfilePhoto = async (file: File, token: string): Promise<any> => {
  if (!token) throw new Error("Нет токена");

  const formData = new FormData();
  formData.append("image", file, file.name);

  // В fetch с FormData НЕ ставим Content-Type
  const res = await apiClient<any>("/auth/upload", {
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