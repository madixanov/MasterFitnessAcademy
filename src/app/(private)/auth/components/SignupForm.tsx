"use client"

import PasswordField from "./PasswordField";
import {UserPlus} from "lucide-react";
import { signup, SignupPayload, SignupResponse } from "@/services/auth/auth.api";
import { useState } from "react";

export default function SignupForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const payload: SignupPayload = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      number: form.get("phone") as string,
      password: form.get("password") as string,
    }

    const repeatPassword = form.get("repeat-password") as string;

    if (payload.password !== repeatPassword) {
      alert("Пароли не совпадают");
      setLoading(false)
      return;
    }

    try {
      const result: SignupResponse = await signup(payload);

      document.cookie = `token=${result.token}; path=/; max-age=86400`;
      window.location.href = "/auth/otp";
    } catch (err: any) {
      alert(err.message || "Ошибка регистрации"); 
    } finally {
      setLoading(false)
    }
  }
  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <label htmlFor="name" className="mb-5 flex flex-col gap-1">
        Имя и фамилия
        <input
          id="name"
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
          type="text"
          placeholder="+998 77 777 77 77"
          required
          className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none"
           />
      </label>

      <label htmlFor="password" className="mb-5 flex flex-col gap-1 relative">
        Пароль
        <PasswordField id={"password"} />
      </label>

      <label htmlFor="repeat-password" className="mb-5 flex flex-col gap-1 relative">
        Подтвердите пароль
        <PasswordField id={"repeat-password"} />
      </label>


      <button className="flex justify-center items-center w-full bg-[#FF7A00] py-2 rounded-lg mt-7">
        <UserPlus className="w-5 h-5 mr-4" /> Зарегистрироваться
      </button>
    </form>
  )
}