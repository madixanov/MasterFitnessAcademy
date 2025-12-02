"use client"

import { newPassword, NewPasswordPayload } from "@/services/auth/auth.api"
import PasswordField from "../../components/PasswordField"

export default function EmailResetForm() {
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget);
    const payload: NewPasswordPayload = {
      email: form.get("email") as string,
      newPassword: form.get("password") as string
    }

    try {
      await newPassword(payload);
      window.location.href = "/auth";
    } catch (err: any) {
      alert("Ошибка сохранении нового пароля");
    }
  }
  
  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <label htmlFor="email" className="mb-2 flex flex-col gap-1">
        Email
        <input
          id="email"
          type="email"
          name="email"
          placeholder="example@mail.com"
          required
          className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none"
        />
      </label>

      <label htmlFor="password" className="mb-2 flex flex-col gap-1">
        Пароль
        <PasswordField 
          id="password"
          name="password" />
      </label>

      <p className="text-[#999]">Внимание! Старый пароль будет удален и заменен новым.</p>

      <button className="flex justify-center items-center w-full bg-[#FF7A00] py-2 rounded-lg mt-7">
        Обновить пароль
      </button>
    </form>
  )
}