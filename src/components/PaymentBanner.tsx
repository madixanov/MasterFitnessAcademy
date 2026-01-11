"use client";

import { useEffect, useState } from "react";
import { getMyOrders } from "@/services/orders/orders.api";
import { createPayment, PaymentPayload } from "@/services/payment/payment.api";

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

  useEffect(() => {
    getMyOrders()
      .then(orders => {
        // приоритет: PENDING → ACTIVE
        const relevantOrder =
          orders.find(o => o.status === "PENDING") ??
          orders.find(o => o.status === "ACTIVE") ??
          null;

        setOrder(relevantOrder);
      })
      .catch(err => {
        console.error("Ошибка загрузки ордеров:", err);
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !order) return null;

  return (
    <PaymentBanner
      order={order}
      paying={paying}
      setPaying={setPaying}
    />
  );
}

interface PaymentBannerProps {
  order: {
    id: string;
    status: "ACTIVE" | "PENDING" | "CANCELED";
    course: {
      id: string;
      name: string;
      price: number;
    };
  };
  paying: boolean;
  setPaying: (value: boolean) => void;
}

function PaymentBanner({ order, paying, setPaying }: PaymentBannerProps) {
  if (order.status === "ACTIVE") return null;
  const isCanceled = order.status === "CANCELED";

  const handlePayment = async () => {
    try {
      setPaying(true);

      const payload: PaymentPayload = {
        courseId: order.course.id,
        amount: Math.round(order.course.price), // в тийны
      };

      const { paymentUrl } = await createPayment(payload);
      console.log(paymentUrl)

      //if (paymentUrl) {
      //  window.location.href = paymentUrl; // редирект на Click/Payme
      //} else {
      //  alert("Ошибка создания платежа. Попробуйте позже.");
      //}
    } catch (err) {
      console.error(err);
      alert("Ошибка при оплате. Попробуйте снова.");
    } finally {
      setPaying(false);
    }
  };


  return (
    <div className="w-full bg-[#1A1A1A] border border-[#FF7A00] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-[#FF7A00]">
          {isCanceled ? "Заказ отменён" : "Курс не оплачен"}
        </h3>

        <p className="text-white font-medium">
          {order.course.name}
        </p>

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
          onClick={handlePayment}
          disabled={paying}
          className="px-5 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#FF7A00]/80 transition disabled:opacity-50"
        >
          {paying ? "Создание платежа..." : "Оплатить"}
        </button>
      )}
    </div>
  );
}
