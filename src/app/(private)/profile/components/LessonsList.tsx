import { CircleCheckBig, CircleAlert } from "lucide-react";

const lessons = [
  {
    title: "Математика: Квадратные уравнения",
    date: "10.11.2025",
    status: "Ожидает",
  },
  {
    title: "Физика: Законы Ньютона",
    date: "08.11.2025",
    status: "Завершено",
  },
  {
    title: "Английский язык: Past Simple",
    date: "07.11.2025",
    status: "Завершено",
  },
  {
    title: "Химия: Органические соединения",
    date: "05.11.2025",
    status: "Завершено",
  },
];

export default function LessonseList() {
  return (
    <div aria-label="Расписание Уроков" className="bg-[#1A1A1A] p-5 rounded-lg mb-10">
      <h2 className="text-lg font-semibold mb-3">Расписание уроков</h2>

      {/* Для десктопа */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-300">
              <th className="text-left py-2 font-medium pl-1">Название</th>
              <th className="text-left py-2 font-medium">Дата</th>
              <th className="text-left py-2 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson, index) => (
              <tr
                key={index}
                className="border-b border-gray-800 last:border-0 hover:bg-[#2a2a2a] transition"
              >
                <td className="py-3 pl-1">{lesson.title}</td>
                <td className="py-3 text-gray-400">{lesson.date}</td>
                <td className="py-3">
                  {lesson.status === "Завершено" ? (
                    <span className="inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#00C950]/30">
                      <CircleCheckBig className="w-4 h-4" /> Завершено
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-[#FDC700] bg-[#F0B100]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#F0B100]/30">
                      <CircleAlert className="w-4 h-4" /> Ожидает
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Для телефонов */}
      <div className="flex flex-col gap-3 sm:hidden">
        {lessons.map((lesson, index) => (
          <div
            key={index}
            className="bg-[#222] p-4 rounded-lg border border-gray-800"
          >
            <p className="text-sm text-gray-400 mb-1">Название</p>
            <p className="text-white font-medium mb-2">{lesson.title}</p>

            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{lesson.date}</span>

              {lesson.status === "Завершено" ? (
                <span className="inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-3 py-1 rounded-xl text-xs font-medium border border-[#00C950]/30">
                  <CircleCheckBig className="w-4 h-4" /> Завершено
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-[#FDC700] bg-[#F0B100]/20 px-3 py-1 rounded-xl text-xs font-medium border border-[#F0B100]/30">
                  <CircleAlert className="w-4 h-4" /> Ожидает
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

  )
}