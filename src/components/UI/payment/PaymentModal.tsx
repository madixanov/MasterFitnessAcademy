
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import { createPayment } from "@/services/payment/payment.api";
import { getSocialNetworks } from "@/services/socials/socials.api";
import { getQrCodes } from "@/services/qr/qr.api";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  orderId?: string;
  setPaying?: (value: boolean) => void;
}

const paymentMethods = [
  {
    name: "Click",
    logo: "/payment/click_logo.png",
    currency: "UZS",
    disabled: false,
  },
  {
    name: "Payme",
    logo: "/payment/payme.png",
    currency: "UZS",
    disabled: true,
  },
  {
    name: "Uzum",
    logo: "/payment/uzum.png",
    currency: "UZS",
    disabled: true,
  },
];

export default function PaymentModal({
  open,
  onClose,
  orderId,
  setPaying,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [showQr, setShowQr] = useState(false);
  const [telegramUrl, setTelegramUrl] = useState("");

  const [qrCode, setQrCode] = useState<{
    url: string;
  } | null>(null);

  // Загрузка ссылки на Telegram
  useEffect(() => {
    const loadTelegram = async () => {
      try {
        const socials = await getSocialNetworks();

        const consulting = socials.find(
          (item) => item.name?.toLowerCase() === "consulting"
        );

        if (consulting?.url) {
          setTelegramUrl(consulting.url);
        } else {
          setTelegramUrl("");
        }
      } catch (err) {
        console.error("Ошибка загрузки соцсетей:", err);
        setTelegramUrl("");
      }
    };

    loadTelegram();
  }, []);

  // Загрузка QR-кода
  useEffect(() => {
    const loadQr = async () => {
      try {
        const data = await getQrCodes();

        if (data && data.length > 0 && data[0]?.url) {
          setQrCode({
            url: data[0].url,
          });
        } else {
          setQrCode(null);
        }
      } catch (err) {
        console.error("Ошибка загрузки QR:", err);
        setQrCode(null);
      }
    };

    loadQr();
  }, []);

  // Таймер отображения QR-кода
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

  // Создание платежа через платёжную систему
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

      if (typeof paymentUrl === "string") {
        const cleanUrl = paymentUrl.replace(/^"|"$/g, "");

        if (/^https?:\/\//i.test(cleanUrl)) {
          window.location.href = cleanUrl;
        } else {
          console.error("Получен некорректный URL:", paymentUrl);
          alert("Платёжная система вернула некорректную ссылку");
        }
      } else {
        console.error("Получен некорректный URL:", paymentUrl);
        alert("Не удалось получить ссылку на оплату");
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#1a1a1a] rounded-lg p-6 sm:p-8 max-w-5xl w-full text-white flex flex-col gap-8 overflow-auto max-h-[90vh] custom-scrollbar">
        <h2 className="text-2xl font-semibold text-center">
          Оплата
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Левая сторона: онлайн-оплата */}
          {/* <div className="flex-1 rounded-2xl p-5 flex flex-col items-center gap-4">
            <h3 className="text-xl font-semibold mb-4 text-center">
              💻 Оплатить на сайте
            </h3>

            <div className="flex flex-col items-center gap-4 overflow-x-auto pb-2 w-full sm:flex-wrap sm:overflow-visible">
              {paymentMethods.map((method) => {
                const isDisabled = loading || method.disabled;

                return (
                  <button
                    key={method.name}
                    type="button"
                    onClick={() => {
                      if (!method.disabled) {
                        void handlePayment();
                      }
                    }}
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
                        fill
                        className="object-contain max-h-[150px]"
                      />

                      {method.disabled && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <span className="text-3xl">🔒</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-[#202020] text-center p-1">
                      <p className="font-semibold text-sm">
                        {method.name}
                      </p>

                      {method.disabled ? (
                        <p className="text-xs text-gray-400">
                          Скоро будет доступно
                        </p>
                      ) : (
                        <p className="text-sm text-orange-500">
                          {method.currency}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div> */}

          {/* Правая сторона: оплата по QR-коду */}
          <div className="flex-1 bg-[#121212] rounded-2xl p-5 flex flex-col items-center gap-4">
            <h3 className="text-xl font-semibold">
              📱 Оплатить через QR
            </h3>

            {/* Инструкция */}
            <div className="w-full bg-[#1b1b1b] border border-red-500/30 rounded-xl p-4">
              <div className="mb-4 text-center">
                <p className="text-red-500 font-bold text-lg">
                  ⚠️ ВАЖНО
                </p>

                <p className="text-sm text-gray-300 mt-2">
                  После оплаты ОБЯЗАТЕЛЬНО отправьте чек администратору.
                </p>

                <p className="text-xs text-red-400 mt-2">
                  Без чека заказ НЕ будет подтвержден и НЕ будет обработан.
                </p>
              </div>

              <ol className="space-y-3 text-sm text-gray-300 list-decimal list-inside">
                <li>
                  Отсканируйте QR-код через банковское приложение
                </li>

                <li>Совершите оплату</li>

                <li className="text-orange-400 font-medium">
                  Обязательно сохраните чек или скриншот оплаты
                </li>

                <li className="text-red-400 font-semibold">
                  Сразу отправьте чек администратору в Telegram
                </li>

                <li>Ожидайте подтверждения оплаты</li>
              </ol>

              <a
                href={telegramUrl || undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!telegramUrl}
                className={`w-full mt-4 bg-[#229ED9] hover:opacity-90 transition rounded-xl py-3 text-center font-semibold flex items-center justify-center gap-2 ${
                  !telegramUrl ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                📩 Отправить чек администратору
              </a>

              <div className="mt-4 border-t border-red-500/20 pt-3 text-center">
                <p className="text-xs text-red-500 font-semibold">
                  ❗ Если чек не будет отправлен — заказ автоматически
                  считается неоплаченным
                </p>
              </div>
            </div>

            {/* Таймер */}
            {!showQr && (
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">
                  QR-код появится через:
                </p>

                <p className="text-3xl font-bold text-orange-500">
                  {timeLeft}
                </p>
              </div>
            )}

            {/* QR-код: теперь используется только поле url */}
            {showQr && (
              <div className="flex flex-col items-center gap-2 mt-2">
                {qrCode?.url ? (
                  <Image
                    src={qrCode.url}
                    alt="QR Code"
                    width={260}
                    height={260}
                    className="w-full max-w-[180px] sm:max-w-[220px] md:max-w-[260px] object-contain mx-auto"
                    unoptimized
                  />
                ) : (
                  <div className="w-[180px] h-[180px] bg-[#1f1f1f] border border-gray-700 rounded-xl flex items-center justify-center text-gray-400 text-sm text-center p-3">
                    QR-код временно недоступен
                  </div>
                )}
              </div>
            )}

            <a
              href={telegramUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!telegramUrl}
              className={`w-full mt-4 bg-[#229ED9] hover:opacity-90 transition rounded-xl py-3 text-center font-semibold flex items-center justify-center gap-2 ${
                !telegramUrl ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              📩 Отправить чек администратору
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-gray-400 hover:text-white transition py-2 border border-gray-700 rounded-lg"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}