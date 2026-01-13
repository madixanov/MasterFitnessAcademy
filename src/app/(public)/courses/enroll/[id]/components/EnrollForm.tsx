"use client";

import { useState, FormEvent } from "react";

interface EnrollFormProps {
  courseId: string; // передается из EnrollPage
}

export interface EnrollFormPayload {
  courseId: string;
  name: string;
  phone: string;
  email: string;
}

export default function EnrollForm({ courseId }: EnrollFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: EnrollFormPayload = {
      courseId,
      name,
      phone,
      email,
    };

    try {
      // Здесь делаем запрос на ваш API
      await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
    } catch (err) {
      console.error("Ошибка отправки заявки:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg w-full"
    >
      <h2 className="text-xl mb-5">Ваши данные</h2>

      <label htmlFor="name" className="mb-5 flex flex-col gap-1">
        Полное имя
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Иван Петров"
          className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none"
          required
        />
      </label>

      <label htmlFor="phone" className="mb-5 flex flex-col gap-1">
        Номер телефона
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+998 "
          className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none"
          required
        />
      </label>

      <label htmlFor="email" className="mb-5 flex flex-col gap-1">
        Email
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
          className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none"
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="flex justify-center items-center w-full bg-[#FF7A00] py-2 rounded-lg mt-7 disabled:opacity-60"
      >
        {loading ? "Отправка..." : "Отправить заявку"}
      </button>

      {success && (
        <p className="mt-4 text-green-400">
          Ваша заявка успешно отправлена!
        </p>
      )}
    </form>
  );
}
