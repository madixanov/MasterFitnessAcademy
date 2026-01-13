"use client";

import { useEffect, useState } from "react";
import MainContainer from "@/components/MainContainer";
import ProductContainer from "@/components/UI/ProductContainer";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion, Transition } from "framer-motion";

import { getCourses, Course } from "@/services/courses/courses.api";

// Skeleton карточки курса
function CourseSkeleton() {
  return (
    <div className="animate-pulse w-full h-[280px] bg-white/10 rounded-2xl" />
  );
}

// Варианты анимации для карточек
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

// Цвет статуса
const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-yellow-600 text-white";
    case "PENDING":
      return "bg-blue-600 text-white";
    case "COMPLETED":
      return "bg-green-600 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

// Статус на русском
const getStatusText = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Начат";
    case "PENDING":
      return "Набор";
    case "COMPLETED":
      return "Завершён";
    default:
      return "";
  }
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((data) => {
        // Фильтруем INACTIVE курсы
        setCourses(data.filter((course) => course.status !== "INACTIVE"));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/courses/bg-photo.jpg"
          as="image"
          type="image/svg+xml"
        />
      </Head>

      <main className="relative bg-[url('/courses/bg-photo.jpg')] bg-center bg-cover bg-no-repeat py-25 lg:py-30 xl:py-40 flex justify-center items-center min-h-[calc(100vh-140px)] w-full">
        <div className="hidden lg:block absolute inset-0 z-10 overflow-hidden">
          <div className="w-full h-full rotate-90">
            <Image
              src="/courses/figure.svg"
              alt="figure"
              fill
              className="object-contain object-center opacity-70"
            />
          </div>
        </div>

        {/* Затемнение фона */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        {/* Контент поверх */}
        <MainContainer>
          <section className="relative z-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <CourseSkeleton key={i} />
                ))
              : courses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={cardVariants}
                  >
                    <Link href={`/courses/info?id=${course.id}`}>
                      <ProductContainer
                        title="Курс"
                        description={
                          <>
                            <div>{course.name}</div>
                            <span
                              className={`mt-2 inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                course.status
                              )}`}
                            >
                              {getStatusText(course.status)}
                            </span>
                          </>
                        }
                        image={course.image?.[0] || "/courses/default.jpg"}
                      />
                    </Link>
                  </motion.div>
                ))}
          </section>
        </MainContainer>
      </main>
    </>
  );
}
