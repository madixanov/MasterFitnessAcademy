import { Clock, Upload, FileText } from "lucide-react"

const  homeworks = [
  {
    subject: "Математика", 
    task: "Решить задачи 25-30", 
    theme: "Квадратные уравнения", 
    secondaryTask: "Решить задачи из учебника, показать подробное решение с объяснениями.", 
    deadline: "12.11.2025",
    points: 10
  },
  {
    subject: "Английиский язык", 
    task: 'Написать эссе "My Future Career"', 
    theme: "Writing Skills", 
    secondaryTask: "Эссе объёмом 200-250 слов на тему будущей профессии.", 
    deadline: "15.11.2025",
    points: 15
  },
]

export default function WaitingHomeworks() {
  return (
    <div className="flex flex-col gap-7">
      {homeworks.map((homework, index) => (
        <div key={index} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col">
          <div className="flex justify-between">
            <div>
              <div className="flex items-stretch gap-5 mb-3">
                <span className="px-2 text-sm lg:text-md lg:px-5 bg-[#FF7A00] rounded-lg flex justify-center items-center">{homework.subject}</span>
                <span className="text-sm lg:text-md inline-flex items-center gap-1 lg:gap-3 text-[#FDC700] bg-[#F0B100]/20 px-2 lg:px-3 py-1 rounded-lg font-medium border border-[#F0B100]/30">
                  <Clock className="w-4 h-4" /> До {homework.deadline}
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
          <div className="flex gap-5 items-stretch">
            <button className="flex items-center bg-[#FF7A00] px-4 py-1 text-sm rounded-sm"><Upload className="w-4 h-4 mr-2"/> Загрузить файл</button>
            <button className="flex items-center bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-1 text-sm rounded-sm"><FileText className="w-4 h-4 mr-2"/> Подробнее</button>
          </div>
        </div>
      ))}
    </div>
  )
}