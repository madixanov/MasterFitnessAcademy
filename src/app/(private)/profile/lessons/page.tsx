"use client";

import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";

import UpcomingLessons from "./components/UpcomingLessons";
import FinishedLessons from "./components/FinishedLessons";

import { getMyCourses } from "@/services/mycourse/mycourse.api";

export default function Lessons() {
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyCourse() {
      setLoading(true);

      const myCourses = await getMyCourses();

      if (myCourses.length) {
        setModuleId(myCourses[0].moduleId);
      }

      setLoading(false);
    }

    fetchMyCourse();
  }, []);

  if (loading) {
    return <div className="text-gray-400">Загрузка...</div>;
  }

  return (
    <main className="flex flex-col">
      <h2 className="text-4xl font-medium mb-3">Уроки</h2>
      <p className="text-sm text-[#999] mb-6">
        Расписание и история занятий
      </p>

      <Tabs.Root defaultValue="upcoming" className="flex flex-col w-full">
        <Tabs.List className="relative flex bg-[#2A2A2A] mb-6 justify-center md:justify-start items-center rounded-lg py-1 px-2 overflow-hidden max-w-xs md:mx-0">
          <Tabs.Trigger
            value="upcoming"
            className="px-6 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A]"
          >
            Предстоящие
          </Tabs.Trigger>

          <Tabs.Trigger
            value="finished"
            className="px-6 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A]"
          >
            Завершенные
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="upcoming">
          {moduleId && <UpcomingLessons moduleId={moduleId} />}
        </Tabs.Content>

        <Tabs.Content value="finished">
          {moduleId && <FinishedLessons moduleId={moduleId} />}
        </Tabs.Content>
      </Tabs.Root>
    </main>
  );
}
