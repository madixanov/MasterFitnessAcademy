import React from "react";
import { CircleCheckBig, Download } from "lucide-react";

const payments = [
  {
    id: "INV-2025-11",
    date: "01.11.2025",
    period: "Ноябрь 2025",
    type: "Банковская карта",
    price: "5000$",
    status: "Оплачено",
  },
  {
    id: "INV-2025-11",
    date: "01.11.2025",
    period: "Ноябрь 2025",
    type: "Банковская карта",
    price: "5000$",
    status: "Оплачено",
  },
  {
    id: "INV-2025-11",
    date: "01.11.2025",
    period: "Ноябрь 2025",
    type: "Банковская карта",
    price: "5000$",
    status: "Оплачено",
  },
  {
    id: "INV-2025-11",
    date: "01.11.2025",
    period: "Ноябрь 2025",
    type: "Банковская карта",
    price: "5000$",
    status: "Оплачено",
  },
  {
    id: "INV-2025-11",
    date: "01.11.2025",
    period: "Ноябрь 2025",
    type: "Банковская карта",
    price: "5000$",
    status: "Оплачено",
  },
  {
    id: "INV-2025-11",
    date: "01.11.2025",
    period: "Ноябрь 2025",
    type: "Банковская карта",
    price: "5000$",
    status: "Оплачено",
  },
  {
    id: "INV-2025-11",
    date: "01.11.2025",
    period: "Ноябрь 2025",
    type: "Банковская карта",
    price: "5000$",
    status: "Оплачено",
  },
  {
    id: "INV-2025-11",
    date: "01.11.2025",
    period: "Ноябрь 2025",
    type: "Банковская карта",
    price: "5000$",
    status: "Оплачено",
  },
];

export default function PaymentTable() {
  return (
    <section className="md:bg-[#1A1A1A] md:border md:border-[#2A2A2A] rounded-md md:p-10">
      <h2 className="text-lg font-semibold mb-4">История платежей</h2>

      {/* TABLE for sm and up */}
      <div className="hidden sm:block">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-300">
              <th className="text-left py-2 font-medium pl-1 text-xl">Счёт</th>
              <th className="text-left py-2 font-medium text-xl">Дата</th>
              <th className="text-left py-2 font-medium text-xl">Период</th>
              <th className="text-left py-2 font-medium text-xl">Способо оплаты</th>
              <th className="text-left py-2 font-medium text-xl">Сумма</th>
              <th className="text-left py-2 font-medium text-xl">Статус</th>
              <th className="text-left py-2 font-medium text-xl">Действие</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, idx) => (
              <tr
                key={`${payment.id}-${idx}`}
                className="border-b border-gray-800 last:border-0 hover:bg-[#2a2a2a] transition"
              >
                <td className="py-3 lg:text-lg pl-1 text-[#999]">{payment.id}</td>
                <td className="py-3 lg:text-lg">{payment.date}</td>
                <td className="py-3 lg:text-lg">{payment.period}</td>
                <td className="py-3 lg:text-lg text-[#999]">{payment.type}</td>
                <td className="py-3 lg:text-lg">{payment.price}</td>
                <td className="py-3 lg:text-lg">
                  <span className="inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#00C950]/30">
                    <CircleCheckBig className="w-4 h-4" /> {payment.status}
                  </span>
                </td>
                <td className="py-3">
                  <button
                    aria-label={`Скачать квитанцию ${payment.id}`}
                    className="flex items-center bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-1 rounded-md"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Квитанция
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARDS for mobile (smaller than 640px) */}
      <div className="sm:hidden flex flex-col gap-4">
        {payments.map((payment, idx) => (
          <article
            key={`card-${payment.id}-${idx}`}
            className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-4 shadow-sm"
            aria-labelledby={`payment-${idx}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 id={`payment-${idx}`} className="text-sm font-medium text-white">
                  {payment.id}
                </h3>
                <p className="text-xs text-[#999] mt-1">{payment.type} • {payment.date}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{payment.price}</div>
                <div className="mt-1 inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-3 py-0.5 rounded-xl text-xs font-medium border border-[#00C950]/30">
                  <CircleCheckBig className="w-4 h-4" />{payment.status}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-[#999]">Период: <span className="text-white">{payment.period}</span></p>

              <button
                aria-label={`Скачать квитанцию ${payment.id}`}
                className="flex items-center gap-2 bg-transparent border border-[#2A2A2A] px-3 py-1 rounded-md text-sm"
              >
                <Download className="w-4 h-4" />
                Квитанция
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
