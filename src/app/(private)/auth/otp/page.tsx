"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyOtp, resendOtp } from "@/services/auth/auth.api";
import Cookies from "js-cookie";
import { Button } from "@/components/UI/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/UI/input-otp";

export default function OTPPage() {
  const router = useRouter();
  const [otpCode, setotpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) router.push("/auth");
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (otpCode.length < 6) return alert("Введите весь код OTP");

    setLoading(true);
    try {
      const contact = Cookies.get("contact") || "";
      const type: "email" | "sms" = contact.includes("@") ? "email" : "sms";

      const res = await verifyOtp({ otpCode, contact, type, token });
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
    <main className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6">
      <section className="bg-[#1A1A1A] border border-[#2A2A2A] p-8 rounded-lg flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-center">Введите код OTP</h1>

        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <InputOTP
            maxLength={6}
            value={otpValue}
            onValueChange={(val: string[]) => setOtpValue(val)}
            className="mb-6"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>

            <InputOTPSeparator />

            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

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
