"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BookOpen, Calendar } from "lucide-react";
import { useMyCoursesStore } from "@/store/myCourseStore";

export default function TestStartBanner() {
  const { tests, fetchMyCourses } = useMyCoursesStore();

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  if (!tests.length) return null;

  // Берём первый тест
  const test = tests[0];

  // 🔹 показываем баннер только если тест активен
  if (test.status !== "ACTIVE") return null;

  return (
    <div className="rounded-xl border border-[#22C55E] bg-gradient-to-b from-[#22C55E33] to-[#22C55E0D] p-6 max-w-[700px] mx-auto text-center shadow-lg">
      <div className="flex flex-col items-center gap-4">
        <BookOpen className="w-10 h-10 text-[#22C55E]" />
        <h2 className="text-2xl font-bold text-white">
          Готовы начать тест: {test.name}
        </h2>
        <p className="text-[#DDD] text-sm max-w-[500px]">
          На выполнение у вас есть {test.duration} минут.
          Убедитесь, что вас никто не отвлекает и вы готовы сосредоточиться.
        </p>

        <div className="flex gap-6 mt-4 text-sm text-[#CCC]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Время: {test.duration} мин
          </div>
        </div>

        <Link href={`/tests/start/${test.id}`}>
          <button className="mt-6 px-6 py-3 bg-[#22C55E] text-black font-medium rounded-lg hover:opacity-90 transition">
            Начать тест
          </button>
        </Link>
      </div>
    </div>
  );
}
