"use client";

import { Download, CircleAlert, FileText } from "lucide-react";
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
  if (!homeworks.length) {
    return (
      <p className="text-[#999] text-center mt-10">
        Домашки на проверке отсутствуют.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      {homeworks.map((hw) => {
        let statusColor = "#51A2FF"; // default - синий
        let statusText = "На проверке";

        if (hw.status === "CHECKED") {
          statusColor = "#05DF72"; // зеленый
          statusText = "Проверено";
        } else if (hw.status === "REJECTED") {
          statusColor = "#FF4C4C"; // красный
          statusText = "Отклонено";
        }

        return (
          <div
            key={hw.id}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-5">
              <div className="flex-1">
                {/* Заголовок и статус */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 text-sm lg:text-md bg-[#FF7A00] rounded-lg flex justify-center items-center">
                    {hw.homework.title || "Домашнее задание"}
                  </span>
                  <span
                    className="inline-flex items-center gap-2 bg-opacity-20 px-3 py-1 rounded-xl text-xs font-medium border"
                    style={{
                      color: statusColor,
                      backgroundColor: `${statusColor}33`, // прозрачный фон
                      borderColor: `${statusColor}50`,
                    }}
                  >
                    <CircleAlert className="w-4 h-4" />
                    {statusText}
                  </span>
                </div>

                {/* Описание задания */}
                <article className="flex flex-col gap-2 mb-5">
                  <h2 className="text-2xl">{hw.homework.title}</h2>
                  <p className="text-[#999]">{hw.homework.description}</p>
                </article>

                {/* Вторичное задание */}
                {hw.homework.secondaryTask && (
                  <p className="text-[#999] text-lg mb-5">{hw.homework.secondaryTask}</p>
                )}

                {/* Файлы самого задания */}
                {hw.homework.files?.length > 0 && (
                  <div className="flex flex-col gap-1 mb-5">
                    {hw.homework.files.map((file: string, idx: number) => (
                      <a
                        key={idx}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#51A2FF] text-sm hover:underline flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" /> {file.split("/").pop()}
                      </a>
                    ))}
                  </div>
                )}

                {/* Решение студента */}
                {hw.text && (
                  <div className="flex flex-col gap-1 mb-5">
                    <span className="text-[#999] text-sm">Ваше решение:</span>
                    <p className="text-[#ccc]">{hw.text}</p>

                    {hw.files?.length > 0 &&
                      hw.files.map((file: string, idx: number) => (
                        <a
                          key={idx}
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#51A2FF] text-sm hover:underline flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" /> {file.split("/").pop()}
                        </a>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Дата отправки и кнопка скачать решение */}
            <div className="flex gap-5 items-center justify-between bg-[#2A2A2A] p-5 rounded-md mt-5">
              <span className="flex items-center text-[#999] text-sm">
                <FileText className="w-4 h-4 mr-2" /> Работа отправлена{" "}
                {new Date(hw.createdAt).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>

              {hw.files?.length > 0 || hw.text ? (
                <button className="flex items-center bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-1 text-sm rounded-sm">
                  <Download className="w-4 h-4 mr-2" /> Скачать решение
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
