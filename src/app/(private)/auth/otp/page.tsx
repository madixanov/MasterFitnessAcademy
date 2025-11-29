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

  const token = Cookies.get("token");

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
      alert(err.message || "Ошибка проверки кода");
    } finally {
      setLoading(false);
    }
  };

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
    <main className="min-h-[calc(100vh-200px)] p-6">
      <section className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col justify-center items-center">
        <form
          className="flex flex-col"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Введите код OTP</h1>

          <label htmlFor="otp" className="mb-5 flex flex-col gap-1">
            Код из SMS или Email
            <input
              id="otp"
              type="text"
              placeholder="Введите код"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center w-full bg-[#FF7A00] py-2 rounded-lg mb-2 hover:bg-[#FF6600] transition-colors text-white"
          >
            {loading ? "Проверка..." : "Подтвердить"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="w-full text-[#FF7A00] border border-[#FF7A00] py-2 rounded-md hover:bg-[#FF7A00]/10 transition-colors"
          >
            {resendLoading ? "Отправка..." : "Отправить код заново"}
          </button>
        </form>
      </section>
    </main>
  );
}
