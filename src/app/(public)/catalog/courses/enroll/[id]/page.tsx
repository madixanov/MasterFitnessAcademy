"use client";

import { useCourseStore } from "@/store/courseStore";
import CourseInfo from "./components/CourseInfo";
import MainContainer from "@/components/MainContainer";
import Link from "next/link";
import EnrollForm from "./components/EnrollForm";
import { ArrowLeft } from "lucide-react";
import { use } from "react";

export default function EnrollPage({ params }: { params: Promise<{ id: string }> }) {
  // unwrap params
  const { id } = use(params); // теперь id доступен синхронно

  const course = useCourseStore((state) => state.course);

  if (!course) return <p>Загрузка курса...</p>;

  return (
    <main className="flex flex-col min-h-[calc(100vh-140px)] items-center justify-center my-30">
      <MainContainer>
        <Link className="mb-10" href={`/catalog/courses/info?id=${id}`}>
          <button className="px-4 flex justify-center items-center bg-[#0A0A0A] border border-[#2A2A2A] py-2 rounded-lg mb-10">
            <ArrowLeft className="w-5 h-5 mr-6" /> Назад к курсу
          </button>
        </Link>

        <article>
          <h1 className="text-3xl mb-3">Запись на курс</h1>
          <p className="text-[#999] mb-10">
            Заполните форму, и мы свяжемся с вами для подтверждения записи
          </p>
        </article>

        <section className="flex flex-col lg:flex-row justify-between items-start gap-10">
          <EnrollForm courseId={id} />
          <CourseInfo course={course} />
        </section>
      </MainContainer>
    </main>
  );
}
