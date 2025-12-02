"use client"

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = {
  id: string,
  name: string,
  value?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PasswordField({ id, name, value, onChange }: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        required
        className="focus:outline-none border border-[#2A2A2A] px-5 py-2 rounded-md w-full pr-12"
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        {show ? <EyeOff className="w-5 h-5 text-[#999]" /> : <Eye className="w-5 h-5 text-[#999]" />}
      </button>
    </div>
  );
}
