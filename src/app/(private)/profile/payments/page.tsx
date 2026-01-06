"use client";

import { useEffect, useState } from "react";
import { getMyOrders, Order } from "@/services/orders/orders.api";

type Filter = "ALL" | "PAID" | "UNPAID";

export default function PaymentsList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error("Ошибка загрузки ордеров:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "PAID") return order.status === "ACTIVE";
    if (filter === "UNPAID") return order.status === "PENDING";
    return true;
  });

  const handlePay = (order: Order) => {
    console.log("Оплатить заказ:", order.id);
    // интеграция платёжки
  };

  const handleDownloadReceipt = (order: Order) => {
    console.log("Скачать чек:", order.id);
    // интеграция скачивания чека
  };

  if (loading) return <p>Загрузка ордеров...</p>;
  if (!orders.length) return <p>Пока нет ордеров</p>;

  const getStatusProps = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { color: "bg-[#05DF72]", text: "Оплачено", icon: "✅" };
      case "PENDING":
        return { color: "bg-[#FF7A00]", text: "Не оплачено", icon: "⏳" };
      case "CANCELED":
        return { color: "bg-gray-500", text: "Отменено", icon: "❌" };
      default:
        return { color: "bg-gray-400", text: status, icon: "" };
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Фильтр */}
      <div className="flex gap-2 mb-4">
        {(["ALL", "PAID", "UNPAID"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded font-medium transition ${
              filter === f
                ? "bg-[#FF7A00] text-white"
                : "bg-[#2A2A2A] text-gray-400 hover:bg-[#454444]"
            }`}
          >
            {f === "ALL" ? "Все" : f === "PAID" ? "Оплаченные" : "Неоплаченные"}
          </button>
        ))}
      </div>

      {/* Grid ордеров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => {
            const statusProps = getStatusProps(order.status);
            const courseUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/catalog/courses/info?id=${order.course.id}`;

            return (
              <div
                key={order.id}
                className="flex flex-col justify-between border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition bg-[#1A1A1A] border-[#2A2A2A]"
              >
                {/* Полоса статуса сверху */}
                <div className={`${statusProps.color} text-white font-semibold text-center py-1 text-sm`}>
                  {statusProps.icon} {statusProps.text}
                </div>

                {order.course.image?.[0] && (
                  <img
                    src={order.course.image[0]}
                    alt={order.course.name}
                    className="w-full h-40 object-cover"
                  />
                )}

                <div className="p-4 flex flex-col gap-2">
                  {/* Название курса с ссылкой */}
                  <a
                    href={courseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF7A00] font-semibold text-lg hover:underline"
                  >
                    {order.course.name}
                  </a>

                  <p className="text-[#999]">{order.course.price.toLocaleString("ru-RU")} UZS</p>
                </div>

                <div className="p-4 flex flex-wrap gap-2 border-t border-[#2A2A2A]">
                  {order.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handlePay(order)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Оплатить
                      </button>
                    </>
                  )}
                  {order.status === "ACTIVE" && (
                    <button
                      onClick={() => handleDownloadReceipt(order)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Скачать чек
                    </button>
                  )}
                  {order.status === "CANCELED" && (
                    <span className="text-gray-400">Заказ отменён</span>
                  )}
                </div>
              </div>
            );
          })}

      </div>
    </div>
  );
}
