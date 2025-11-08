import { CircleAlert, Video, Calendar, Clock } from "lucide-react";

const lessons = [
  {subject: "Математика", task: "Квадратные уравнения", teacher: "Смирнова А.В.", date: "10.11.2025", time: "14:00", duration: "60 мин", status: "Ожидается"},
  {subject: "Физика", task: "Электромагнитные волны", teacher: "Иванов П.С.", date: "12.11.2025", time: "15:30", duration: "60 мин", status: "Ожидается"},
  {subject: "Английский язык", task: "Present Perfect Continuous", teacher: "Петрова М.И.", date: "13.11.2025", time: "16:00", duration: "45 мин", status: "Ожидается"},
]

export default function UpcomingLessons() {
  return (
    <div className="flex flex-col gap-5 w-full">
      {lessons.map((lesson, index) => (
        <div key={index} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="px-2 text-sm lg:text-md lg:px-5 bg-[#FF7A00] rounded-lg">{lesson.subject}</span>
              <span className="text-sm lg:text-md inline-flex items-center gap-1 lg:gap-3 text-[#FDC700] bg-[#F0B100]/20 px-2 lg:px-4 py-1 rounded-lg font-medium border border-[#F0B100]/30">
                <CircleAlert className="w-4 h-4" /> {lesson.status}
              </span>
            </div>
            <button className="flex gap-1 lg:gap-3 px-2 py-1 lg:px-3 lg:py-2 cursor-pointer text-sm lg:text-md bg-[#FF7A00] rounded-sm items-center transition hover:bg-[#FF7A00]/80"><Video className="w-4 h-4" /> Перейти</button>
          </div>

          <article>
            <h2 className="text-xl mb-3">{lesson.task}</h2>
            <span className="text-[#999] mb-2">Преподователь: {lesson.teacher}</span>
            <div className="flex gap-3">
              <span className="flex items-center text-[#999] gap-2"><Calendar className="w-4 h-4"/> {lesson.date}</span>
              <span className="flex items-center text-[#999] gap-2"><Clock className="w-4 h-4"/> {lesson.time}</span>
              <span className="flex items-center text-[#999] gap-2"><Clock className="w-4 h-4"/> {lesson.duration}</span>
            </div>
          </article>
        </div>
      ))}
    </div>
  )
}