import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import UpcomingLessons from "./components/UpcomingLessons";
import FinishedLessons from "./components/FinishedLessons";

export default function Lessons() {
  return (
    <main className="flex flex-col">
      <h2 className="text-4xl font-medium pl-15 lg:pl-0 mb-3">Уроки</h2>
      <p className="text-sm text-[#999] lg:text-md">Расписание и история занятий</p>

      <Tabs defaultValue="upcoming" className="mt-6 flex flex-col w-full">
        <TabsList className="relative flex bg-[#2A2A2A] mb-6 justify-center md:justify-start items-center rounded-lg py-1 px-2 overflow-hidden w-full max-w-md mx-auto md:mx-0">
          <TabsTrigger
            value="upcoming"
            className="px-6 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A] data-[state=active]:font-semibold text-sm md:text-base flex-1 md:flex-auto text-center"
          >
            Предстоящие
          </TabsTrigger>
          <TabsTrigger
            value="finished"
            className="px-6 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A] data-[state=active]:font-semibold text-sm md:text-base flex-1 md:flex-auto text-center"
          >
            Завершенные
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <UpcomingLessons />
        </TabsContent>

        <TabsContent value="finished">
          <FinishedLessons />
        </TabsContent>
      </Tabs>
    </main>
  )
}