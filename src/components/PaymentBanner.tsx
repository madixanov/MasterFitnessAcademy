export default function PaymentBanner() {
  return (
    <div className="w-full bg-[#1A1A1A] border border-[#FF7A00] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
      <div>
        <h3 className="text-xl font-semibold mb-1 text-[#FF7A00]">
          Курс не оплачен
        </h3>
        <p className="text-[#999]">
          Для продолжения обучения необходимо оплатить курс
        </p>
      </div>

      <button className="px-5 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#FF7A00]/80 transition">
        Оплатить
      </button>
    </div>
  );
}
