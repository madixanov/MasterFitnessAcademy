"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
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
  const [timeLeft, setTimeLeft] = useState(5);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    if (!open) return;

    setShowQr(false);
    setTimeLeft(5);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowQr(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  if (!open || !orderId) return null;

  const handlePayment = async () => {
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 ">
      <div className="bg-[#1a1a1a] rounded-lg p-6 sm:p-8 max-w-5xl w-full text-white flex flex-col gap-8 overflow-auto max-h-[90vh] custom-scrollbar">

        <h2 className="text-2xl font-semibold text-center">
          Оплата
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ================= LEFT: ONLINE PAYMENT ================= */}
          <div className="flex-1 rounded-2xl p-5 flex flex-col items-center gap-4">
            <h3 className="text-xl font-semibold mb-4 text-center">
              💻 Оплатить на сайте
            </h3>

            <div className="flex flex-col items-center gap-4 overflow-x-auto pb-2 w-full sm:flex-wrap sm:overflow-visible">
                {paymentMethods.map((method) => {
                    const isDisabled = loading || method.disabled;

                    return (
                    <button
                        key={method.name}
                        onClick={() => !method.disabled && handlePayment()}
                        disabled={isDisabled}
                        className={`min-w-[180px] md:max-w-[320px] sm:min-w-0 w-full rounded-2xl overflow-hidden flex flex-col border transition ${
                        method.disabled
                            ? "cursor-not-allowed opacity-50 grayscale"
                            : "hover:scale-105 hover:shadow-xl"
                        }`}
                    >
                        <div className="bg-white flex items-center justify-center p-4 h-20 relative">
                        <Image
                            src={method.logo}
                            alt={method.name}
                            className="object-contain max-h-[150px]"
                        />

                        {method.disabled && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                            <span className="text-3xl">🔒</span>
                            </div>
                        )}
                        </div>

                        <div className="bg-[#202020] text-center p-1">
                            <p className="font-semibold text-sm">{method.name}</p>
                            {method.disabled ? (
                                <p className="text-xs text-gray-400">Скоро будет доступно</p>
                            ) : (
                                <p className="text-sm text-orange-500">{method.currency}</p>
                            )}
                        </div>
                    </button>
                    );
                })}
                </div>
          </div>

          {/* ================= RIGHT: QR PAYMENT ================= */}
          <div className="flex-1 bg-[#121212] rounded-2xl p-5 flex flex-col items-center gap-4">

            <h3 className="text-xl font-semibold">
              📱 Оплатить через QR
            </h3>

            {/* Instruction */}
            <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
              <li>Отсканируйте QR-код через банковское приложение</li>
              <li>Совершите оплату</li>
              <li>Сохраните чек</li>
              <li>Отправьте чек в Telegram администратору</li>
              <li>Ожидайте подтверждения</li>
            </ol>

            <div className="text-xs text-gray-400 border-t border-gray-700 pt-3 text-center">
              ⚠️ Без отправленного чека заказ не будет обработан
            </div>

            {/* Timer */}
            {!showQr && (
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">QR-код появится через:</p>
                <p className="text-3xl font-bold text-orange-500">{timeLeft}</p>
              </div>
            )}

            {/* QR */}
            {showQr && (
              <Image
                src="/payment/qr.jpg"
                alt="QR Code"
                className="w-full max-w-[180px] sm:max-w-[220px] md:max-w-[260px] aspect-square object-contain mt-2 mx-auto"
                />
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full text-gray-400 hover:text-white transition py-2 border border-gray-700 rounded-lg"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
