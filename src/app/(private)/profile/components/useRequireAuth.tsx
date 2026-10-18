"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

/**
 * Хук для проверки авторизации через accessToken в cookie
 * Возвращает true, пока проверка идёт
 */
export function useRequireAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("accessToken"); // берём токен из cookie

      if (!token) {
        router.replace("/auth");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  return loading;
}
