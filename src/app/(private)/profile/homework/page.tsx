import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import WaitingHomeworks from "./components/WaitingHomeworks";
import OnCheckingHomeworks from "./components/OnCheckingHomeworks";
import CheckedHomeworks from "./components/CheckedHomeworks";

export default function Lessons() {
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
          <WaitingHomeworks />
        </TabsContent>

        <TabsContent value="checking">
          <OnCheckingHomeworks />
        </TabsContent>
        <TabsContent value="checked">
          <CheckedHomeworks />
        </TabsContent>
      </Tabs>
    </main>
  )
}