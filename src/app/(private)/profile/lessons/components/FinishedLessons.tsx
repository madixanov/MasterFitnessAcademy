"use client";

import { CircleCheckBig, Calendar, Clock, Video } from "lucide-react";
import { LessonFull } from "../page";

interface Props {
  lessons: LessonFull[];
}

export default function FinishedLessons({ lessons }: Props) {
  const now = Date.now();

  // завершённые уроки по дате
  const finishedLessons = lessons
    .filter((l) => new Date(l.startsAt).getTime() <= now)
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());

  if (!finishedLessons.length) {
    return <div className="text-gray-400">Завершённых уроков нет</div>;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {finishedLessons.map((lesson: LessonFull) => {
        const startsAtDate = new Date(lesson.startsAt);

        return (
          <div
            key={lesson.id}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3 flex-wrap">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5">
                <span className="px-5 bg-[#FF7A00] rounded-lg">{lesson.name}</span>

                <span className="inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#00C950]/30">
                  <CircleCheckBig className="w-4 h-4" />
                  Завершено
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

                <button className="flex gap-3 px-3 py-2 text-sm bg-[#0A0A0A] rounded-sm items-center transition hover:bg-[#0A0A0A]/80 border border-[#2A2A2A]">
                  Материалы
                </button>
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
                      src !== "-" && (
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
                  <Calendar className="w-4 h-4" /> {startsAtDate.toLocaleDateString()}{" "}
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
