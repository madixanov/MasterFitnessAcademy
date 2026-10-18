import Cookies from "js-cookie";

export interface PaymentPayload {
  orderId: string;
  redirect_url_front: string;
}

/** ------------------------
 * Создание платежа
 * ------------------------ */
export const createPayment = async (payload: PaymentPayload): Promise<string> => {
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
