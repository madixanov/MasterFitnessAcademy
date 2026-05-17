"use client";

import EmailResetForm from "./components/EmailResetForm";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-[calc(100vh-200px)] p-6">
      <section className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col justify-center items-center">
        <article className="flex flex-col justify-center items-center pb-5">
          <h2 className="font-medium text-2xl">
            Восстановление пароля
          </h2>

          <p className="text-[#999] pt-2.5 text-center">
            Введите email для восстановления пароля
          </p>
        </article>

        <div className="w-full max-w-md">
          <EmailResetForm />
        </div>
      </section>
    </main>
  );
}