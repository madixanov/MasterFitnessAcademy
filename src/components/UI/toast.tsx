"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

interface ToastProps {
  message: string;
  type: "success" | "error";
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  duration = 3000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // Когда скрывается, вызываем callback родителю
  useEffect(() => {
    if (!visible) {
      const timeout = setTimeout(() => onClose(), 200); // плавное исчезновение
      return () => clearTimeout(timeout);
    }
  }, [visible, onClose]);

  return (
    <div
      className={clsx(
        "pointer-events-none w-[320px] rounded-lg border px-4 py-3 shadow-lg transition-all duration-200",
        visible ? "opacity-100" : "opacity-0",
        type === "success"
          ? "bg-green-500/10 border-green-500 text-green-400"
          : "bg-red-500/10 border-red-500 text-red-400"
      )}
    >
      <p className="text-sm font-medium">{message}</p>

      {/* progress bar */}
      <div className="mt-3 h-1 w-full overflow-hidden rounded bg-white/10">
        <div
          className={clsx(
            "h-full",
            type === "success" ? "bg-green-500" : "bg-red-500"
          )}
          style={{ animation: `toast-progress ${duration}ms linear forwards` }}
        />
      </div>
    </div>
  );
}
