"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

/**
 * Хук для проверки авторизации пользователя.
 * Если токен отсутствует — редирект на страницу логина (/auth)
 */
export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token"); // ✅ проверяем токен в cookie

    if (!token) {
      router.replace("/auth"); // редирект на login
    }
  }, [router]);
}