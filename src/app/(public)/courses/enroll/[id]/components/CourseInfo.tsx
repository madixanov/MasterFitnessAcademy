import { Calendar, Clock, BookOpen } from "lucide-react";
import { Course } from "@/services/courses/courses.api";

interface CourseInfoProps {
  course: Course;
}

export default function CourseInfo({ course }: CourseInfoProps) {
  return (
    <div>
      <article className="flex flex-col bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg w-full">
        <p className="text-lg">Информация о курсе</p>

        {/* Заголовок курса */}
        <div className="border-b py-5 border-b-[#2A2A2A] mt-5">
          <span className="text-sm rounded-md px-2 py-0.5 bg-[#FF7A00]">Новый курс</span>
          <h2 className="text-xl mt-3">{course.name}</h2>
        </div>

        {/* Основные параметры */}
        <div className="flex flex-col py-5 border-b border-b-[#2A2A2A] gap-5">
          <div className="flex gap-2 items-start">
            <Calendar className="text-[#FF7A00] w-5 h-5" />
            <article className="flex flex-col items-start">
              <span className="text-sm text-[#999]">Старт курса</span>
              <p>{new Date(course.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</p>
            </article>
          </div>

          <div className="flex gap-2 items-start">
            <Clock className="text-[#FF7A00] w-5 h-5" />
            <article className="flex flex-col items-start">
              <span className="text-sm text-[#999]">Длительность</span>
              <p>{course.Course_duration}</p>
            </article>
          </div>

          <div className="flex gap-2 items-start">
            <BookOpen className="text-[#FF7A00] w-5 h-5" />
            <article className="flex flex-col items-start">
              <span className="text-sm text-[#999]">Уроков</span>
              <p>{course.Number_of_lessons} занятия</p>
            </article>
          </div>
        </div>

        {/* Стоимость */}
        <div className="mt-5">
          <h1 className="text-2xl text-[#FF7A00]">{course.price.toLocaleString()} UZS</h1>
          <p className="text-[#999] text-sm">Стоимость курса</p>
        </div>
      </article>

      {/* Информация о записи */}
      <div className="border border-[#FF7A00]/20 bg-[#FF7A00]/5 p-5 mt-10 rounded-lg">
        <p>После отправки заявки с вами свяжется наш менеджер для уточнения деталей и подтверждения записи на курс.</p>
      </div>
    </div>
  );
}
