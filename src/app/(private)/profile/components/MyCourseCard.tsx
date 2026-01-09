"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Layers, BookOpen } from "lucide-react";

import { useMyCoursesStore } from "@/store/myCourseStore";
import { getCourseById, Course } from "@/services/courses/courses.api";

import MyCourseCardSkeleton from "./MyCourseCardSkeleton";

export default function MyCourseCard() {
  const { courses, loading } = useMyCoursesStore();

  const [myCourse, setMyCourse] = useState<any>(null);
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!courses.length) return;

    const selectedCourse =
      courses.find((c) => c.status === "ACTIVE") ?? courses[0];

    if (!selectedCourse) return;

    setMyCourse(selectedCourse);

    getCourseById(selectedCourse.courseId).then(setCourse);
  }, [courses]);

  if (loading) {
    return <MyCourseCardSkeleton />;
  }


  if (!course || !myCourse) {
    return (
      <div className="mb-10">
        Курс не найден
      </div>
    );
  }

  const courseUrl = `/catalog/courses/info?id=${course.id}`;

  return (
    <div
      className="mb-10 rounded-xl border border-[#834002]
      bg-gradient-to-b from-[#FF7A0033] to-[#FF7A000D]
      p-6"
    >
      <article className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        {/* Картинка */}
        {course.image?.[0] && (
          <img
            src={course.image[0]}
            alt={course.name}
            className="w-full h-[200px] object-cover rounded-lg"
          />
        )}

        {/* Контент */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Заголовок */}
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-[#FF7A00]" />
              <h2 className="text-xl font-semibold">
                {course.name}
              </h2>

              <span
                className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                  myCourse.status === "ACTIVE"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-yellow-500/10 text-yellow-500"
                }`}
              >
                {myCourse.status === "ACTIVE"
                  ? "Активен"
                  : "Скоро начнётся"}
              </span>
            </div>

            {/* Короткое описание */}
            <p className="text-[#999] mb-4 line-clamp-2">
              {course.description}
            </p>

            {/* Метаданные */}
            <div className="flex flex-wrap gap-6 text-sm text-[#999]">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {course.Course_duration} месяца
              </div>

              <div className="flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                {course.Number_of_lessons} часов
              </div>
            </div>
          </div>

          {/* Кнопка */}
          <div className="mt-5">
            <Link href={courseUrl}>
              <button
                className="bg-[#FF7A00] px-5 py-2 rounded-lg
                font-medium text-sm hover:opacity-90 transition"
              >
                Перейти на страницу курса
              </button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
