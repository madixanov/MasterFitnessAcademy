import Link from "next/link"
import PasswordField from "./PasswordField"
import {LogIn} from "lucide-react"

export default function LoginForm() {
  return (
    <form className="flex flex-col">
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

      <label htmlFor="password" className="mb-5 flex flex-col gap-1 relative">
        Пароль
        <PasswordField id={"password"} name="password" />
      </label>

      <div className="flex justify-between items-center">
        <label htmlFor="remember" className="text-[#999] flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            className="size-4 accent-[#FF7A00]"
          />
          Запомнить меня
        </label>
        <Link href="/auth/reset-password">
          <p className="text-[#FF7A00] cursor-pointer">Забыли пароль?</p>
        </Link>
      </div>

      <button className="flex justify-center items-center w-full bg-[#FF7A00] py-2 rounded-lg mt-7">
        <LogIn className="w-5 h-5 mr-4" /> Войти
      </button>
    </form>
  )
}