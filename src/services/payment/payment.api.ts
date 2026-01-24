import Cookies from "js-cookie";

export interface PaymentPayload {
  orderId: string;
  redirect_url_front: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL не задан");

/** ------------------------
 * Создание платежа
 * ------------------------ */
export const createPayment = async (
  payload: PaymentPayload
): Promise<string> => {
  // ⚠️ токен берём ВНУТРИ функции
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/payments/redirect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Ошибка создания платежа");
  }

  // сервер возвращает plain text (URL)
  const paymentUrl = await response.text();

  console.log("URL из ответа:", paymentUrl);
  return paymentUrl;
};
