"use client";

import { useEffect, useState } from "react";
import MainContainer from "@/components/MainContainer";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, Transition } from "framer-motion";
import { FileText } from "lucide-react";
import { getDiplomaById, Diploma } from "@/services/diplomas/diploms.api";

// Анимация карточки
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } as Transition },
};

// Skeleton для диплома
function DiplomaSkeleton() {
  return (
    <div className="max-w-4xl mx-auto bg-white/10 rounded-2xl shadow-xl overflow-hidden relative z-20 animate-pulse">
      <div className="flex items-center justify-center w-full h-64 bg-white/5" />
      <div className="p-6 space-y-4">
        <div className="h-8 bg-white/20 rounded w-1/3" />
        <div className="h-4 bg-white/20 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-white/20 rounded w-full" />
          <div className="h-4 bg-white/20 rounded w-5/6" />
          <div className="h-4 bg-white/20 rounded w-2/3" />
          <div className="h-4 bg-white/20 rounded w-1/2" />
        </div>
        <div className="h-10 bg-white/20 rounded w-32 mt-4" />
      </div>
    </div>
  );
}

// Вспомогательная функция для красивой даты
const formatDate = (date?: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU");
};

export default function SingleDiplomaPage() {
  const router = useRouter();
  const params = useParams();
  const diplomaId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [diploma, setDiploma] = useState<Diploma | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!diplomaId) return;

    const fetchDiploma = async () => {
      setIsLoading(true);
      try {
        const data = await getDiplomaById(diplomaId);
        setDiploma(data);
      } catch (err) {
        console.error("Ошибка загрузки диплома:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiploma();
  }, [diplomaId]);

  if (isLoading)
    return (
      <MainContainer>
        <DiplomaSkeleton />
      </MainContainer>
    );

  if (!diploma)
    return (
      <MainContainer>
        <div className="flex justify-center items-center h-96 text-white">
          Диплом не найден
        </div>
      </MainContainer>
    );

  return (
    <main className="relative min-h-screen py-30 bg-[url('/courses/bg-photo.jpg')] bg-center bg-cover bg-no-repeat">
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      <MainContainer>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="max-w-4xl mx-auto bg-white/10 rounded-2xl shadow-xl overflow-hidden relative z-20"
        >
          {/* Верхняя часть — иконка или изображение диплома */}
          <div className="flex items-center justify-center w-full h-64 bg-white/5">
            {diploma.img && diploma.img[0]?.endsWith(".pdf") ? (
              <FileText className="text-white/70 w-20 h-20" />
            ) : diploma.img && diploma.img[0] ? (
              <img
                src={diploma.img[0]}
                alt={diploma.codeDiplom}
                className="w-40 h-40 object-contain rounded-md"
              />
            ) : (
              <FileText className="text-white/70 w-20 h-20" />
            )}
          </div>

          {/* Информация о дипломе */}
          <div className="p-6 text-white space-y-4">
            <h2 className="text-2xl font-bold">{diploma.user?.name || "—"}</h2>
            <p className="text-gray-300">Код диплома: {diploma.codeDiplom || "—"}</p>

            <div className="space-y-2">
              <p>
                <span className="font-semibold text-[#FF7A00]">Курс:</span>{" "}
                {diploma.course ? (
                  <Link
                    href={`/courses/info?id=${diploma.course.id}`}
                    className="underline hover:text-[#f79235] transition-colors"
                  >
                    {diploma.course.name}
                  </Link>
                ) : (
                  "—"
                )}
              </p>
              {diploma.course && (
                <>
                  {diploma.course.description && (
                    <p>
                      <span className="font-semibold text-[#FF7A00]">Описание:</span>{" "}
                      {diploma.course.description}
                    </p>
                  )}
                  {diploma.course.price && (
                    <p>
                      <span className="font-semibold text-[#FF7A00]">Цена:</span> {diploma.course.price} UZS
                    </p>
                  )}
                  {diploma.course.Course_duration && (
                    <p>
                      <span className="font-semibold text-[#FF7A00]">Длительность:</span>{" "}
                      {diploma.course.Course_duration}
                    </p>
                  )}
                  {diploma.course.Number_of_lessons && (
                    <p>
                      <span className="font-semibold text-[#FF7A00]">Количество уроков:</span>{" "}
                      {diploma.course.Number_of_lessons}
                    </p>
                  )}
                </>
              )}

              <p>
                <span className="font-semibold text-[#FF7A00]">Учитель:</span>{" "}
                {diploma.teacher?.name || "—"}
              </p>
              <p>
                <span className="font-semibold text-[#FF7A00]">Дата окончания курса:</span>{" "}
                {formatDate(diploma.courseFinishedAt)}
              </p>
              <p>
                <span className="font-semibold text-[#FF7A00]">Дата выдачи диплома:</span>{" "}
                {formatDate(diploma.issuedAt)}
              </p>
            </div>

            {/* Кнопка скачать */}
            {diploma.img && diploma.img.length > 0 && (
              <Link
                href={diploma.img[0]}
                target="_blank"
                className="inline-block px-6 py-3 bg-[#FF7A00] hover:bg-[#f79235] text-white font-medium rounded-lg transition-colors duration-200 mr-2"
              >
                Скачать диплом
              </Link>
            )}

            <button
              onClick={() => router.back()}
              className="mt-4 px-6 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              Назад
            </button>
          </div>
        </motion.div>
      </MainContainer>
    </main>
  );
}
