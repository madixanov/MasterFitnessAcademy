"use client";

import PasswordField from "./PasswordField";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { signup, sendOtp, SignupPayload } from "@/services/auth/auth.api";

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [isEmailExists, setIsEmailExists] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload: SignupPayload = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      phoneNumber: form.get("phone") as string,
      password: form.get("password") as string,
    };

    setSavedEmail(payload.email)
    const repeatPassword = form.get("repeat-password") as string;
    if (payload.password !== repeatPassword) {
      alert("Пароли не совпадают");
      setLoading(false);
      return;
    }

    try {
      await signup(payload);

      // сохраняем email в localStorage для OTP
      if (typeof window !== "undefined") {
        window.localStorage.setItem("pendingEmail", payload.email);
      }

      // сразу редирект на OTP
      window.location.href = "/auth/verify-otp";
    } catch (err: any) {
      const message = err.message || "";

      if (message.includes("already") || message.includes("exists")) {
        // показываем блок "Активировать аккаунт"
        setIsEmailExists(true);
        setSavedEmail(payload.email);

        // сохраняем email в localStorage на случай повторного перехода
        if (typeof window !== "undefined") {
          window.localStorage.setItem("pendingEmail", payload.email);
        }
      } else {
        alert(message || "Ошибка регистрации");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleActivateAccount = async () => {
    if (!savedEmail) return;

    try {
      window.localStorage.setItem("pendingEmail", savedEmail);
      window.location.href = "/auth/verify-otp";
    } catch (err: any) {
      alert("Ошибка отправки кода подтверждения");
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      {/* поля формы */}
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
          disabled={loading}
          className="flex justify-center items-center w-full bg-[#FF7A00] py-2 rounded-lg mt-7 disabled:opacity-50"
        >
          <UserPlus className="w-5 h-5 mr-4" /> Зарегистрироваться
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
            className="w-full py-2 bg-[#FF7A00] rounded-lg"
          >
            Активировать аккаунт
          </button>
        </div>
      )}
    </form>
  );
}
