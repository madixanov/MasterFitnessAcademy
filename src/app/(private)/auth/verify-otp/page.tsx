"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyOtp, sendOtp } from "@/services/auth/auth.api";
import Cookies from "js-cookie";
import { Button } from "@/components/UI/button";

export default function OTPPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // При монтировании страницы получаем email из localStorage и сразу отправляем OTP
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = window.localStorage.getItem("pendingEmail");
      console.log("Email для OTP:", savedEmail);
      if (!savedEmail) {
        router.push("/auth/signup");
        return;
      }
      setEmail(savedEmail);

      // сразу отправляем OTP
      sendOtp(savedEmail).catch((err) => {
        console.error("Ошибка отправки OTP при загрузке:", err);
      });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (otp.length < 6) {
      alert("Введите весь код");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(otp, email, "email");

      if (res.success && res.token) {
        Cookies.set("token", res.token, { expires: 1 });
        window.localStorage.removeItem("pendingEmail");
        router.push("/profile");
      } else {
        alert("Неверный код");
      }
    } catch (err: any) {
      alert(err.message || "Ошибка подтверждения");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setResendLoading(true);
    try {
      const res = await sendOtp(email);
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
