import { Clock, Download, CircleAlert, FileText } from "lucide-react"

const  homeworks = [
  {
    subject: "Физика", 
    task: "Лабораторная работа №3", 
    theme: "Законы Ньютона", 
    secondaryTask: "Экспериментальная проверка второго закона Ньютона.", 
    sentAt: "08.11.2025",
    points: 20
  },
]

export default function OnCheckingHomeworks() {
  return (
    <div className="flex flex-col gap-7">
      {homeworks.map((homework, index) => (
        <div key={index} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col">
          <div className="flex justify-between">
            <div>
              <div className="flex items-stretch gap-5 mb-3">
                <span className="px-2 text-sm lg:text-md lg:px-5 bg-[#FF7A00] rounded-lg flex justify-center items-center">{homework.subject}</span>
                <span className="inline-flex items-center gap-2 text-[#51A2FF] bg-[#2B7FFF]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#2B7FFF]/30">
                  <CircleAlert className="w-4 h-4" /> На проверке
                </span>
              </div>
              <article className="flex flex-col gap-3 mb-10">
                <h2 className="text-2xl">{homework.task}</h2>
                <p className="text-[#999]">{homework.theme}</p>
              </article>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[#FF7A00] text-4xl">{homework.points}</span>
              <span className="text-[#999]">баллов</span>
            </div>
          </div>
          <p className="text-[#999] text-lg mb-7">{homework.secondaryTask}</p>
          <div className="flex gap-5 items-center justify-between bg-[#2A2A2A] p-5 rounded-md">
            <span className="flex items-center"><FileText className="w-4 h-4 mr-2 text-[#999]"/> Работа отправлена {homework.sentAt}</span>
            <button className="flex items-center bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-1 text-sm rounded-sm"><Download className="w-4 h-4 mr-2"/> Скачать</button>
          </div>
        </div>
      ))}
    </div>
  )
}