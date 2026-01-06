"use client";

import { useEffect, useState } from "react";
import { CircleAlert, Video, Calendar, Clock } from "lucide-react";

import { getLessonsByModule, Lesson } from "@/services/lessons/lessons.api";

interface Props {
  moduleId: string;
}

export default function UpcomingLessons({ moduleId }: Props) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      setLoading(true);
      const data = await getLessonsByModule(moduleId);
      setLessons(data);
      setLoading(false);
    }

    if (moduleId) fetchLessons();
  }, [moduleId]);

  if (loading) {
    return <div className="text-gray-400">Загрузка уроков...</div>;
  }

  if (!lessons.length) {
    return <div className="text-gray-400">Ближайших уроков нет</div>;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {lessons.map((lesson) => {
        const date = new Date(lesson.createdAt);

        return (
          <div
            key={lesson.id}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-stretch">
                <span className="px-2 text-sm lg:text-md lg:px-5 bg-[#FF7A00] rounded-lg flex justify-center items-center">
                  {lesson.name}
                </span>

                <span className="text-sm lg:text-md inline-flex items-center gap-1 lg:gap-3 text-[#FDC700] bg-[#F0B100]/20 px-2 lg:px-4 py-1 rounded-lg font-medium border border-[#F0B100]/30">
                  <CircleAlert className="w-4 h-4" />
                  Ожидается
                </span>
              </div>

              <button className="flex gap-1 lg:gap-3 px-2 py-1 lg:px-3 lg:py-2 cursor-pointer text-sm lg:text-md bg-[#FF7A00] rounded-sm items-center transition hover:bg-[#FF7A00]/80">
                <Video className="w-4 h-4" />
                Перейти
              </button>
            </div>

            {/* Body */}
            <article className="mt-4">
              <h2 className="text-xl mb-3">{lesson.title}</h2>

              <span className="block text-[#999] mb-2">
                Модуль: {lesson.modulId}
              </span>

              <div className="flex gap-4 flex-wrap">
                <span className="flex items-center text-[#999] gap-2">
                  <Calendar className="w-4 h-4" />
                  {date.toLocaleDateString()}
                </span>

                <span className="flex items-center text-[#999] gap-2">
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
