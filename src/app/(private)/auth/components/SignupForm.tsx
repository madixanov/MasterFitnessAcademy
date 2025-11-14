import PasswordField from "./PasswordField"
import {LogIn} from "lucide-react"

export default function SignupForm() {
  return (
    <form className="flex flex-col">
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
        <LogIn className="w-5 h-5 mr-4" /> Войти
      </button>
    </form>
  )
}