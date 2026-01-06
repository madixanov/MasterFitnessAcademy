"use client";

import { useEffect, useState } from "react";

import HomeworkList from "./components/HomeworkList";
import LatestLesson from "./components/LatestLessons";
import LessonseList from "./components/LessonsList";
import PaymentsList from "./components/PaymentsList";
import Toast from "@/components/UI/toast";

import { getMyCourses, MyCourse } from "@/services/mycourse/mycourse.api";

export default function Profile() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [hasInactiveCourse, setHasInactiveCourse] = useState(false);

  useEffect(() => {
    // Welcome toast
    const hasSeenWelcome = sessionStorage.getItem("welcomeToastShown");
    if (!hasSeenWelcome) {
      setToast({
        message: "Добро пожаловать в Личный Кабинет!",
        type: "success",
      });
      sessionStorage.setItem("welcomeToastShown", "true");
    }
  }, []);

  useEffect(() => {
    async function checkCourses() {
      const courses = await getMyCourses();

      const inactive = courses.some(
        (course) => course.status === "INACTIVE"
      );

      setHasInactiveCourse(inactive);
    }

    checkCourses();
  }, []);

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

      <div className="flex flex-col mb-10">
        <h1 className="text-4xl font-medium mb-3">Главная</h1>
        <p className="text-sm text-[#999] lg:text-lg">
          Добро пожаловать в Личный Кабинет
        </p>
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
