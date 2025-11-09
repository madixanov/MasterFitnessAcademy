import HomeworkList from "./components/HomeworkList";
import LatestLesson from "./components/LatestLessons";
import LessonseList from "./components/LessonsList";
import PaymentsList from "./components/PaymentsList";

export default function Profile() {
  return (
    <main className="flex flex-col">
      <div className="flex flex-col mb-10">
        <h1 className="text-4xl font-medium pl-15 lg:pl-0 mb-3">Главная</h1>
        <p className="text-sm text-[#999] lg:text-lg">Добро пожаловать в Личный Кабинет</p>
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