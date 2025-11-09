import PaymentStatus from "./components/PaymentStatus";
import PaymentTable from "./components/PaymentTable";

export default function Payments() {
  return (
    <main>
        <h1 className="text-4xl font-medium pl-15 lg:pl-0 mb-3">Платежи</h1>
        <p className="text-sm text-[#999] lg:text-lg mb-10">Истори и управвление платежами</p>
        <section className="flex flex-col gap-10">
          <PaymentStatus />
          <PaymentTable />
        </section>
    </main>
  )
}