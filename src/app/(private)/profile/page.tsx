import LatestLesson from "./components/LatestLessons";

export default function Profile() {
  return (
    <main className="flex flex-col">
      <div className="flex flex-col mb-10">
        <h1 className="text-4xl font-medium">Главная</h1>
        <p className="text-[#999999] text-xl mt-2">Добро пожаловать в Личный Кабинет</p>
      </div>

      <LatestLesson />
    </main>
  )
}