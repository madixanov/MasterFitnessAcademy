import { CircleCheckBig, Video, Calendar, Clock } from "lucide-react";

const lessons = [
  {subject: "Математика", task: "Линейные", teacher: "Смирнова А.В.", date: "10.11.2025", time: "14:00", duration: "60 мин", status: "Завершено", grade: '5'},
  {subject: "Физика", task: "Законы Ньютона", teacher: "Иванов П.С.", date: "12.11.2025", time: "15:30", duration: "60 мин", status: "Завершено", grade: '5'},
  {subject: "Английский язык", task: "Past Simple", teacher: "Петрова М.И.", date: "13.11.2025", time: "16:00", duration: "45 мин", status: "Завершено", grade: '4'},
]

export default function FinishedLessons() {
  return (
    <div className="flex flex-col gap-5 w-full">
      {lessons.map((lesson, index) => (
        <div key={index} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-5">
              <span className="px-5 bg-[#FF7A00] rounded-lg">{lesson.subject}</span>
              <span className="inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#00C950]/30">
                <CircleCheckBig className="w-4 h-4" /> {lesson.status}
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-2xl text-[#FF7A00]">{lesson.grade}</span>
              <button className="flex gap-3 px-3 py-2 cursor-pointer text-sm bg-[#0A0A0A] rounded-sm items-center transition hover:bg-[#0A0A0A]/80 border border-[#2A2A2A]">Материалы</button>
            </div>
          </div>

          <article className="flex flex-col w-full">
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