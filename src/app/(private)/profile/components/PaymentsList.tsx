"use client"

import { useEffect, useState } from "react"
import { CircleCheckBig, CircleAlert } from "lucide-react"
import { getMyOrders, Order } from "@/services/orders/orders.api"

export default function PaymentsList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getMyOrders()
        setOrders(data)
      } catch (err) {
        console.error("Ошибка загрузки ордеров:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) return <p>Загрузка ордеров...</p>
  if (!orders.length) return <p>Пока нет ордеров</p>

  return (
    <div className="w-full p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
      <h2 className="mb-5 text-lg font-semibold">Платежи</h2>
      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const isPaid = order.status === "ACTIVE"
          const isPending = order.status === "PENDING"

          return (
            <div
              key={order.id}
              className="flex justify-between items-center w-full p-3 bg-[#2A2A2A] rounded-md"
            >
              <article className="flex flex-col">
                <h2 className="font-medium">{order.course.name}</h2>
                <span className="text-sm text-[#999]">
                  {order.course.price.toLocaleString("ru-RU")} UZS
                </span>
                <span className="text-xs text-[#999] mt-1">
                  {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </article>

              {isPaid ? (
                <span className="inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#00C950]/30">
                  <CircleCheckBig className="w-4 h-4" /> Оплачено
                </span>
              ) : isPending ? (
                <span className="inline-flex items-center gap-2 text-[#FDC700] bg-[#F0B100]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#F0B100]/30">
                  <CircleAlert className="w-4 h-4" /> Ожидает оплаты
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-red-500 bg-red-100/20 px-4 py-1 rounded-xl text-xs font-medium border border-red-200">
                  Отменён
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
