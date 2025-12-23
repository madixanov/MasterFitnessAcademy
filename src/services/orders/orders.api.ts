import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";

export interface OrderPayload {
  courseId: string;
}

export const createOrder = async (payload: OrderPayload) => {
  const token = Cookies.get("token"); // или как у тебя называется

  if (!token) throw new Error("Нет токена для авторизации");

  return apiClient("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
};
