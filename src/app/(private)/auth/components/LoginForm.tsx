"use client"

import Link from "next/link"
import PasswordField from "./PasswordField"
import { LogIn, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { login } from "@/services/auth/auth.api"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token")
    if (token) {
      router.push("/profile")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await login({ email, password })

      if (rememberMe) {
        Cookies.set("token", res.accessToken, { expires: 7 }) // 7 дней
        localStorage.setItem("token", res.accessToken)
      } else {
        Cookies.set("token", res.accessToken)
        sessionStorage.setItem("token", res.accessToken)
      }

      router.push("/profile")
    } catch (err: any) {
      setError("Неверный email или пароль")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <label className="mb-5 flex flex-col gap-1">
        Email
        <input
          type="email"
          placeholder="example@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none"
        />
      </label>

      <label className="mb-5 flex flex-col gap-1 relative">
        Пароль
        <PasswordField
          id="password"
          name="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
      </label>

      <div className="flex justify-between items-center">
        <label className="text-[#999] flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4 accent-[#FF7A00]"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Запомнить меня
        </label>
        <Link href="/auth/reset-password">
          <p className="text-[#FF7A00] cursor-pointer">Забыли пароль?</p>
        </Link>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        disabled={loading}
        className="flex justify-center items-center w-full bg-[#FF7A00] py-2 rounded-lg mt-7 disabled:opacity-50"
      >
        {loading ? "Вход..." : <>
          <LogIn className="w-5 h-5 mr-4" /> Войти
        </>}
      </button>
    </form>
  )
}