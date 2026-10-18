"use client";

import { useEffect, useState } from "react";
import { CircleCheckBig, CircleAlert } from "lucide-react";
import { useMyCoursesStore } from "@/store/myCourseStore";
import { getCourseById, Course } from "@/services/courses/courses.api";

interface Lesson {
  id: string;
  title: string;
  startsAt: string; // ISO дата
  moduleName: string;
}

export default function LessonseList() {
  const { courses, loading: coursesLoading } = useMyCoursesStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function loadLessons() {
      setLoading(true);
      setError(null);

      const activeCourse = courses.find((c) => c.status === "ACTIVE");
      if (!activeCourse) {
        setLessons([]);
        setLoading(false);
        return;
      }

      try {
        const fullCourse: Course = await getCourseById(activeCourse.courseId);

        let allLessons: Lesson[] = [];

        fullCourse.modules?.forEach((module) => {
          module.lessons?.forEach((lesson) => {
            allLessons.push({
              id: lesson.id,
              title: lesson.name,
              startsAt: lesson.startsAt,
              moduleName: module.name,
            });
          });
        });

        // Сортировка по дате начала
        allLessons.sort(
          (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        );

        // Берём последние 5 уроков
        allLessons = allLessons.slice(-5);

        setLessons(allLessons);
      } catch (err) {
        console.error("Не удалось загрузить уроки:", err);
        setError(err instanceof Error ? err.message : "Не удалось загрузить уроки");
      } finally {
        setLoading(false);
      }
    }

    if (!coursesLoading) {
      loadLessons();
    }
  }, [courses, coursesLoading, retryCount]);

  const getStatusLabel = (startsAt: string) => {
    const now = new Date();
    const lessonDate = new Date(startsAt);
    return now >= lessonDate ? "Завершено" : "Ожидает";
  };

  if (coursesLoading || loading) {
    return (
      <div className="mb-10 rounded-lg border p-5 bg-[#1A1A1A] animate-pulse h-[300px]" />
    );
  }

  if (error) {
    return (
      <div role="alert" className="mb-10 rounded-lg border border-red-500/40 bg-red-500/10 p-5 text-red-300">
        <p>Не удалось загрузить уроки: {error}</p>
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

  if (!lessons.length) {
    return (
      <div className="mb-10 rounded-lg border p-5 bg-[#1A1A1A] text-gray-400">
        Нет уроков для отображения
      </div>
    );
  }

  return (
    <div aria-label="Расписание Уроков" className="bg-[#1A1A1A] p-5 rounded-lg mb-10">
      <h2 className="text-lg font-semibold mb-3">Последние уроки</h2>

      {/* Для десктопа */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-300">
              <th className="text-left py-2 font-medium pl-1">Название</th>
              <th className="text-left py-2 font-medium">Модуль</th>
              <th className="text-left py-2 font-medium">Дата</th>
              <th className="text-left py-2 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => {
              const status = getStatusLabel(lesson.startsAt);
              return (
                <tr
                  key={lesson.id}
                  className="border-b border-gray-800 last:border-0 hover:bg-[#2a2a2a] transition"
                >
                  <td className="py-3 pl-1">{lesson.title}</td>
                  <td className="py-3 text-gray-400">{lesson.moduleName}</td>
                  <td className="py-3 text-gray-400">{new Date(lesson.startsAt).toLocaleString()}</td>
                  <td className="py-3">
                    {status === "Завершено" ? (
                      <span className="inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#00C950]/30">
                        <CircleCheckBig className="w-4 h-4" /> Завершено
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-[#FDC700] bg-[#F0B100]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#F0B100]/30">
                        <CircleAlert className="w-4 h-4" /> Ожидает
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Для телефонов */}
      <div className="flex flex-col gap-3 sm:hidden">
        {lessons.map((lesson) => {
          const status = getStatusLabel(lesson.startsAt);
          return (
            <div
              key={lesson.id}
              className="bg-[#222] p-4 rounded-lg border border-gray-800"
            >
              <p className="text-sm text-gray-400 mb-1">Название</p>
              <p className="text-white font-medium mb-1">{lesson.title}</p>
              <p className="text-gray-400 text-xs mb-2">Модуль: {lesson.moduleName}</p>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{new Date(lesson.startsAt).toLocaleString()}</span>

                {status === "Завершено" ? (
                  <span className="inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-3 py-1 rounded-xl text-xs font-medium border border-[#00C950]/30">
                    <CircleCheckBig className="w-4 h-4" /> Завершено
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-[#FDC700] bg-[#F0B100]/20 px-3 py-1 rounded-xl text-xs font-medium border border-[#F0B100]/30">
                    <CircleAlert className="w-4 h-4" /> Ожидает
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
