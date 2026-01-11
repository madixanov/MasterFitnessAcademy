import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";

export interface PaymentPayload {
  courseId: string;
  amount: number;
}

// ------------------------
// Создание платежа
// ------------------------
export const createPayment = async (payload: PaymentPayload): Promise<{ paymentUrl: string }> => {
  const token = Cookies.get("token");

  if (!token) throw new Error("Нет токена для авторизации");

  return apiClient<{ paymentUrl: string }>("/payments/test-click/prepare", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
};
