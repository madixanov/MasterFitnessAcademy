import { apiClient } from "../apiClient";

export interface QrCode {
  id?: string;
  title: string;
  photo_url: string;
}

// Получить QR-коды (для основного сайта)
export const getQrCodes = async (): Promise<QrCode[]> => {
  return apiClient<QrCode[]>("/qrcode");
};