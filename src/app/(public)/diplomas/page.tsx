"use client";

import { useEffect, useState } from "react";
import MainContainer from "@/components/MainContainer";
import Link from "next/link";
import { motion, Transition } from "framer-motion";
import { FileText } from "lucide-react";
import { getDiplomas, Diploma } from "@/services/diplomas/diploms.api";

// Анимация карточек
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    } as Transition,
  }),
};

// Skeleton карточка
function DiplomaSkeleton() {
  return (
    <div className="bg-white/10 rounded-2xl overflow-hidden shadow-md animate-pulse flex flex-col">
      <div className="w-full h-48 bg-white/5" />
      <div className="p-4 flex flex-col justify-between h-40">
        <div className="space-y-2">
          <div className="h-6 bg-white/20 rounded w-3/4" />
          <div className="h-4 bg-white/20 rounded w-1/2" />
          <div className="h-4 bg-white/20 rounded w-1/3" />
        </div>
        <div className="mt-4 h-10 bg-white/20 rounded" />
      </div>
    </div>
  );
}

export default function DiplomasPage() {
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // <-- показываем по 9 дипломов на страницу

  useEffect(() => {
    const fetchDiplomas = async () => {
      setIsLoading(true);
      try {
        const data = await getDiplomas();
        // Сортируем по дате создания по убыванию
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
        );
        setDiplomas(sorted);
      } catch (err) {
        console.error("Ошибка загрузки дипломов:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDiplomas();
  }, []);

  // Фильтр поиска
  const filteredDiplomas = diplomas.filter(
    (d) =>
      d.codeDiplom?.toLowerCase().includes(search.toLowerCase()) ||
      d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.course?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Пагинация: текущие элементы
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentDiplomas = filteredDiplomas.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDiplomas.length / itemsPerPage);

  return (
    <main className="relative min-h-screen py-30 bg-[url('/courses/bg-photo.jpg')] bg-center bg-cover bg-no-repeat">
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      <MainContainer>
        {/* Поиск */}
        <div className="mb-10 w-full max-w-md mx-auto z-20 relative">
          <input
            type="text"
            placeholder="Поиск диплома, студента или курса..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 placeholder-white/70 text-white outline-none focus:ring-2 focus:ring-[#FF7A00] transition-all duration-200"
          />
        </div>

        {/* Сетка дипломов */}
        <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-8 z-20 relative">
          {isLoading
            ? Array.from({ length: itemsPerPage }).map((_, i) => <DiplomaSkeleton key={i} />)
            : currentDiplomas.length === 0
            ? <p className="text-white col-span-full text-center">Дипломы не найдены</p>
            : currentDiplomas.map((diploma, i) => (
                <motion.div
                  key={diploma.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardVariants}
                >
                  <div className="bg-white/10 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    {/* Иконка документа */}
                    <div className="flex items-center justify-center w-full h-48 bg-white/5">
                      {diploma.img && diploma.img[0]?.endsWith(".pdf") ? (
                        <FileText className="text-white/70 w-16 h-16" />
                      ) : diploma.img && diploma.img[0] ? (
                        <img
                          src={diploma.img[0]}
                          alt={diploma.codeDiplom}
                          className="w-32 h-32 object-contain rounded-md"
                        />
                      ) : (
                        <FileText className="text-white/70 w-16 h-16" />
                      )}
                    </div>

                    {/* Текст */}
                    <div className="p-4 flex flex-col justify-between h-40">
                      <div>
                        <h3 className="text-white text-lg font-semibold mb-1">
                          {diploma.user?.name || "—"}
                        </h3>
                        <p className="text-gray-300 text-sm mb-1">{diploma.codeDiplom || "—"}</p>
                        <p className="text-sm text-[#FF7A00]">{diploma.course?.name || "—"}</p>
                      </div>

                      {/* Кнопка скачать */}
                      {diploma.img && diploma.img.length > 0 && (
                        <div className="mt-4">
                          <Link
                            href={diploma.img[0]}
                            target="_blank"
                            className="block text-center px-4 py-2 bg-[#FF7A00] hover:bg-[#f79235] text-white font-medium rounded-lg transition-colors duration-200"
                          >
                            Скачать
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
        </section>

        {/* Навигация по страницам */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-10 z-20 relative">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
            >
              Назад
            </button>
            <span className="px-4 py-2 text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
            >
              Вперед
            </button>
          </div>
        )}
      </MainContainer>
    </main>
  );
}
