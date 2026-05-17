"use client";

import PasswordField from "./PasswordField";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  signup,
  sendOtp,
  SignupPayload,
} from "@/services/auth/auth.api";
import Toast from "@/components/UI/toast";
import { useRouter } from "next/navigation";

type AuthState = "idle" | "loading" | "email_exists";

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [savedEmail, setSavedEmail] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const router = useRouter();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const getErrorMessage = (err: any) => {
    return (
      err?.response?.data?.details ||
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Ошибка регистрации"
    );
  };

  const handleSendOtp = async (email: string) => {
    await sendOtp({
      to: email,
      subject: "Verification Code",
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("pendingEmail", email);
    }

    showToast("Код отправлен на email", "success");

    setTimeout(() => {
      router.push("/auth/verify-otp");
    }, 1000);
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
      await signup(signupPayload);

      await handleSendOtp(signupPayload.email);

      showToast("Регистрация успешна", "success");
    } catch (err: any) {
      const details = getErrorMessage(err);

      const isEmailExists =
        err?.response?.status === 409 ||
        details?.toLowerCase().includes("email уже используется") ||
        details?.toLowerCase().includes("already exists");

      if (isEmailExists) {
        setSavedEmail(signupPayload.email);
        setAuthState("email_exists");

        showToast("Email уже зарегистрирован. Отправляем код...", "error");

        try {
          await handleSendOtp(signupPayload.email);
        } catch {
          showToast("Не удалось отправить код", "error");
        }
      } else {
        showToast(details, "error");
      }
    } finally {
      setLoading(false);
    }
  };

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

      <form className="flex flex-col" onSubmit={handleSubmit}>
        {/* NAME */}
        <label className="mb-5 flex flex-col gap-1">
          Имя и фамилия
          <input
            name="name"
            type="text"
            placeholder="Иван Петров"
            required
            className="border border-[#2A2A2A] px-5 py-2 rounded-md"
          />
        </label>

        {/* EMAIL */}
        <label className="mb-5 flex flex-col gap-1">
          Email
          <input
            name="email"
            type="email"
            placeholder="example@mail.com"
            required
            className="border border-[#2A2A2A] px-5 py-2 rounded-md"
          />
        </label>

        {/* PHONE */}
        <label className="mb-5 flex flex-col gap-1">
          Телефон
          <input
            name="phone"
            type="text"
            placeholder="+998"
            required
            className="border border-[#2A2A2A] px-5 py-2 rounded-md"
          />
        </label>

        {/* PASSWORD */}
        <label className="mb-5 flex flex-col gap-1">
          Пароль
          <PasswordField id="password" name="password" />
        </label>

        {/* REPEAT PASSWORD */}
        <label className="mb-5 flex flex-col gap-1">
          Подтвердите пароль
          <PasswordField id="repeat-password" name="repeat-password" />
        </label>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="flex justify-center items-center w-full bg-[#FF7A00] py-2 rounded-lg mt-7 gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          Зарегистрироваться
        </button>

        {/* EMAIL EXISTS INFO (just UX hint, optional) */}
        {authState === "email_exists" && (
          <p className="mt-4 text-center text-yellow-400 text-sm">
            Если email уже зарегистрирован — мы отправили код для входа
          </p>
        )}
      </form>
    </>
  );
}