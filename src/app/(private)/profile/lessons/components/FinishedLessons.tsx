"use client";

import { useEffect, useState } from "react";
import { CircleCheckBig, Calendar, Clock } from "lucide-react";

import { getLessonsByModule, Lesson } from "@/services/lessons/lessons.api";

interface Props {
  moduleId: string;
}

export default function FinishedLessons({ moduleId }: Props) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      setLoading(true);

      const data = await getLessonsByModule(moduleId);

      // фильтруем завершённые уроки
      const finishedLessons = data.filter(
        (lesson) => new Date(lesson.createdAt) < new Date()
      );

      setLessons(finishedLessons);
      setLoading(false);
    }

    if (moduleId) fetchLessons();
  }, [moduleId]);

  if (loading) {
    return <div className="text-gray-400">Загрузка уроков...</div>;
  }

  if (!lessons.length) {
    return <div className="text-gray-400">Завершённых уроков нет</div>;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {lessons.map((lesson) => {
        const date = new Date(lesson.createdAt);

        return (
          <div
            key={lesson.id}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center flex-col md:flex-row gap-5">
                <span className="px-5 bg-[#FF7A00] rounded-lg">
                  {lesson.name}
                </span>

                <span className="inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#00C950]/30">
                  <CircleCheckBig className="w-4 h-4" />
                  Завершено
                </span>
              </div>

              <div className="flex gap-4 items-center">
                {/* ⚠️ заглушка оценки */}
                <span className="text-2xl text-[#FF7A00]">—</span>

                <button className="flex gap-3 px-3 py-2 text-sm bg-[#0A0A0A] rounded-sm items-center transition hover:bg-[#0A0A0A]/80 border border-[#2A2A2A]">
                  Материалы
                </button>
              </div>
            </div>

            {/* Body */}
            <article className="flex flex-col w-full">
              <h2 className="text-xl mb-3">{lesson.title}</h2>

              <div className="flex gap-3 flex-wrap text-[#999]">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {date.toLocaleDateString()}
                </span>

                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {lesson.duration} мин
                </span>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
