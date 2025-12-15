// components/ui/Toast.tsx
"use client";

import { useEffect } from "react";
import clsx from "clsx";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={clsx(
        "pointer-events-none w-[320px] rounded-lg border px-4 py-3 shadow-lg",
        "animate-slide-in",
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
            "h-full animate-toast-progress",
            type === "success" ? "bg-green-500" : "bg-red-500"
          )}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}
