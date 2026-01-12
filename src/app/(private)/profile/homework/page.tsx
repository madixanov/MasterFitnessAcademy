"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

import WaitingHomeworks from "./components/WaitingHomeworks";
import OnCheckingHomeworks from "./components/OnCheckingHomeworks";
import CheckedHomeworks from "./components/CheckedHomeworks";

import { getMyCourses, MyCourse } from "@/services/mycourse/mycourse.api";
import { getCourseById, Course } from "@/services/courses/courses.api";
import { getMyHomeworkSubmissions, HomeworkSubmission, Homework } from "@/services/homework/homework.api";

export default function Lessons() {
  const [allHomeworks, setAllHomeworks] = useState<Homework[]>([]);
  const [submittedHomeworks, setSubmittedHomeworks] = useState<HomeworkSubmission[]>([]);

  const [waiting, setWaiting] = useState<Homework[]>([]);
  const [checking, setChecking] = useState<(HomeworkSubmission & { homework: Homework })[]>([]);
  const [checked, setChecked] = useState<(HomeworkSubmission & { homework: Homework })[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Получаем курсы пользователя
        const myCourses: MyCourse[] = await getMyCourses();
        if (!myCourses.length) return;

        const courseId = myCourses[0].courseId; // берём первый курс

        // 2. Получаем курс с модулями и уроками
        const course: Course = await getCourseById(courseId);

        // 3. Собираем все домашки из модулей и уроков
        const homeworks: Homework[] = [];
        course.modules?.forEach(module => {
          module.lessons?.forEach((lesson: any) => {
            lesson.homeworks?.forEach((hw: Homework) => homeworks.push(hw));
          });
        });

        setAllHomeworks(homeworks);

        // 4. Получаем домашки пользователя
        const submissions: HomeworkSubmission[] = await getMyHomeworkSubmissions();
        setSubmittedHomeworks(submissions);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  // 5. Разделяем домашки по статусу
  useEffect(() => {
    if (!allHomeworks.length) return;

    const waitingArr: Homework[] = [];
    const checkingArr: (HomeworkSubmission & { homework: Homework })[] = [];
    const checkedArr: (HomeworkSubmission & { homework: Homework })[] = [];

    allHomeworks.forEach(hw => {
      const submissionsForHw = submittedHomeworks.filter(s => s.homeworkId === hw.id);

      if (submissionsForHw.length === 0) {
        waitingArr.push(hw); // ещё не отправлено
      } else {
        submissionsForHw.forEach(submission => {
          if (submission.status === "PENDING") {
            checkingArr.push({ ...submission, homework: hw });
          } else if (submission.status === "CHECKED" || submission.status === "REJECTED") {
            checkedArr.push({ ...submission, homework: hw });
          }
        });
      }
    });

    setWaiting(waitingArr);
    setChecking(checkingArr);
    setChecked(checkedArr);
  }, [allHomeworks, submittedHomeworks]);

  return (
    <main className="flex flex-col">
      <h2 className="text-4xl font-medium pl-15 lg:pl-0 mb-3">Домашние задания</h2>
      <p className="text-sm text-[#999] lg:text-lg">Управление учебными заданиями</p>

      <Tabs defaultValue="waiting" className="mt-6 flex flex-col w-full">
        <TabsList className="relative flex bg-[#2A2A2A] mb-6 justify-center md:justify-start items-center rounded-lg py-1 px-2 overflow-hidden w-full max-w-md mx-auto md:mx-0">
          <TabsTrigger
            value="waiting"
            className="px-6 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A] data-[state=active]:font-semibold text-sm md:text-base flex-1 md:flex-auto text-center"
          >
            Ожидают
          </TabsTrigger>
          <TabsTrigger
            value="checking"
            className="px-6 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A] data-[state=active]:font-semibold text-sm md:text-base flex-1 md:flex-auto text-center"
          >
            На проверке
          </TabsTrigger>
          <TabsTrigger
            value="checked"
            className="px-6 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A] data-[state=active]:font-semibold text-sm md:text-base flex-1 md:flex-auto text-center"
          >
            Проверено
          </TabsTrigger>
        </TabsList>

        <TabsContent value="waiting">
          <WaitingHomeworks homeworks={waiting} />
        </TabsContent>

        <TabsContent value="checking">
          <OnCheckingHomeworks homeworks={checking} />
        </TabsContent>

        <TabsContent value="checked">
          <CheckedHomeworks homeworks={checked} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
