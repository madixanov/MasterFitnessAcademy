import { apiClient } from "../apiClient";

export interface QrCode {
  id?: string;
  url: string;
}

// Получить QR-коды (для основного сайта)
export const getQrCodes = async (): Promise<QrCode[]> => {
  return apiClient<QrCode[]>("/qr-code");
};