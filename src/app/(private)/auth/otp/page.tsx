"use client";

import { useState, useEffect } from "react";
import { signupStep2, resendOtp } from "@/services/auth/auth.api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/button";

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [contact, setContact] = useState("");
  const [type, setType] = useState<"email" | "sms">("email");

  useEffect(() => {
    setContact(localStorage.getItem("otpContact") || "");
    setType((localStorage.getItem("otpType") as "email" | "sms") || "email");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return alert("Введите весь код OTP");

    setLoading(true);
    try {
      const res = await signupStep2(otp, contact, type);
      // Сохраняем токен после успешной регистрации
      localStorage.removeItem("otpContact");
      localStorage.removeItem("otpType");
      document.cookie = `token=${res.token}; path=/; max-age=86400`;
      router.push("/profile");
    } catch (err: any) {
      alert(err.message || "Ошибка проверки кода");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!contact) return alert("Нет контакта для отправки OTP");

    setResendLoading(true);
    try {
      await resendOtp(contact);
      alert("Код отправлен повторно");
    } catch (err: any) {
      alert(err.message || "Ошибка повторной отправки кода");
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
            inputMode="numeric"
            pattern="\d*"
            placeholder="Введите код из SMS или Email"
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
            className="w-full"
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
