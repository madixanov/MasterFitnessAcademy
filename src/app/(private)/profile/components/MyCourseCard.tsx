"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Layers, BookOpen } from "lucide-react";

import { useMyCoursesStore } from "@/store/myCourseStore";
import { getCourseById, Course } from "@/services/courses/courses.api";

import MyCourseCardSkeleton from "./MyCourseCardSkeleton";

interface CourseWithMeta {
  myCourse: any;
  course: Course;
}

function CourseCard({
    course,
    myCourse,
    isActive,
    isCompleted,
  }: {
    course: Course;
    myCourse: any;
    isActive?: boolean;
    isCompleted?: boolean;
  }) {
    const courseUrl = `/courses/info?id=${course.id}`;

    return (
      <div
        className={`rounded-xl border p-6 ${
          isActive
            ? "border-[#834002] bg-gradient-to-b from-[#FF7A0033] to-[#FF7A000D]"
            : "border-[#333] bg-[#1A1A1A]"
        }`}
      >
        <article className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          {course.image?.[0] && (
            <img
              src={course.image[0]}
              alt={course.name}
              className="w-full h-[200px] object-cover rounded-lg"
            />
          )}

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-5 h-5 text-[#FF7A00]" />
                <h2 className="text-xl font-semibold">{course.name}</h2>

                <span
                  className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                    isActive
                      ? "bg-green-500/10 text-green-500"
                      : "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  {isActive ? "Активен" : "Завершён"}
                </span>
              </div>

              <p className="text-[#999] mb-4 line-clamp-2">
                {course.description}
              </p>

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

            <div className="mt-5">
              <Link href={courseUrl}>
                <button
                  className={`px-5 py-2 rounded-lg font-medium text-sm transition ${
                    isActive
                      ? "bg-[#FF7A00] hover:opacity-90"
                      : "bg-[#333] hover:bg-[#444]"
                  }`}
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


export default function MyCourseCard() {
  const { courses, loading } = useMyCoursesStore();

  const [activeCourse, setActiveCourse] = useState<CourseWithMeta | null>(null);
  const [completedCourses, setCompletedCourses] = useState<CourseWithMeta[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    if (!courses.length) return;

    const active = courses.find(c => c.status === "ACTIVE");
    const completed = courses.filter(c => c.status === "COMPLETED");

    async function loadCourses() {
      setLoadingCourses(true);

      try {
        if (active) {
          const course = await getCourseById(active.courseId);
          setActiveCourse({ myCourse: active, course });
        } else {
          setActiveCourse(null);
        }

        const completedFull = await Promise.all(
          completed.map(async c => ({
            myCourse: c,
            course: await getCourseById(c.courseId),
          }))
        );

        setCompletedCourses(completedFull);
      } finally {
        setLoadingCourses(false);
      }
    }

    loadCourses();
  }, [courses]);

  /* skeleton */
  if (loading || loadingCourses) {
    return <MyCourseCardSkeleton />;
  }

  if (!activeCourse && completedCourses.length === 0) {
    return <div className="mb-10">Курсы не найдены</div>;
  }

  return (
    <div className="flex flex-col gap-10 mb-10">
      {/* 🔥 ACTIVE COURSE */}
      {activeCourse && (
        <CourseCard
          course={activeCourse.course}
          myCourse={activeCourse.myCourse}
          isActive
        />
      )}

      {/* ✅ COMPLETED COURSES */}
      {completedCourses.length > 0 && (
        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-medium">Завершённые курсы</h3>

          {completedCourses.map(({ course, myCourse }) => (
            <CourseCard
              key={course.id}
              course={course}
              myCourse={myCourse}
              isCompleted
            />
          ))}
        </div>
      )}
    </div>
  );
}
