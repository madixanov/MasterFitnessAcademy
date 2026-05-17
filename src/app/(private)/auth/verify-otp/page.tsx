"use client";

import { useEffect, useState } from "react";
import {
  verifyOtp,
  sendOtp,
  VerifyOtpPayload,
} from "@/services/auth/auth.api";
import { Button } from "@/components/UI/button";
import Toast from "@/components/UI/toast";
import { Loader2 } from "lucide-react";

const RESEND_TIMEOUT = 120; // 2 минуты

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  /* ---------------- timer ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

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

      if (res?.message !== "Аккаунт успешно активирован") {
        showToast(res?.message || "Неверный код", "error");
        return;
      }

      showToast("Код подтверждён", "success");
      window.localStorage.removeItem("pendingEmail");

      setTimeout(() => {
        window.location.href = "/auth/";
      }, 800);
    } catch (err: any) {
      showToast(err?.message || "Ошибка подтверждения", "error");
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
      setSecondsLeft(RESEND_TIMEOUT); // 🔁 сброс таймера
    } catch {
      showToast("Ошибка отправки", "error");
    } finally {
      setResendLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      {/* Toast */}
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
          <h1 className="text-2xl font-bold mb-6 text-center">
            Введите код OTP
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Введите код"
              className="mb-6 px-4 py-2 text-center text-lg border border-[#2A2A2A] rounded-md focus:ring-2 focus:ring-[#FF7A00]"
            />

            <p className="mb-6 text-sm text-gray-400 text-center leading-snug">
              Мы отправили код на вашу почту.  
              Если письмо не пришло — проверьте папку{" "}
              <span className="text-white font-medium">«Спам»</span>.
            </p>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="mb-3 gap-2 bg-[#F77A00] hover:bg-[#F77A00]/70"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Проверка..." : "Подтвердить"}
            </Button>

            {/* Resend */}
            <Button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || secondsLeft > 0}
              className={`gap-2 transition-all ${
                secondsLeft > 0
                  ? "bg-[#2A2A2A] text-gray-400 cursor-not-allowed"
                  : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
              }`}
            >
              {resendLoading && <Loader2 className="h-4 w-4 animate-spin" />}
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
