import { Calendar, Clock } from "lucide-react";

export default function LatestLesson() {
  return (
    <div aria-label="Ближайший урок" className="mb-10 bg-[linear-gradient(180deg,#FF7A0033_20%,#FF7A000D_80%)] border border-[#834002] rounded-lg p-5">
      <article className="flex flex-col">
        <div className="flex mb-6 items-center">
          <Calendar className="w-5 h-5 text-[#FF7A00] mr-2"/>
          <span className="text-lg">Ближайший урок</span>
        </div>
        <div className="flex flex-col">
          <p className="m-0 mb-4 text-2xl">Математика: Квадратные уравнения</p>
          <div className="flex gap-10 mb-6">
            <div className="flex text-[#999] items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="text-lg">10 ноября 2025</span>
            </div>
            <div className="flex text-[#999] items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span className="text-lg">14:00</span>
            </div>
          </div>
        </div>
      </article>
      <button aria-label="Перейти к уроку" className="bg-[#FF7A00] px-5 py-1.5 rounded-lg cursor-pointer font-medium text-lg">Перейти к уроку</button>
    </div>
  )
}