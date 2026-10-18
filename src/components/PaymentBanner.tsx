// PaymentBannerContainer.tsx
"use client";

import { useEffect, useState } from "react";
import { getMyOrders } from "@/services/orders/orders.api";
import PaymentModal from "./UI/payment/PaymentModal";

type OrderStatus = "ACTIVE" | "PENDING" | "CANCELED";

interface Order {
  id: string;
  status: OrderStatus;
  course: {
    id: string;
    name: string;
    price: number; // в UZS
  };
}

export default function PaymentBannerContainer() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    getMyOrders()
      .then((orders) => {
        const relevantOrder =
          orders.find((o) => o.status === "PENDING") ??
          orders.find((o) => o.status === "ACTIVE") ??
          null;

        setOrder(relevantOrder);
      })
      .catch((err) => {
        console.error("Ошибка загрузки ордеров:", err);
        setError(err instanceof Error ? err.message : "Не удалось загрузить заказ");
      })
      .finally(() => setLoading(false));
  }, [retryCount]);

  if (loading) return null;
  if (error) {
    return (
      <div role="alert" className="mb-10 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">
        <p>Не удалось проверить статус заказа: {error}</p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setError(null);
            setRetryCount((count) => count + 1);
          }}
          className="mt-3 rounded bg-red-500/20 px-4 py-2 font-medium hover:bg-red-500/30"
        >
          Повторить
        </button>
      </div>
    );
  }
  if (!order) return null;

  return (
    <PaymentBanner order={order} paying={paying} setPaying={setPaying} />
  );
}

interface PaymentBannerProps {
  order: Order;
  paying: boolean;
  setPaying: (value: boolean) => void;
}

function PaymentBanner({ order, paying, setPaying }: PaymentBannerProps) {
  const [open, setOpen] = useState(false);

  if (order.status === "ACTIVE") return null;
  const isCanceled = order.status === "CANCELED";

  return (
    <div className="w-full bg-[#1A1A1A] border border-[#FF7A00] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-[#FF7A00]">
          {isCanceled ? "Заказ отменён" : "Курс не оплачен"}
        </h3>

        <p className="text-white font-medium">{order.course.name}</p>

        <p className="text-[#999]">
          {isCanceled
            ? "Для продолжения обучения оформите заказ повторно"
            : "Для продолжения обучения необходимо оплатить курс"}
        </p>

        {!isCanceled && (
          <p className="text-[#FF7A00] font-semibold">
            Сумма к оплате: {order.course.price.toLocaleString("ru-RU")} UZS
          </p>
        )}
      </div>

      {!isCanceled && (
        <button
          onClick={() => setOpen(true)}
          disabled={paying}
          className="px-5 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#FF7A00]/80 transition disabled:opacity-50"
        >
          {paying ? "Создание платежа..." : "Оплатить"}
        </button>
      )}

      {/* Передаем orderId в модалку */}
      <PaymentModal
        open={open}
        onClose={() => setOpen(false)}
        orderId={order.id}
        setPaying={setPaying}
      />
    </div>
  );
}
