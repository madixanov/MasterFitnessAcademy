import { CircleCheckBig, CreditCard, Calendar } from "lucide-react";

export default function PaymentStatus() {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-10">
      <div className="w-full bg-[linear-gradient(90deg,#FF7A0033_20%,#FF7A000D_80%)] p-10 border border-[#FF7A00]/20 rounded-md">
        <article className="flex flex-col">
          <h3 className="flex text-xl items-center"><Calendar className="mr-4 text-[#FF7A00]"/>Следующий платёж</h3>
          <h2 className="mb-7 text-4xl">5000$</h2>
          <span className="text-[#999]">Декабрь 2025</span>
          <span className="text-[#999] mb-7">Дата: 01.12.2025</span>
          <button className="flex items-center w-full justify-center bg-[#FF7A00] py-1.5 rounded-lg">
            <CreditCard className="w-4 h-4 mr-6"/>Оплатить
            </button>
        </article>
      </div>
      <div className="w-full p-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md">
        <article>
          <h3 className="text-xl mb-7">Всего оплачено</h3>
          <h2 className="text-[#FF7A00] text-4xl mb-3">25000$</h2>
          <span className="text-[#999]">За весь период</span>
        </article>
      </div>
      <div className="w-full p-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md">
        <h3 className="text-xl mb-7">Статус</h3>
        <span className="mb-6 inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-4 py-1 rounded-lg text-xs font-medium border border-[#00C950]/30">
          <CircleCheckBig className="w-4 h-4" /> Все платежи оплачены
        </span>
        <p className="text-[#999]">Задолжностей нет</p>
      </div>
    </div>
  )
}