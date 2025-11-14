import { Smartphone, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NumberResetForm() {
  return (
    <form className="flex flex-col">
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