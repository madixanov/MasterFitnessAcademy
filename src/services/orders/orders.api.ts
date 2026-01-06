import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";

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
  status: "ACTIVE" | "PENDING" | "CANCELED";
  createdAt: string;

  course: OrderCourse;
  payments: Payment[];
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

export const getMyOrders = async (): Promise<Order[]> => {
  const token = Cookies.get("token");

  if (!token) throw new Error("Нет токена");

  return apiClient<Order[]>("/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

