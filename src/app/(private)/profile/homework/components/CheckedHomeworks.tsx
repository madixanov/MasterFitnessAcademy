import { Download, CircleCheckBig, FileText } from "lucide-react"

const  homeworks = [
  {
    subject: "Математика", 
    task: "Решить задачи 15-20", 
    theme: "Линейные уравнения", 
    secondaryTask: "Решить задачи на линейные уравнения с одной переменной.", 
    comments: "Отличная работа! Все решения верны, оформление аккуратное.",
    checkedAt: "07.11.2025",
    gotPoints: 5,
    totalPoints: 5
  },
  {
    subject: "История", 
    task: "Конспект главы 5", 
    theme: "Первая мировая война", 
    secondaryTask: "Составить конспект главы 5 учебника.", 
    comments: "Хороший конспект, но не хватает некоторых важных дат.",
    checkedAt: "08.11.2025",
    gotPoints: 4,
    totalPoints: 5
  },
  {
    subject: "Химия", 
    task: "Практическое задание", 
    theme: "Органические соединения", 
    secondaryTask: "Написать структурные формулы органических соединений.", 
    comments: "Превосходно! Все формулы правильные.",
    checkedAt: "08.11.2025",
    gotPoints: 5,
    totalPoints: 5
  },
]

export default function CheckedHomeworks() {
  return (
    <div className="flex flex-col gap-7">
      {homeworks.map((homework, index) => (
        <div key={index} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col">
          <div className="flex justify-between">
            <div>
              <div className="flex items-stretch gap-5 mb-3">
                <span className="px-2 text-sm lg:text-md lg:px-5 bg-[#FF7A00] rounded-lg flex justify-center items-center">{homework.subject}</span>
                <span className="inline-flex items-center gap-2 text-[#05DF72] bg-[#00C950]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#00C950]/30">
                  <CircleCheckBig className="w-4 h-4" /> Проверено {homework.checkedAt}
                </span>
              </div>
              <article className="flex flex-col gap-3 mb-10">
                <h2 className="text-2xl">{homework.task}</h2>
                <p className="text-[#999]">{homework.theme}</p>
              </article>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[#FF7A00] text-4xl">{homework.gotPoints}</span>
              <span className="text-[#999]">из {homework.totalPoints}</span>
            </div>
          </div>
          <p className="text-[#999] text-lg mb-7">{homework.secondaryTask}</p>
          <div className="w-full flex flex-col items-start bg-[#2A2A2A] p-5 rounded-md mb-7">
            <span className="mb-3">Комментарий преподователя:</span>
            <span className="flex items-center text-[#999]"><FileText className="w-4 h-4 mr-2"/>{homework.comments}</span>
          </div>
          <button className="w-max flex items-center bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-1 text-sm rounded-sm"><Download className="w-4 h-4 mr-2"/> Скачать работу</button>
        </div>
      ))}
    </div>
  )
}