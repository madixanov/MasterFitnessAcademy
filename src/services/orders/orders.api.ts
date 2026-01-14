import Cookies from "js-cookie";
import { apiClient } from "@/services/apiClient";

export interface OrderPayload {
  courseId: string;
}

export type OrderStatus = "ACTIVE" | "PENDING" | "CANCELED";

export interface Payment {
  id: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED";
  currency: "UZS" | "USD";
  orderId: string;
  userId: string;
  courseId: string;
  createdAt: string;
}

export interface OrderCourse {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string[];
  status: "ACTIVE" | "INACTIVE";
  date: string;
}

export interface Order {
  id: string;
  courseId: string;
  userId: string;
  status: OrderStatus;
  createdAt: string;

  course: OrderCourse;
  payments: Payment[];
}

/** ------------------------
 * Создание нового заказа
 * ------------------------ */
export const createOrder = async (payload: OrderPayload) => {
  const token = Cookies.get("accessToken");

  return apiClient("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
};

/** ------------------------
 * Получение всех моих заказов
 * ------------------------ */
export const getMyOrders = async (): Promise<Order[]> => {
  const token = Cookies.get("accessToken");

  try {
    return await apiClient<Order[]>("/orders", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  } catch (err: any) {
    console.error("Ошибка при получении моих заказов:", err.message);
    return [];
  }
};
