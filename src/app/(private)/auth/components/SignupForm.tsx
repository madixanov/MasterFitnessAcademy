"use client";

import PasswordField from "./PasswordField";
import { UserPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  signup,
  sendOtp,
  SignupPayload,
  SendOtpPayload,
} from "@/services/auth/auth.api";
import Toast from "@/components/UI/toast";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [isEmailExists, setIsEmailExists] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const signupPayload: SignupPayload = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      phoneNumber: form.get("phone") as string,
      password: form.get("password") as string,
    };

    const repeatPassword = form.get("repeat-password") as string;
    if (signupPayload.password !== repeatPassword) {
      showToast("Пароли не совпадают", "error");
      setLoading(false);
      return;
    }

    try {
      // 🔹 signup теперь сам выставляет HTTP-only accessToken и refreshToken
      await signup(signupPayload);

      // Отправка OTP для подтверждения email
      await sendOtp({ to: signupPayload.email, subject: "Verification Code" });

      // Сохраняем email временно для перехода на страницу подтверждения
      if (typeof window !== "undefined") {
        window.localStorage.setItem("pendingEmail", signupPayload.email);
      }

      showToast("Регистрация прошла успешно! Проверьте почту для OTP.", "success");

      setTimeout(() => router.push("/auth/verify-otp"), 1000);
    } catch (err: any) {
      const details = err?.response?.data?.message || err?.message || "Ошибка регистрации";

      if (details.includes("Email уже используется") || details.includes("already exists")) {
        setIsEmailExists(true);
        setSavedEmail(signupPayload.email);

        if (typeof window !== "undefined") {
          window.localStorage.setItem("pendingEmail", signupPayload.email);
        }

        showToast("Email уже зарегистрирован, активируйте аккаунт.", "error");
      } else {
        showToast(details, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleActivateAccount = async () => {
    if (!savedEmail) return;
    const payload: SendOtpPayload = { to: savedEmail, subject: "Verification Code" };

    setLoading(true);
    try {
      await sendOtp(payload);
      showToast("Код подтверждения отправлен на email!", "success");
      setTimeout(() => router.push("/auth/verify-otp"), 1000);
    } catch {
      showToast("Ошибка отправки кода подтверждения", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="name" className="mb-5 flex flex-col gap-1">
          Имя и фамилия
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Иван Петров"
            required
            className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none"
          />
        </label>

        <label htmlFor="email" className="mb-5 flex flex-col gap-1">
          Email
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@mail.com"
            required
            className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none"
          />
        </label>

        <label htmlFor="phone" className="mb-5 flex flex-col gap-1">
          Телефон
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="+998"
            required
            className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none"
          />
        </label>

        <label htmlFor="password" className="mb-5 flex flex-col gap-1 relative">
          Пароль
          <PasswordField id="password" name="password" />
        </label>

        <label htmlFor="repeat-password" className="mb-5 flex flex-col gap-1 relative">
          Подтвердите пароль
          <PasswordField id="repeat-password" name="repeat-password" />
        </label>

        {!isEmailExists && (
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center w-full bg-[#FF7A00] py-2 rounded-lg mt-7 disabled:opacity-50 gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Зарегистрироваться
          </button>
        )}

        {isEmailExists && (
          <div className="mt-5 p-4 border border-red-400 bg-red-900/20 rounded-md text-center">
            <p className="mb-3 text-red-300">
              Этот email уже зарегистрирован, но аккаунт не активирован.
            </p>

            <button
              type="button"
              onClick={handleActivateAccount}
              disabled={loading}
              className="flex justify-center items-center w-full py-2 bg-[#FF7A00] rounded-lg gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              Активировать аккаунт
            </button>
          </div>
        )}
      </form>
    </>
  );
}
