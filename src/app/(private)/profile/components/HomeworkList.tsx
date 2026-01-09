"use client";

import { useEffect, useState } from "react";
import { Upload, CircleAlert, CircleCheckBig } from "lucide-react";

import { useMyCoursesStore } from "@/store/myCourseStore";
import { getCourseById, Course } from "@/services/courses/courses.api";

interface Homework {
  id: string;
  subject: string;
  task: string;
  status: "Ожидает" | "На проверке" | "Проверено";
  grade: string;
}

export default function HomeworkList() {
  const { courses, loading: coursesLoading } = useMyCoursesStore();
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeworks() {
      setLoading(true);

      const activeCourse = courses.find((c) => c.status === "ACTIVE");
      if (!activeCourse) {
        setHomeworks([]);
        setLoading(false);
        return;
      }

      try {
        const fullCourse: Course = await getCourseById(activeCourse.courseId);
        const hwList: Homework[] = [];

        fullCourse.modules?.forEach((module) => {
          module.lessons?.forEach((lesson: any) => {
            hwList.push({
              id: lesson.id,
              subject: lesson.subject || lesson.name, // если нет отдельного subject
              task: lesson.task || lesson.name,
              status:
                lesson.status === "COMPLETED"
                  ? "Проверено"
                  : lesson.status === "PENDING"
                  ? "Ожидает"
                  : "На проверке",
              grade: lesson.grade || "",
            });
          });
        });

        setHomeworks(hwList);
      } catch (err) {
        console.error("Не удалось загрузить домашние задания:", err);
      } finally {
        setLoading(false);
      }
    }

    if (courses.length > 0) {
      loadHomeworks();
    }
  }, [courses]);

  if (coursesLoading || loading) {
    // Skeleton
    return (
      <div className="w-full p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg animate-pulse h-[300px]" />
    );
  }

  if (!homeworks.length) {
    return (
      <div className="w-full p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-gray-400">
        Нет домашних заданий
      </div>
    );
  }

  return (
    <div className="w-full p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
      <h2 className="mb-5 text-lg font-semibold">Домашние задания</h2>
      <div className="flex flex-col gap-3">
        {homeworks.map((hw) => (
          <div
            key={hw.id}
            className="w-full flex flex-col p-3 bg-[#2A2A2A] rounded-md"
          >
            <div className="flex justify-between">
              <h2>{hw.task}</h2>
              <span className="text-xl text-[#FF7A00]">{hw.grade}</span>
            </div>
            <span className="text-[#999] mb-2">{hw.subject}</span>

            {hw.status === "Ожидает" ? (
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center gap-2 text-[#FDC700] bg-[#F0B100]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#F0B100]/30">
                  <CircleAlert className="w-4 h-4" /> {hw.status}
                </span>
                <button className="bg-black px-2 py-0.5 rounded-md flex items-center gap-3 text-md cursor-pointer transition hover:bg-black/50">
                  <Upload className="w-4 h-4" />Загрузить
                </button>
              </div>
            ) : hw.status === "Проверено" ? (
              <div className="flex">
                <span className="inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#00C950]/30">
                  <CircleCheckBig className="w-4 h-4" /> {hw.status}
                </span>
              </div>
            ) : (
              <div className="flex">
                <span className="inline-flex items-center gap-2 text-[#51A2FF] bg-[#2B7FFF]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#2B7FFF]/30">
                  <CircleAlert className="w-4 h-4" /> {hw.status}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
