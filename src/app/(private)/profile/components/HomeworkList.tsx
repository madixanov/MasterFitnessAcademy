"use client";

import { useEffect, useState } from "react";
import { useMyCoursesStore } from "@/store/myCourseStore";
import { getCourseById, Course } from "@/services/courses/courses.api";

interface Homework {
  id: string;
  subject: string;
  task: string;
  grade: string;
}

export default function HomeworkList() {
  const { courses, loading: coursesLoading } = useMyCoursesStore();
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function loadHomeworks() {
      setLoading(true);
      setError(null);

      const activeCourse = courses.find((c) => c.status === "ACTIVE");

      if (!activeCourse) {
        setHomeworks([]);
        setLoading(false);
        return;
      }

      try {
        const fullCourse: Course = await getCourseById(activeCourse.courseId);
        let hwList: Homework[] = [];

        fullCourse.modules?.forEach((module) => {
          module.lessons?.forEach((lesson) => {
            hwList.push({
              id: lesson.id,
              subject: lesson.subject || lesson.name,
              task: lesson.task || lesson.name,
              grade: lesson.grade || "",
            });
          });
        });

        // Берём только последние 5 домашних заданий
        hwList = hwList.slice(-5);

        setHomeworks(hwList);
      } catch (err) {
        console.error("Не удалось загрузить домашние задания:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось загрузить домашние задания"
        );
      } finally {
        setLoading(false);
      }
    }

    // Запускаем загрузку только если курсы уже подгружены
    if (!coursesLoading) {
      loadHomeworks();
    }
  }, [courses, coursesLoading, retryCount]);

  // Skeleton / Загрузка
  if (coursesLoading || loading) {
    return (
      <div className="w-full p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg animate-pulse h-[300px]" />
    );
  }

  if (error) {
    return (
      <div role="alert" className="w-full rounded-lg border border-red-500/40 bg-red-500/10 p-5 text-red-300">
        <p>Не удалось загрузить домашние задания: {error}</p>
        <button
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
          className="mt-3 rounded bg-red-500/20 px-4 py-2 font-medium hover:bg-red-500/30"
        >
          Повторить
        </button>
      </div>
    );
  }

  // Нет домашних заданий
  if (!homeworks.length) {
    return (
      <div className="w-full p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-gray-400">
        Нет домашних заданий
      </div>
    );
  }

  return (
    <div className="w-full p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
      <h2 className="mb-5 text-lg font-semibold">Последние домашние задания</h2>
      <div className="flex flex-col gap-3">
        {homeworks.map((hw) => (
          <div
            key={hw.id}
            className="w-full flex flex-col p-3 bg-[#2A2A2A] rounded-md"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2>{hw.task}</h2>
                <span className="text-[#999]">{hw.subject}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
