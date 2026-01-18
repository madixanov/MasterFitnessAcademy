"use client";

import Image from "next/image";
import { useState } from "react";
import { createPayment } from "@/services/payment/payment.api";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  orderId?: string;
  setPaying?: (value: boolean) => void;
}

const paymentMethods = [
  { name: "Click", logo: "/payment/click_logo.png", currency: "UZS", disabled: false },
  { name: "Payme", logo: "/payment/payme.png", currency: "UZS", disabled: true },
  { name: "Uzum", logo: "/payment/uzum.png", currency: "UZS", disabled: true },
];

export default function PaymentModal({ open, onClose, orderId, setPaying }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open || !orderId) return null;

  const handlePayment = async (methodName: string) => {
    if (loading) return;

    try {
      setLoading(true);
      setPaying?.(true);

      const redirectUrlFront = window.location.origin;
      const paymentUrl = await createPayment({
        orderId,
        redirect_url_front: redirectUrlFront,
      });

      if (typeof paymentUrl === 'string' && paymentUrl.startsWith('http')) {
        // Очищаем на случай, если пришло "https://link.com" (с кавычками внутри строки)
        const cleanUrl = paymentUrl.replace(/^"|"$/g, '');
        window.location.href = cleanUrl;
      } else {
        console.error("Получен некорректный URL:", paymentUrl);
      }
    } catch (err) {
      console.error("Ошибка при создании платежа:", err);
      alert("Не удалось создать платеж. Попробуйте снова.");
    } finally {
      setLoading(false);
      setPaying?.(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] rounded-3xl p-8 max-w-[960px] w-full text-white">
        <h3 className="text-2xl font-semibold text-white mb-3">Способ оплаты</h3>
        <p className="text-base text-[#999] mb-6">Выберите удобный способ оплаты</p>

        <div className="grid grid-cols-3 gap-6">
          {paymentMethods.map((method) => {
            const isDisabled = loading || method.disabled;

            return (
              <button
                key={method.name}
                onClick={() => !method.disabled && handlePayment(method.name)}
                disabled={isDisabled}
                className={`rounded-2xl overflow-hidden flex flex-col border border-transparent shadow-lg transition ${
                  method.disabled ? "cursor-not-allowed opacity-50 grayscale" : "hover:scale-105 hover:shadow-xl"
                }`}
              >
                <div className="bg-white flex items-center justify-center p-4 h-[120px] relative">
                  <Image src={method.logo} alt={method.name} width={120} height={60} className="object-contain" />
                  {method.disabled && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="text-3xl">🔒</span>
                    </div>
                  )}
                </div>

                <div className="bg-[#202020] text-center p-3 flex flex-col items-center gap-1">
                  <p className="text-base font-semibold text-white">{method.name}</p>
                  {method.disabled ? (
                    <p className="text-xs text-[#999]">Скоро будет доступно</p>
                  ) : (
                    <p className="text-sm text-[#FF7A00]">{method.currency}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button onClick={onClose} className="w-full mt-6 text-md text-[#999] hover:text-white transition">
          Отмена
        </button>
      </div>
    </div>
  );
}
