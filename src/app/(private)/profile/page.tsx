"use client";

import { useEffect, useState } from "react";

import HomeworkList from "./components/HomeworkList";
import LatestLesson from "./components/MyCourseCard";
import LessonseList from "./components/LessonsList";
import PaymentsList from "./components/PaymentsList";
import Toast from "@/components/UI/toast";

import { useRequireAuth } from "./components/useRequireAuth";
import { useMyCoursesStore } from "@/store/myCourseStore";

export default function Profile() {
  // 🔹 все хуки сверху
  const loadingAuth = useRequireAuth();
  const { fetchMyCourses, loading: coursesLoading, error: coursesError } = useMyCoursesStore();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 🔹 загрузка курсов
  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  // 🔹 welcome toast
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem("welcomeToastShown");
    if (!hasSeenWelcome) {
      sessionStorage.setItem("welcomeToastShown", "true");
      const timer = window.setTimeout(() => {
        setToast({ message: "Добро пожаловать в Личный Кабинет!", type: "success" });
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  // 🔹 пока проверка авторизации идёт — показываем Skeleton
  if (loadingAuth) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
        <p>Проверка авторизации...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col">
      {/* Toast */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            duration={3000}
          />
        )}
      </div>

      {/* Заголовок */}
      <div className="flex flex-col mb-10">
        <h1 className="text-4xl font-medium mb-3">Главная</h1>
        <p className="text-sm text-[#999] lg:text-lg">
          Добро пожаловать в Личный Кабинет
        </p>
      </div>

      {/* Skeleton при загрузке курсов */}
      {coursesLoading && <p className="text-[#999]">Загрузка курсов...</p>}

      {coursesError && (
        <div
          role="alert"
          className="mb-6 flex flex-col gap-3 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>{coursesError}</p>
          <button
            type="button"
            onClick={fetchMyCourses}
            disabled={coursesLoading}
            className="self-start rounded bg-red-500/20 px-4 py-2 font-medium hover:bg-red-500/30 disabled:opacity-50 sm:self-auto"
          >
            {coursesLoading ? "Загрузка..." : "Повторить"}
          </button>
        </div>
      )}

      <LatestLesson />
      <LessonseList />

      <div className="flex flex-col lg:flex-row gap-10">
        <HomeworkList />
        <PaymentsList />
      </div>
    </main>
  );
}
