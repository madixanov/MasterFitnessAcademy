import { Clock, Download, CircleAlert, FileText } from "lucide-react";
import { HomeworkSubmission } from "@/services/homework/homework.api";

interface OnCheckingHomeworksProps {
  homeworks: (HomeworkSubmission & { homework: any })[];
}

export default function OnCheckingHomeworks({ homeworks }: OnCheckingHomeworksProps) {
  if (!homeworks.length) {
    return <p className="text-[#999] text-center mt-10">Домашки на проверке отсутствуют.</p>;
  }

  return (
    <div className="flex flex-col gap-7">
      {homeworks.map((hw) => (
        <div key={hw.id} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col">
          <div className="flex justify-between">
            <div className="flex-1">
              <div className="flex items-stretch gap-5 mb-3 flex-wrap">
                <span className="px-2 text-sm lg:text-md lg:px-5 bg-[#FF7A00] rounded-lg flex justify-center items-center">
                  {hw.homework.title || "Домашнее задание"}
                </span>
                <span className="inline-flex items-center gap-2 text-[#51A2FF] bg-[#2B7FFF]/20 px-4 py-1 rounded-xl text-xs font-medium border border-[#2B7FFF]/30">
                  <CircleAlert className="w-4 h-4" /> На проверке
                </span>
              </div>

              <article className="flex flex-col gap-3 mb-5">
                <h2 className="text-2xl">{hw.homework.title}</h2>
                <p className="text-[#999]">{hw.homework.description}</p>
              </article>

              {hw.files?.length > 0 && (
                <div className="flex flex-col gap-1 mb-5">
                  {hw.files.map((file, idx) => (
                    <a
                      key={idx}
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#51A2FF] text-sm hover:underline flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" /> {file.split("/").pop()}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-[#999] text-lg mb-5">{hw.homework.secondaryTask || ""}</p>

          <div className="flex gap-5 items-center justify-between bg-[#2A2A2A] p-5 rounded-md">
            <span className="flex items-center text-[#999] text-sm">
              <FileText className="w-4 h-4 mr-2" /> Работа отправлена{" "}
              {new Date(hw.createdAt).toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
            {hw.files?.length > 0 && (
              <button className="flex items-center bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-1 text-sm rounded-sm">
                <Download className="w-4 h-4 mr-2" /> Скачать
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
