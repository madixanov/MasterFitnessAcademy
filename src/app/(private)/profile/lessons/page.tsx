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

export default function Lessons() {
  const {
    courses,
    loading: coursesLoading,
    fetchMyCourses,
  } = useMyCoursesStore();

  const [lessons, setLessons] = useState<LessonFull[]>([]);
  const [loading, setLoading] = useState(true);

  /* 1️⃣ если стор пустой — грузим мои курсы */
  useEffect(() => {
    if (!courses.length && !coursesLoading) {
      fetchMyCourses();
    }
  }, [courses.length, coursesLoading, fetchMyCourses]);

  /* 2️⃣ когда курсы появились — грузим уроки */
  useEffect(() => {
    async function loadLessons() {
      setLoading(true);

      const activeCourse = courses.find(c => c.status === "ACTIVE");
      if (!activeCourse) {
        setLessons([]);
        setLoading(false);
        return;
      }

      try {
        const fullCourse: Course = await getCourseById(activeCourse.courseId);
        const allLessons: LessonFull[] = [];

        fullCourse.modules?.forEach(module => {
          module.lessons?.forEach((lesson: any) => {
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
  const upcomingLessons = lessons.filter(
    l => new Date(l.startsAt).getTime() > now
  );
  const finishedLessons = lessons.filter(
    l => new Date(l.startsAt).getTime() <= now
  );

  if (coursesLoading || loading) {
    return <div className="text-gray-400">Загрузка уроков...</div>;
  }

  return (
    <main className="flex flex-col">
      <h2 className="text-4xl font-medium mb-3">Уроки</h2>
      <p className="text-sm text-[#999] mb-6">
        Расписание и история занятий
      </p>

      <Tabs.Root defaultValue="upcoming" className="flex flex-col w-full">
        <Tabs.List className="relative flex bg-[#2A2A2A] mb-6 justify-center md:justify-start items-center rounded-lg py-1 px-2 overflow-hidden max-w-xs">
          <Tabs.Trigger
            value="upcoming"
            className="px-6 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A]"
          >
            Предстоящие
          </Tabs.Trigger>

          <Tabs.Trigger
            value="finished"
            className="px-6 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A]"
          >
            Завершенные
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="upcoming">
          <UpcomingLessons lessons={upcomingLessons} />
        </Tabs.Content>

        <Tabs.Content value="finished">
          <FinishedLessons lessons={finishedLessons} />
        </Tabs.Content>
      </Tabs.Root>
    </main>
  );
}
