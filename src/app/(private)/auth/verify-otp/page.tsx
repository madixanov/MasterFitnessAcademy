"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyOtp, sendOtp, VerifyOtpPayload } from "@/services/auth/auth.api";
import Cookies from "js-cookie";
import { Button } from "@/components/UI/button";

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const savedEmail = window.localStorage.getItem("pendingEmail");
    if (!savedEmail) {
      alert("Email не найден");
      return;
    }

    if (otp.length < 6) {
      alert("Введите весь код");
      return;
    }

    const otpPayload: VerifyOtpPayload = {
      otpCode: otp.trim(),
      contact: savedEmail.trim(),
      type: "email"
    };

    setLoading(true);

    try {
      const res = await verifyOtp(otpPayload);
      // если ошибок нет → считаем, что аккаунт подтверждён
      alert(res.message || "Код подтверждён");
      window.localStorage.removeItem("pendingEmail");
      router.push("/profile");
    } catch (err: any) {
      alert(err.message || "Ошибка подтверждения");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
  const savedEmail = typeof window !== "undefined" ? window.localStorage.getItem("pendingEmail") : null;
  if (!savedEmail) {
    alert("Email не найден, невозможно отправить код");
    return;
  }

  setResendLoading(true);
  try {
    const res = await sendOtp(savedEmail);
    if (res.success) alert("Код отправлен повторно");
  } catch (err: any) {
    alert("Ошибка отправки");
  } finally {
    setResendLoading(false);
  }
};

  return (
    <main className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6">
      <section className="bg-[#1A1A1A] border border-[#2A2A2A] p-8 rounded-lg flex flex-col items-center w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Введите код OTP</h1>

        <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Введите код"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full px-4 py-2 mb-6 text-center text-lg border border-[#2A2A2A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
          />

          <Button type="submit" className="w-full mb-2" disabled={loading}>
            {loading ? "Проверка..." : "Подтвердить"}
          </Button>

          <Button
            variant="outline"
            className="w-full bg-transparent"
            type="button"
            disabled={resendLoading}
            onClick={handleResend}
          >
            {resendLoading ? "Отправка..." : "Отправить код заново"}
          </Button>
        </form>
      </section>
    </main>
  );
}
