"use client";

import { useState } from "react";
import { CircleAlert, Video, Calendar, Clock } from "lucide-react";
import { LessonFull } from "../page";

interface Props {
  lessons: LessonFull[];
}

export default function UpcomingLessons({ lessons }: Props) {
  const now = Date.now();

  // будущие уроки без фильтра по статусу
  const upcomingLessons = lessons
    .filter((l) => new Date(l.startsAt).getTime() > now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  // состояние для показа материалов для каждого урока
  const [showMaterials, setShowMaterials] = useState<Record<string, boolean>>({});

  const toggleMaterials = (lessonId: string) => {
    setShowMaterials((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  if (!upcomingLessons.length) {
    return <div className="text-gray-400">Ближайших уроков нет</div>;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {upcomingLessons.map((lesson: LessonFull) => {
        const startsAtDate = new Date(lesson.startsAt);

        return (
          <div
            key={lesson.id}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap mb-3">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5">
                <span className="px-5 bg-[#FF7A00] rounded-lg">{lesson.name}</span>

                <span className="inline-flex items-center gap-2 text-[#FDC700] bg-[#F0B100]/20 px-4 py-1 rounded-xl text-xs md:text-sm font-medium border border-[#F0B100]/30">
                  <CircleAlert className="w-4 h-4" />
                  Ожидается
                </span>
              </div>

              <div className="flex gap-4 items-center mt-2 md:mt-0">
                {lesson.video && lesson.video !== "-" && (
                  <a
                    href={lesson.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 items-center px-3 py-2 text-sm bg-[#FF7A00] rounded-sm hover:bg-[#FF7A00]/80 transition"
                  >
                    <Video className="w-4 h-4" /> Смотреть видео
                  </a>
                )}

                {lesson.img && lesson.img.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => toggleMaterials(lesson.id)}
                      className="flex gap-2 px-3 py-2 text-sm bg-[#0A0A0A] rounded-sm items-center transition hover:bg-[#0A0A0A]/80 border border-[#2A2A2A]"
                    >
                      Материалы
                    </button>

                    {showMaterials[lesson.id] && (
                      <div className="absolute top-full left-0 mt-1 w-max bg-[#1A1A1A] border border-gray-700 rounded-md shadow-lg z-50 flex flex-col">
                        {lesson.img.map((src, idx) =>
                          src && src !== "-" ? (
                            <a
                              key={idx}
                              href={src}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 text-xs text-orange-400 hover:bg-[#2A2A2A] hover:text-white transition"
                            >
                              Файл {idx + 1}
                            </a>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Body */}
            <article className="flex flex-col w-full gap-3">
              <h2 className="text-xl font-semibold">{lesson.title}</h2>

              {lesson.desc && <p className="text-gray-400">{lesson.desc}</p>}

              {lesson.img && lesson.img.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {lesson.img.map(
                    (src, idx) =>
                      src && src !== "-" && (
                        <img
                          key={idx}
                          src={src}
                          alt={`Изображение ${idx + 1}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )
                  )}
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center gap-3 text-gray-400 mt-2 flex-wrap">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {startsAtDate.toLocaleDateString()}{" "}
                  {startsAtDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>

                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {lesson.duration} мин
                </span>

                <span className="text-sm">
                  Модуль: <strong>{lesson.moduleName}</strong>
                </span>

                <span className="text-sm">ID урока: {lesson.id}</span>
                <span className="text-sm">ID курса: {lesson.courseId}</span>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
