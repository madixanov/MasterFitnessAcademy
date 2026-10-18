"use client";

import { useEffect, useRef, useState } from "react";
import Toast from "@/components/UI/toast";
import { API_ERROR_EVENT } from "@/services/apiErrorToast";

interface ApiErrorToast {
  id: number;
  message: string;
}

export default function ApiErrorToaster() {
  const [toasts, setToasts] = useState<ApiErrorToast[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const handleApiError = (event: Event) => {
      const message = (event as CustomEvent<{ message?: unknown }>).detail?.message;
      if (typeof message !== "string" || !message) return;

      const id = ++nextId.current;
      setToasts((current) => [...current, { id, message }]);
    };

    window.addEventListener(API_ERROR_EVENT, handleApiError);
    return () => window.removeEventListener(API_ERROR_EVENT, handleApiError);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-2">
      {toasts.map(({ id, message }) => (
        <Toast
          key={id}
          message={message}
          type="error"
          onClose={() =>
            setToasts((current) => current.filter((toast) => toast.id !== id))
          }
        />
      ))}
    </div>
  );
}
