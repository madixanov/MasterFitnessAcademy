"use client";

import { useEffect, useState } from "react";
import MainContainer from "@/components/MainContainer";
import LessonModules, { Module } from "./components/LessonModulesList";
import { CircleCheckBig, Clock, BookOpen, Users, ChartColumn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCourseById, Course } from "@/services/courses/courses.api";
import { useCourseStore } from "@/store/courseStore";

// Skeleton для страницы курса
function CourseSkeleton() {
  return (
    <MainContainer>
      <div className="animate-pulse flex flex-col gap-6">
        <div className="h-8 w-32 bg-white/10 rounded"></div>
        <div className="h-10 w-2/3 bg-white/10 rounded"></div>
        <div className="h-6 w-full bg-white/10 rounded"></div>
        <div className="h-6 w-[90%] bg-white/10 rounded"></div>
        <div className="h-6 w-[95%] bg-white/10 rounded"></div>
        <div className="flex flex-wrap gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 w-24 md:w-32 bg-white/10 rounded" />
          ))}
        </div>
        <div className="h-40 w-full bg-white/10 rounded mt-6" />
      </div>
    </MainContainer>
  );
}

export default function CourseInfoPage() {
  const params = useSearchParams();
  const router = useRouter();
  const setCourseStore = useCourseStore((state) => state.setCourse);

  // безопасно приводим id к string
  const rawId = params.get("id");
  const id: string | undefined = Array.isArray(rawId) ? rawId[0] : rawId || undefined;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getCourseById(id)
      .then((data) => {
        setCourse(data);
        setCourseStore(data); // сохраняем курс в store для enroll page
      })
      .catch((err) => console.error("Ошибка загрузки курса:", err))
      .finally(() => setLoading(false));
  }, [id, setCourseStore]);

  if (loading || !course) return <CourseSkeleton />;

  // Преимущества курса
  const advantages = course.Course_Benefits_Sheet
    ? course.Course_Benefits_Sheet.split("\n\n").map((a) => a.trim()).filter(Boolean)
    : [];

  // Модули курса
  const modules: Module[] = course.modules?.map((mod) => ({
    title: mod.name,
    lessons: [{ title: mod.name, desc: mod.desc }]
  })) || [];

  return (
    <main className="my-30">
      <MainContainer>
        {/* Название курса */}
        <article className="w-full mb-10">
          <span className="bg-[#FF7A00] px-3 rounded-sm py-0.5 text-sm">Новый курс</span>
          <h1 className="text-4xl my-5">{course.name}</h1>
          <p className="text-[#999] max-w-2xl">{course.description}</p>
        </article>

        {/* Основные параметры */}
        <div className="w-full flex flex-col md:flex-row gap-5 mt-10">
          <div className="flex w-full flex-col justify-center items-center border border-[#2A2A2A] rounded-md bg-[#1a1a1a] p-5">
            <Clock className="w-7 h-7 text-[#FF7A00]" />
            <h2 className="text-xl">{course.Course_duration}</h2>
            <p className="text-sm text-[#999]">Длительность</p>
          </div>
          <div className="flex w-full flex-col justify-center items-center border border-[#2A2A2A] rounded-md bg-[#1a1a1a] p-5">
            <BookOpen className="w-7 h-7 text-[#FF7A00]" />
            <h2 className="text-xl">{course.Number_of_lessons}</h2>
            <p className="text-sm text-[#999]">Количество уроков</p>
          </div>
          <div className="flex w-full flex-col justify-center items-center border border-[#2A2A2A] rounded-md bg-[#1a1a1a] p-5">
            <Users className="w-7 h-7 text-[#FF7A00]" />
            <h2 className="text-xl">{course.Training_format}</h2>
            <p className="text-sm text-[#999]">Формат обучения</p>
          </div>
          <div className="flex w-full flex-col justify-center items-center border border-[#2A2A2A] rounded-md bg-[#1a1a1a] p-5">
            <ChartColumn className="w-7 h-7 text-[#FF7A00]" />
            <h2 className="text-xl">
              {course.level === 1 ? "Начальный" : course.level === 2 ? "Средний" : "Продвинутый"}
            </h2>
            <p className="text-sm text-[#999]">Уровень сложности</p>
          </div>
        </div>

        {/* Программа курса */}
        <section className="mt-10 w-full">
          <h2 className="text-2xl mb-5">Программа курса</h2>
          <LessonModules modules={modules} />
        </section>

        {/* Преимущества */}
        <div className="mt-10 w-full">
          <h2 className="text-2xl mb-5">Преимущества курса</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advantages.map((a, index) => (
              <div key={index} className="flex items-center w-full px-5 py-4 border border-[#2A2A2A] rounded-md bg-[#1a1a1a]">
                <CircleCheckBig className="w-5 h-5 mr-4 text-[#FF7A00]" /> {a}
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка записи */}
        <div className="flex justify-center items-center w-full mt-20">
          <button
            onClick={() => id && router.push(`/catalog/courses/enroll/${id}`)}
            className="bg-[#FF7A00] px-10 py-5 rounded-md font-medium cursor-pointer"
          >
            Записаться на курс
          </button>
        </div>
      </MainContainer>
    </main>
  );
}
