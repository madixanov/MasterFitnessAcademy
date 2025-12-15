"use client";

import { useEffect, useState } from "react";
import HomeworkList from "./components/HomeworkList";
import LatestLesson from "./components/LatestLessons";
import LessonseList from "./components/LessonsList";
import PaymentsList from "./components/PaymentsList";
import Toast from "@/components/UI/toast";

export default function Profile() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    // Проверяем, показывали ли уже toast
    const hasSeenWelcome = sessionStorage.getItem("welcomeToastShown");
    if (!hasSeenWelcome) {
      setToast({ message: "Добро пожаловать в Личный Кабинет!", type: "success" });
      sessionStorage.setItem("welcomeToastShown", "true"); // помечаем, что показали
    }
  }, []);

  return (
    <main className="flex flex-col">
      {/* Toast контейнер */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            duration={3000} // 3 секунды
          />
        )}
      </div>

      <div className="flex flex-col mb-10">
        <h1 className="text-4xl font-medium pl-15 lg:pl-0 mb-3">Главная</h1>
        <p className="text-sm text-[#999] lg:text-lg">Добро пожаловать в Личный Кабинет</p>
      </div>

      <LatestLesson />
      <LessonseList />

      <div className="flex flex-col lg:flex-row gap-10">
        <HomeworkList />
        <PaymentsList />
      </div>
    </main>
  );
}
