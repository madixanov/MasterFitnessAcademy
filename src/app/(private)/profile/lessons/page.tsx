"use client";

import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useMyCoursesStore } from "@/store/myCourseStore";
import { getCourseById, Course } from "@/services/courses/courses.api";
import UpcomingLessons from "./components/UpcomingLessons";
import FinishedLessons from "./components/FinishedLessons";

export interface LessonFull {
  id: string;
  name: string;
  title: string;
  desc: string;
  video: string;
  img: string[];
  duration: number;
  startsAt: string;
  moduleId: string;
  moduleName: string;
  courseId: string;
}

type CourseLessonLike = {
  id: string;
  name: string;
  title: string;
  desc: string;
  video: string;
  img: string[];
  duration: number;
  startsAt: string;
};

export default function Lessons() {
  const {
    courses,
    loading: coursesLoading,
    fetchMyCourses,
  } = useMyCoursesStore();

  const [lessons, setLessons] = useState<LessonFull[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Если стор пустой — загружаем мои курсы
  useEffect(() => {
    if (!courses.length && !coursesLoading) {
      fetchMyCourses();
    }
  }, [courses.length, coursesLoading, fetchMyCourses]);

  // 2. Когда курсы появились — загружаем уроки
  useEffect(() => {
    async function loadLessons() {
      setLoading(true);

      const activeCourse = courses.find(
        (course) => course.status === "ACTIVE"
      );

      if (!activeCourse) {
        setLessons([]);
        setLoading(false);
        return;
      }

      try {
        const fullCourse: Course = await getCourseById(
          activeCourse.courseId
        );

        const allLessons: LessonFull[] = [];

        fullCourse.modules?.forEach((module) => {
          module.lessons?.forEach((lesson: CourseLessonLike) => {
            allLessons.push({
              id: lesson.id,
              name: lesson.name,
              title: lesson.title,
              desc: lesson.desc,
              video: lesson.video,
              img: lesson.img,
              duration: lesson.duration,
              startsAt: lesson.startsAt,
              moduleId: module.id,
              moduleName: module.name,
              courseId: fullCourse.id,
            });
          });
        });

        allLessons.sort(
          (a, b) =>
            new Date(a.startsAt).getTime() -
            new Date(b.startsAt).getTime()
        );

        setLessons(allLessons);
      } catch (err) {
        console.error("Не удалось загрузить уроки:", err);
      } finally {
        setLoading(false);
      }
    }

    if (courses.length) {
      loadLessons();
    }
  }, [courses]);

  const now = Date.now();

  /*
   * Делим уроки на 3 категории:
   *
   * upcoming — ещё не начались
   * active   — уже начались, но ещё не закончились
   * finished — полностью закончились
   */

  const upcomingLessons = lessons.filter((lesson) => {
    const start = new Date(lesson.startsAt).getTime();

    return start > now;
  });

  const activeLessons = lessons.filter((lesson) => {
    const start = new Date(lesson.startsAt).getTime();

    // duration в минутах
    const end = start + lesson.duration * 60 * 1000;

    return start <= now && now < end;
  });

  const finishedLessons = lessons.filter((lesson) => {
    const start = new Date(lesson.startsAt).getTime();
    const end = start + lesson.duration * 60 * 1000;

    return now >= end;
  });

  if (coursesLoading || loading) {
    return (
      <div className="text-gray-400">
        Загрузка уроков...
      </div>
    );
  }

  return (
    <main className="flex flex-col">
      <h2 className="text-4xl font-medium mb-3">
        Уроки
      </h2>

      <p className="text-sm text-[#999] mb-6">
        Расписание и история занятий
      </p>

      <Tabs.Root
        defaultValue="upcoming"
        className="flex flex-col w-full"
      >
        <Tabs.List className="relative flex bg-[#2A2A2A] mb-6 justify-center md:justify-start items-center rounded-lg py-1 px-2 overflow-hidden max-w-fit">
          <Tabs.Trigger
            value="upcoming"
            className="px-5 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A]"
          >
            Предстоящие
          </Tabs.Trigger>

          <Tabs.Trigger
            value="active"
            className="px-5 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A]"
          >
            Сейчас
          </Tabs.Trigger>

          <Tabs.Trigger
            value="finished"
            className="px-5 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A]"
          >
            Завершенные
          </Tabs.Trigger>
        </Tabs.List>

        {/* Предстоящие */}
        <Tabs.Content value="upcoming">
          <UpcomingLessons lessons={upcomingLessons} variant="upcoming" />
        </Tabs.Content>

        {/* Идут сейчас */}
        <Tabs.Content value="active">
          {activeLessons.length > 0 ? (
            <UpcomingLessons lessons={activeLessons} variant="active" />
          ) : (
            <div className="text-[#999] py-10 text-center">
              Сейчас уроков нет
            </div>
          )}
        </Tabs.Content>

        {/* Завершенные */}
        <Tabs.Content value="finished">
          <FinishedLessons lessons={finishedLessons} />
        </Tabs.Content>
      </Tabs.Root>
    </main>
  );
}