"use client";

import { useEffect, useState } from "react";
import { Upload } from "lucide-react";

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
              subject: lesson.subject || lesson.name,
              task: lesson.task || lesson.name,
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
