import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EmailResetForm() {
  return (
    <form className="flex flex-col">
      <label htmlFor="email" className="mb-2 flex flex-col gap-1">
        Email
        <input
          id="email"
          type="email"
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