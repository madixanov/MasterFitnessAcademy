import { apiClient } from "@/services/apiClient";

export interface PaymentPayload {
  courseId: string;
  amount: number;
}

/** ------------------------
 * Создание платежа
 * ------------------------ */
export const createPayment = async (
  payload: PaymentPayload,
  includeCredentials = false // 🔹 по умолчанию false, можно включить при необходимости
): Promise<{ paymentUrl: string }> => {
  return apiClient<{ paymentUrl: string }>("/payments/test-click/prepare", {
    method: "POST",
    body: JSON.stringify(payload),
    includeCredentials,
  });
};
