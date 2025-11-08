import { CircleCheckBig, CircleAlert } from "lucide-react"

const payments = [
  {date: "01.11.2025", price: "5000", status: "Ожидает"},
  {date: "01.10.2025", price: "5000", status: "Оплачено"},
  {date: "01.09.2025", price: "5000", status: "Оплачено"},
]

export default function PaymentsList() {
  return (
    <div className="w-full p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
      <h2 className="mb-5 text-lg font-semibold">Платежи</h2>
      <div className="flex flex-col gap-3">
        {payments.map((payment, index) => (
          <div key={index} className="flex justify-between items-center w-full p-3 bg-[#2A2A2A] rounded-md">
            <article className="flex flex-col">
              <h2>{payment.date}</h2>
              <span className="text-sm text-[#999]">{payment.price}</span>
            </article>
            {payment.status === "Оплачено" ? (
              <span className="inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#00C950]/30">
                <CircleCheckBig className="w-4 h-4" /> {payment.status}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-[#FDC700] bg-[#F0B100]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#F0B100]/30">
                <CircleAlert className="w-4 h-4" /> {payment.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}