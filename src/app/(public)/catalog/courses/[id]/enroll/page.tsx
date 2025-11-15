import MainContainer from "@/components/MainContainer";
import EnrollForm from "./components/EnrollForm";
import CourseInfo from "./components/CourseInfo";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EnrollPageProps {
  params: {
    id: string; // id из [id] в маршруте
  };
}


export default function EnrollPage({ params }: EnrollPageProps) {
  const { id } = params;

  return (
    <main className="my-30">
      <MainContainer>
        <Link className="mb-10" href={`/catalog/courses/info?id=${id}`}>
          <button className="px-4 flex justify-center items-center bg-[#0A0A0A] border border-[#2A2A2A] py-2 rounded-lg "><ArrowLeft className="w-5 h-5 mr-6" /> Назад к курсу</button>
        </Link>
        <article>
          <h1 className="text-3xl mb-3">Запись на курс</h1>
          <p className="text-[#999] mb-10">Заполните форму, и мы свяжемся с вами для подтверждения записи</p>
        </article>

        <section className="flex flex-col lg:flex-row justify-between items-start gap-10">
          <EnrollForm />
          <CourseInfo />
        </section>
      </MainContainer>
    </main>
  )
}