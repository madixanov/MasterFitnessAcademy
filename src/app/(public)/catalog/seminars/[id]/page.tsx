"use client"

import MainContainer from "@/components/MainContainer";
import LessonModules from "./components/LessonModulesList";
import { CircleCheckBig, Clock, BookOpen, Users, ChartColumn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const modules = [
  {
    title: "Основы",
    lessons: [
      {
        title: "Введение в основы",
        description: "Знакомство с базовыми понятиями и принципами работы",
      },
      {
        title: "Практические упражнения",
        description: "Отработка навыков на реальных примерах",
      },
    ],
  },
  {
    title: "Углубленное изучение",
    lessons: [],
  },
  {
    title: "Финальный проект",
    lessons: [],
  },
];

const advantages = [
  "Индивидуальный подход к каждому ученику",
  "Практические задания после каждого урока",
  "Доступ к материалам курса на 6 месяцев",
  "Сертификат о прохождении курса"
];

export default function CourseInfoPage() {
  const params = useSearchParams();
  console.log(params)
  const id = params.get("id");

  const router = useRouter();

  return (
    <main className="my-30">
      <MainContainer>
        <article className="w-full">
          <span className="bg-[#FF7A00] px-3 rounded-sm py-0.5 text-sm">Новый курс</span>
          <h1 className="text-4xl my-5">Продвинутый веб-разработчик</h1>
          <p className="text-[#999] max-w-200">Освойте современные технологии веб-разработки и создавайте профессиональные приложения. Курс охватывает все ключевые аспекты: от базовых концепций до сложных паттернов проектирования. Вы получите практические навыки работы с актуальными инструментами и frameworks, которые помогут вам в карьере разработчика.</p>
        </article>

        <div className="w-full flex flex-col md:flex-row gap-5 mt-10">
          <div className="flex w-full flex-col justify-center items-center border border-[#2A2A2A] rounded-md bg-[#1a1a1a] p-5">
            <Clock className="w-7 h-7 text-[#FF7A00]" />
            <h2 className="text-xl">3 месяца</h2>
            <p className="text-sm text-[#999]">Длительность</p>
          </div>
          <div className="flex w-full flex-col justify-center items-center border border-[#2A2A2A] rounded-md bg-[#1a1a1a] p-5">
            <BookOpen className="w-7 h-7 text-[#FF7A00]" />
            <h2 className="text-xl">24 урока</h2>
            <p className="text-sm text-[#999]">Количество уроков</p>
          </div>
          <div className="flex w-full flex-col justify-center items-center border border-[#2A2A2A] rounded-md bg-[#1a1a1a] p-5">
            <Users className="w-7 h-7 text-[#FF7A00]" />
            <h2 className="text-xl">Онлайн</h2>
            <p className="text-sm text-[#999]">Формат обучения</p>
          </div>
          <div className="flex w-full flex-col justify-center items-center border border-[#2A2A2A] rounded-md bg-[#1a1a1a] p-5">
            <ChartColumn className="w-7 h-7 text-[#FF7A00]" />
            <h2 className="text-xl">Средний</h2>
            <p className="text-sm text-[#999]">Уровень сложности</p>
          </div>
        </div>

        <section className="mt-10 w-full">
          <h2 className="text-2xl mb-5">Программа курса</h2>
          <LessonModules modules={modules}/>
        </section>

        <div className="mt-10 w-full">
          <h2 className="text-2xl mb-5">Преимущества курса</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advantages.map((a, index) => (
              <div key={index} className="flex items-center w-full px-5 py-4 border border-[#2A2A2A] rounded-md bg-[#1a1a1a]">
                <CircleCheckBig className="w-5 h-5 mr-4 text-[#FF7A00]"/> {a}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center w-full mt-20">
          <button
            onClick={() => router.push(`/catalog/seminars/${id}/enroll`)}
            className="bg-[#FF7A00] px-10 py-5 rounded-md font-medium cursor-pointer"
          >
            Записаться на курс
          </button>
        </div>
      </MainContainer>
    </main>
  )
}