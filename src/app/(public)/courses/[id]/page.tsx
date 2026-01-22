"use client";

import { useEffect, useState, useRef } from "react";
import MainContainer from "@/components/MainContainer";
import LessonModules, { Module } from "./components/LessonModulesList";
import { CircleCheckBig, Clock, BookOpen, Users, DollarSign } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCourseById, Course } from "@/services/courses/courses.api";
import { useCourseStore } from "@/store/courseStore";
import { createOrder } from "@/services/orders/orders.api"; 
import Toast from "@/components/UI/toast";
import { motion } from "framer-motion";
import { getSocialNetworks, SocialNetwork } from "@/services/socials/socials.api";

// Skeleton курса
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

// Анимация для motion.div
const fadeInUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CourseInfoPage() {
  const params = useSearchParams();
  const router = useRouter();
  const setCourseStore = useCourseStore((state) => state.setCourse);

  const rawId = params.get("id");
  const id: string | undefined = Array.isArray(rawId) ? rawId[0] : rawId || undefined;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  const [consultingLink, setConsultingLink] = useState<string | null>(null);

  // Флаг, чтобы предотвратить двойное создание заказа
  const orderCreatedRef = useRef(false);

  // Загрузка курса
  useEffect(() => {
    if (!id) return;

    getCourseById(id)
      .then((data) => {
        setCourse(data);
        setCourseStore(data);
      })
      .catch((err) => console.error("Ошибка загрузки курса:", err))
      .finally(() => setLoading(false));
  }, [id, setCourseStore]);

  // Проверка статуса курса
  useEffect(() => {
    if (!course) return;
    if (course.status === "INACTIVE") {
      router.push("/courses");
    }
  }, [course, router]);

  // Получаем ссылку на консультацию
  useEffect(() => {
    const fetchConsultingLink = async () => {
      try {
        const socials = await getSocialNetworks();
        const consulting = socials.find(
          (item) => item.name.toLowerCase() === "consulting"
        );
        if (consulting) {
          setConsultingLink(consulting.url);
        }
      } catch (e) {
        console.error("Ошибка загрузки consulting:", e);
      }
    };

    fetchConsultingLink();
  }, []);

  const handleCreateOrder = async () => {
    if (!id || orderCreatedRef.current) return;

    setCreatingOrder(true);
    orderCreatedRef.current = true;

    try {
      await createOrder({ courseId: id });
      showToast("Заказ успешно создан!", "success");
    } catch (e) {
      console.error(e);
      showToast("Ошибка при создании заказа", "error");
      orderCreatedRef.current = false;
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading || !course) return <CourseSkeleton />;

  const advantages = course.Course_Benefits_Sheet
    ? course.Course_Benefits_Sheet.split("\n\n").map((a) => a.trim()).filter(Boolean)
    : [];

  const modules: Module[] = course.modules?.map((mod) => ({
    title: mod.name,
    lessons: [{ title: mod.name, desc: mod.desc }]
  })) || [];

  return (
    <main className="my-30">
      <MainContainer>
        {/* Toast */}
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>

        {/* Название курса */}
        <motion.article
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariant}
          transition={{ duration: 0.5 }}
          className="w-full mb-10"
        >
          <span className="bg-[#FF7A00] px-3 rounded-sm py-0.5 text-sm">Новый курс</span>
          <h1 className="text-4xl my-5">{course.name}</h1>
          {course.description.split("\n\n").map((para, idx) => (
            <p key={idx} className="text-[#999] max-w-2xl mb-4">
              {para}
            </p>
          ))}
        </motion.article>

        {/* Основные параметры */}
        <div className="w-full flex flex-col md:flex-row gap-5 mt-10">
          {[
            { icon: <Clock className="w-7 h-7 text-[#FF7A00]" />, value: course.Course_duration, label: "Длительность" },
            { icon: <BookOpen className="w-7 h-7 text-[#FF7A00]" />, value: course.Number_of_lessons, label: "Количество часов" },
            { icon: <Users className="w-7 h-7 text-[#FF7A00]" />, value: course.Training_format, label: "Формат обучения" },
            { icon: <DollarSign className="w-7 h-7 text-[#FF7A00]" />, value: course.price, label: "Стоимость" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariant}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex w-full flex-col justify-center items-center border border-[#2A2A2A] rounded-md bg-[#1a1a1a] p-5"
            >
              {item.icon}
              <h2 className="text-xl">{item.value}</h2>
              <p className="text-sm text-[#999]">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Программа курса */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariant}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 w-full"
        >
          <h2 className="text-2xl mb-5">Программа курса</h2>
          <LessonModules modules={modules} />
        </motion.section>

        {/* Преимущества */}
        <div className="mt-10 w-full">
          <h2 className="text-2xl mb-5">Преимущества курса</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advantages.map((a, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariant}
                transition={{ duration: 0.5, delay: 1 + index * 0.15 }}
                className="flex items-center w-full px-5 py-4 border border-[#2A2A2A] rounded-md bg-[#1a1a1a]"
              >
                <CircleCheckBig className="w-5 h-5 mr-4 text-[#FF7A00]" /> {a}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Кнопки */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariant}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="flex flex-col md:flex-row justify-center items-center w-full mt-20 gap-4"
        >
          {/* Кнопка консультации из socials */}
          {consultingLink && (
            <a
              href={consultingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1a1a1a] px-10 py-5 rounded-md font-medium text-[#FF7A00] transition hover:bg-[#222]"
            >
              Консультация
            </a>
          )}

          {course.status === "ACTIVE" && (
            <div className="p-4 bg-yellow-800 text-white rounded-md text-center">
              Курс уже начат. Создать заказ невозможно.
            </div>
          )}

          {course.status === "COMPLETED" && (
            <div className="p-4 bg-green-800 text-white rounded-md text-center">
              Курс завершён. Создать заказ невозможно.
            </div>
          )}

          {course.status === "PENDING" && (
            <button
              onClick={handleCreateOrder}
              disabled={creatingOrder}
              className="bg-[#FF7A00] px-10 py-5 rounded-md font-medium cursor-pointer text-white disabled:opacity-50"
            >
              {creatingOrder ? "Создание..." : "Создать заказ"}
            </button>
          )}
        </motion.div>
      </MainContainer>
    </main>
  );
}
