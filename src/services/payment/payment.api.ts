import Cookies from "js-cookie";
import { withApiErrorToast } from "../apiErrorToast";

export interface PaymentPayload {
  orderId: string;
  redirect_url_front: string;
}

/** ------------------------
 * Создание платежа
 * ------------------------ */
const createPaymentRequest = async (payload: PaymentPayload): Promise<string> => {
  const token = Cookies.get("accessToken");
  const response = await fetch("/api/payments/redirect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const paymentUrl = await response.text();

  if (!response.ok) {
    throw new Error(paymentUrl || `Не удалось создать платеж (${response.status})`);
  }
  if (!paymentUrl.trim()) {
    throw new Error("Платежная система не вернула ссылку на оплату");
  }

  return paymentUrl;
};

export const createPayment = (payload: PaymentPayload): Promise<string> =>
  withApiErrorToast(() => createPaymentRequest(payload));
