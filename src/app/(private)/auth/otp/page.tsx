"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyOtp, resendOtp } from "@/services/auth/auth.api";
import Cookies from "js-cookie";

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const  token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      router.push("/auth");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const res = await verifyOtp({ otp, token });
      if (res.success) {
        alert("Успешная проверка OTP!");
        router.push("/profile");
      }
    } catch (err: any) {
      alert(err.message || "Ошибка проверки кода")
    } finally {
      setLoading(false);
    }
  }

  const handleResend = async () => {
    if (!token) return;
    setResendLoading(true);
    try {
      const res = await resendOtp(token);
      if (res.success) alert("Код отправлен повторно");
    } catch (err: any) {
      alert(err.message || "Ошибка повторной отправки кода");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Введите код OTP</h1>

        <input
          type="text"
          placeholder="Код из SMS или Email"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF7A00] text-white py-2 rounded-md hover:bg-orange-600 transition-colors mb-2"
        >
          {loading ? "Проверка..." : "Подтвердить"}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading}
          className="w-full text-[#FF7A00] border border-[#FF7A00] py-2 rounded-md hover:bg-[#FF6600]/10 transition-colors"
        >
          {resendLoading ? "Отправка..." : "Отправить код заново"}
        </button>
      </form>
    </div>
  );
}
