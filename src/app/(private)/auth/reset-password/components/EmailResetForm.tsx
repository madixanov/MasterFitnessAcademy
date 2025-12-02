"use client"

import { sendOtp, sendOtpPayload } from "@/services/auth/auth.api"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EmailResetForm() {
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = new FormData(e.currentTarget);
    const payload: sendOtpPayload = {
      to: form.get("email") as string,
      subject: "Reset your password"
    }

    try {
      await sendOtp(payload);
    } catch (err: any) {
      alert("Ошибка отправки кода подтверждения");
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

      <p className="text-[#999]">Мы отправим ссылку для сброса пароля на ваш email</p>

      <button className="flex justify-center items-center w-full bg-[#FF7A00] py-2 rounded-lg mt-7">
        <Mail className="w-5 h-5 mr-4" /> Отправить ссылку
      </button>
      <Link href="/auth">
        <button className="flex justify-center items-center w-full bg-[#0A0A0A] border border-[#2A2A2A] py-2 rounded-lg mt-7">
          <ArrowLeft className="w-5 h-5 mr-4" /> Вернуться к входу
        </button>   
      </Link>
    </form>
  )
}