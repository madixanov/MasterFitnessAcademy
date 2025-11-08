import HomeworkList from "./components/HomeworkList";
import LatestLesson from "./components/LatestLessons";
import LessonseList from "./components/LessonsList";
import PaymentsList from "./components/PaymentsList";

export default function Profile() {
  return (
    <main className="flex flex-col">
      <div className="flex flex-col mb-10">
        <h1 className="text-4xl font-medium">Главная</h1>
        <p className="text-[#999999] text-xl mt-2">Добро пожаловать в Личный Кабинет</p>
      </div>

      <LatestLesson />
      <LessonseList />

      <div className="flex flex-col lg:flex-row gap-10">
        <HomeworkList />
        <PaymentsList />
      </div>
    </main>
  )
}