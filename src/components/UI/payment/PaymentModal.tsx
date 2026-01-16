"use client";

import Image from "next/image";
import { PaymentPayload } from "@/services/payment/payment.api";
import { usePayment } from "./usePayment";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  payload?: PaymentPayload;
}

export default function PaymentModal({
  open,
  onClose,
  payload,
}: PaymentModalProps) {
  const { paying } = usePayment();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-[#FF7A00] rounded-3xl p-8 max-w-[960px] w-full text-white">
        <h3 className="text-2xl font-semibold text-[#FF7A00] mb-3">
          Способ оплаты
        </h3>

        <p className="text-base text-[#999] mb-6">
          Выберите удобный способ оплаты
        </p>

        {/* ВСЕ СПОСОБЫ ОПЛАТЫ В ОДНОЙ ЛИНИИ */}
        <div className="grid grid-cols-3 gap-6">
          {["Click", "Payme", "Uzum"].map((method, idx) => (
            <button
              key={idx}
              onClick={() => console.log("оплатить", method)}
              disabled={paying}
              className="
                rounded-2xl overflow-hidden 
                border border-transparent 
                hover:scale-105
                shadow-lg hover:shadow-xl
                transition disabled:opacity-50 flex flex-col
              "
            >
              {/* Верхняя часть — фото */}
              <div className="bg-white flex items-center justify-center p-4">
                <Image
                  src="/payment/click_logo.png" // здесь можно заменить на метод
                  alt={method}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>

              {/* Нижняя часть — название и валюта */}
              <div className="bg-[#202020] text-center p-3 flex flex-col items-center justify-center gap-1">
                <p className="text-base font-semibold text-white">{method}</p>
                <p className="text-sm text-[#FF7A00]">UZS</p>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 text-sm text-[#999] hover:text-white transition"
        >
          Отмена
        </button>
      </div>
    </div>

  );
}
