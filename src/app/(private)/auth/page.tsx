import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

export default function AuthPage() {
  return (
    <main className="min-h-[calc(100vh-200px)] p-6">
      <section className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col justify-center items-center">
        <article className="flex flex-col justify-center items-center pb-5">
          <h2 className="font-medium text-2xl">Добро пожаловать</h2>
          <p className="text-[#999] pt-2.5">Войдите в личный кабинет или создайте новый аккаунт</p>
        </article>
        <Tabs defaultValue="login" className="mt-6 flex flex-col w-full">
            <TabsList className="relative flex bg-[#2A2A2A] mb-6 justify-center md:justify-start items-center rounded-lg py-1 px-2 overflow-hidden w-full max-w-md mx-auto md:mx-0">
              <TabsTrigger
                value="login"
                className="px-6 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A] data-[state=active]:font-semibold text-sm md:text-base flex-1 md:flex-auto text-center"
              >
                Вход
              </TabsTrigger>
              <TabsTrigger
                value="sign-up"
                className="px-6 py-1 text-white rounded-lg data-[state=active]:bg-[#1A1A1A] data-[state=active]:font-semibold text-sm md:text-base flex-1 md:flex-auto text-center"
              >
                Регистрация
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="sign-up">
              <SignupForm />
            </TabsContent>
          </Tabs>
      </section>
    </main>
  )
}