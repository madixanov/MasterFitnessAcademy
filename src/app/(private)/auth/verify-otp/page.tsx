"use client";

import { useEffect, useState } from "react";
import {
  verifyOtp,
  sendOtp,
  VerifyOtpPayload,
} from "@/services/auth/auth.api";
import { Button } from "@/components/UI/button";
import Toast from "@/components/UI/toast";

const RESEND_TIMEOUT = 120; // 2 минуты

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT);

  /* ---------------- helpers ---------------- */

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  /* ---------------- timer ---------------- */

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  /* ---------------- submit otp ---------------- */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const savedEmail = window.localStorage.getItem("pendingEmail");
    if (!savedEmail) {
      showToast("Email не найден", "error");
      return;
    }

    if (otp.length < 6) {
      showToast("Введите весь код", "error");
      return;
    }

    const payload: VerifyOtpPayload = {
      otpCode: otp.trim(),
      contact: savedEmail.trim(),
      type: "email",
    };

    setLoading(true);
    try {
      const res = await verifyOtp(payload);
      showToast(res.message || "Код подтверждён", "success");
      window.localStorage.removeItem("pendingEmail");

      setTimeout(() => {
        window.location.href = "/auth/";
      }, 800);
    } catch (err: any) {
      showToast(err.message || "Ошибка подтверждения", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- resend otp ---------------- */

  const handleResend = async () => {
    if (secondsLeft > 0) return;

    const savedEmail = window.localStorage.getItem("pendingEmail");
    if (!savedEmail) {
      showToast("Email не найден", "error");
      return;
    }

    setResendLoading(true);
    try {
      await sendOtp({
        to: savedEmail,
        subject: "Verification Code",
      });

      showToast("Код отправлен повторно", "success");
      setSecondsLeft(RESEND_TIMEOUT);
    } catch {
      showToast("Ошибка отправки", "error");
    } finally {
      setResendLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>

      <main className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6">
        <section className="bg-[#1A1A1A] border border-[#2A2A2A] p-8 rounded-lg w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">
            Введите код OTP
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Введите код"
              className="mb-6 px-4 py-2 text-center text-lg
                bg-[#111] text-white
                border border-[#2A2A2A]
                rounded-md
                focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
            />

            {/* Confirm */}
            <Button
              type="submit"
              disabled={loading}
              className="mb-3 bg-[#FF7A00] text-black hover:bg-[#ff8f26]"
            >
              {loading ? "Проверка..." : "Подтвердить"}
            </Button>

            {/* Resend */}
            <Button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || secondsLeft > 0}
              className={`
                transition-all
                ${
                  secondsLeft > 0
                    ? "bg-[#2A2A2A] text-gray-400 cursor-not-allowed"
                    : "bg-[#1F1F1F] text-[#FF7A00] border border-[#FF7A00] hover:bg-[#FF7A00] hover:text-black"
                }
              `}
            >
              {resendLoading
                ? "Отправка..."
                : secondsLeft > 0
                ? `Повторно через ${formatTime(secondsLeft)}`
                : "Отправить код заново"}
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}
