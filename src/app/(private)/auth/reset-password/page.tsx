import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Mail, Smartphone } from "lucide-react";
import EmailResetForm from "./components/EmailResetForm";
import NumberResetForm from "./components/NumberResetForm";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-[calc(100vh-200px)] p-6">
      <section className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col justify-center items-center">
        <article className="flex flex-col justify-center items-center pb-5">
          <h2 className="font-medium text-2xl">Восстановление пароля</h2>
          <p className="text-[#999] pt-2.5">Выберите способ восстановления пароля</p>
        </article>
        <Tabs defaultValue="email" className="mt-6 flex flex-col w-full">
            <TabsList className="relative flex bg-[#2A2A2A] mb-6 justify-center md:justify-start items-center rounded-lg py-1 px-2 overflow-hidden w-full max-w-md mx-auto md:mx-0">
              <TabsTrigger
                value="email"
                className="flex justify-center items-center px-6 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A] data-[state=active]:font-semibold text-sm md:text-base flex-1 md:flex-auto text-center"
              >
               <Mail className="w-5 h-5 mr-4" /> Email
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className="flex justify-center items-center px-6 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A] data-[state=active]:font-semibold text-sm md:text-base flex-1 md:flex-auto text-center"
              >
                <Smartphone className="w-5 h-5 mr-4" /> Телефон
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <EmailResetForm />
            </TabsContent>

            <TabsContent value="phone">
              <NumberResetForm />
            </TabsContent>
          </Tabs>
      </section>
    </main>
  )
}