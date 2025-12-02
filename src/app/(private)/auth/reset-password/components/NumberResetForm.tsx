"use client"

import { Smartphone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { sendOtp, sendOtpPayload } from "@/services/auth/auth.api"

export default function NumberResetForm() {
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
        Номер телефона
        <input
          id="email"
          type="phone"
          placeholder="+998 77 777 77 77"
          required
          className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none"
        />
      </label>

      <p className="text-[#999]">Мы отправим код восстановления в SMS</p>

      <button className="flex justify-center items-center w-full bg-[#FF7A00] py-2 rounded-lg mt-7">
        <Smartphone className="w-5 h-5 mr-4" /> Отправить код
      </button>
      <Link href="/auth">
        <button className="flex justify-center items-center w-full bg-[#0A0A0A] border border-[#2A2A2A] py-2 rounded-lg mt-7">
          <ArrowLeft className="w-5 h-5 mr-4" /> Вернуться к входу
        </button>   
      </Link>
    </form>
  )
}