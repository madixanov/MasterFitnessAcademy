import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";

export interface PaymentPayload {
  orderId: string;
  redirect_url_front: string;
}

/** ------------------------
 * Создание платежа
 * ------------------------ */
const token = Cookies.get("accessToken");

export const createPayment = async (payload: PaymentPayload): Promise<string> => {
  const response = await fetch("/api/payments/redirect", { // предполагаю, что внутри apiClient обычный fetch
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  // Если сервер возвращает просто строку, используйте .text(), а не .json()
  const paymentUrl = await response.text(); 

  console.log("URL из ответа:", paymentUrl);
  return paymentUrl;
};
