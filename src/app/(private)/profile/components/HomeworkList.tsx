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

  useEffect(() => {
    async function loadHomeworks() {
      setLoading(true);

      const activeCourse = courses.find((c) => c.status === "ACTIVE");

      if (!activeCourse) {
        // Если нет активного курса — очищаем список и ставим loading в false
        setHomeworks([]);
        setLoading(false);
        return;
      }

      try {
        const fullCourse: Course = await getCourseById(activeCourse.courseId);
        let hwList: Homework[] = [];

        fullCourse.modules?.forEach((module) => {
          module.lessons?.forEach((lesson: any) => {
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
        setHomeworks([]); // на случай ошибки очищаем
      } finally {
        setLoading(false); // важно ставить loading в false всегда
      }
    }

    // Запускаем загрузку только если курсы уже подгружены
    if (!coursesLoading) {
      loadHomeworks();
    }
  }, [courses, coursesLoading]);

  // Skeleton / Загрузка
  if (coursesLoading || loading) {
    return (
      <div className="w-full p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg animate-pulse h-[300px]" />
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
