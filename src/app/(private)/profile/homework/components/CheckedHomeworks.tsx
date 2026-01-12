"use client";

import { useMemo, useState } from "react";
import { Download, CircleAlert, FileText, Search } from "lucide-react";
import { HomeworkSubmission } from "@/services/homework/homework.api";

interface OnCheckingHomeworksProps {
  homeworks: (HomeworkSubmission & {
    homework: {
      id: string;
      lessonId: string;
      title: string;
      description: string;
      files: string[];
      deadline: string;
      createdAt: string;
      secondaryTask?: string;
      points?: number;
    };
  })[];
}

export default function OnCheckingHomeworks({ homeworks }: OnCheckingHomeworksProps) {
  const [search, setSearch] = useState("");

  const filteredHomeworks = useMemo(() => {
    if (!search) return homeworks;

    const q = search.toLowerCase();

    return homeworks.filter((hw) =>
      hw.homework.title?.toLowerCase().includes(q) ||
      hw.homework.description?.toLowerCase().includes(q) ||
      hw.text?.toLowerCase().includes(q)
    );
  }, [homeworks, search]);

  if (!filteredHomeworks.length) {
    return (
      <p className="text-[#999] text-center mt-10">
        Домашки на проверке отсутствуют.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по домашним заданиям..."
          className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] rounded-lg text-white placeholder:text-[#999]"
        />
      </div>

      {/* Список */}
      <div className="flex flex-col gap-7">
        {filteredHomeworks.map((hw) => {
          let statusColor = "#51A2FF";
          let statusText = "На проверке";

          if (hw.status === "CHECKED") {
            statusColor = "#05DF72";
            statusText = "Проверено";
          } else if (hw.status === "REJECTED") {
            statusColor = "#FF4C4C";
            statusText = "Отклонено";
          }

          return (
            <div
              key={hw.id}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col"
            >
              {/* Заголовок */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 text-sm bg-[#FF7A00] rounded-lg">
                  {hw.homework.title || "Домашнее задание"}
                </span>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs border"
                  style={{
                    color: statusColor,
                    backgroundColor: `${statusColor}33`,
                    borderColor: `${statusColor}50`,
                  }}
                >
                  <CircleAlert className="w-4 h-4" />
                  {statusText}
                </span>
              </div>

              {/* Описание */}
              <article className="mb-4">
                <h2 className="text-2xl mb-1">{hw.homework.title}</h2>
                <p className="text-[#999]">{hw.homework.description}</p>
              </article>

              {hw.homework.secondaryTask && (
                <p className="text-[#999] mb-4">{hw.homework.secondaryTask}</p>
              )}

              {/* Файлы задания */}
              {hw.homework.files?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-[#999] mb-1">Файлы задания:</p>
                  <div className="flex flex-col gap-1">
                    {hw.homework.files.map((file, idx) => (
                      <a
                        key={idx}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#51A2FF] text-sm hover:underline flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        {file.split("/").pop()}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Решение студента */}
              {(hw.text || hw.files?.length > 0) && (
                <div className="mb-5">
                  <p className="text-sm text-[#999] mb-1">Ваше решение:</p>

                  {hw.text && (
                    <p className="text-[#ccc] mb-2 whitespace-pre-wrap">
                      {hw.text}
                    </p>
                  )}

                  {hw.files?.length > 0 && (
                    <div className="flex flex-col gap-1">
                      {hw.files.map((file, idx) => (
                        <a
                          key={idx}
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#51A2FF] text-sm hover:underline flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          {file.split("/").pop()}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Дата */}
              <span className="flex items-center text-[#999] text-sm">
                <FileText className="w-4 h-4 mr-2" />
                Работа отправлена{" "}
                {new Date(hw.createdAt).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
