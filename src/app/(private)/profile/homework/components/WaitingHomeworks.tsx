"use client";

import { useState, useMemo } from "react";
import { Clock, Upload, FileText, X, Trash2 } from "lucide-react";
import { Homework } from "@/services/homework/homework.api";
import { HomeworkSubmissionPayload, submitHomework } from "@/services/homework/homework.api";
import { uploadFiles } from "@/services/upload/upload.api";
import Toast from "@/components/UI/toast";
import { useRouter } from "next/navigation";

interface WaitingHomeworksProps {
  homeworks: Homework[];
  onSubmitSuccess?: () => void; // коллбек после успешной отправки
}

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error";
}

export default function WaitingHomeworks({ homeworks, onSubmitSuccess }: WaitingHomeworksProps) {
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: "success" | "error") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
    }
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (homeworkId: string) => {
    if (!text && files.length === 0) {
      addToast("Добавьте текст или файлы перед отправкой.", "error");
      return;
    }

    setLoading(true);
    try {
      const uploadedFiles = await uploadFiles(files);

      const payload: HomeworkSubmissionPayload = {
        homeworkId,
        text,
        files: uploadedFiles,
      };

      await submitHomework(payload);
      router.refresh();

      setOpenModalId(null);
      setText("");
      setFiles([]);
      addToast("Домашка успешно отправлена!", "success");
      onSubmitSuccess?.();
    } catch (err) {
      console.error(err);
      addToast("Ошибка при отправке домашки.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Фильтр домашних заданий по поиску
  const filteredHomeworks = useMemo(() => {
    if (!search) return homeworks;
    return homeworks.filter((hw) =>
      hw.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [homeworks, search]);

  return (
    <div className="relative">
      {/* Список тостов */}
      <div className="fixed top-5 right-5 flex flex-col gap-3 z-50">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      {/* Поиск */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Поиск по домашкам..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#2A2A2A] text-white placeholder:text-[#999]"
        />
      </div>

      {/* Сами домашки */}
      <div className="flex flex-col gap-7">
        {filteredHomeworks.map((homework) => {
          const isPastDeadline = new Date(homework.deadline).getTime() < Date.now();

          return (
            <div key={homework.id} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg flex flex-col">
              {/* Заголовок и дедлайн */}
              <div className="flex items-stretch gap-5 mb-3 flex-wrap">
                <span className="px-2 text-sm lg:text-md lg:px-5 bg-[#FF7A00] rounded-lg flex justify-center items-center">
                  {homework.title || "Домашнее задание"}
                </span>
                <span className="text-sm lg:text-md inline-flex items-center gap-1 lg:gap-3 text-[#FDC700] bg-[#F0B100]/20 px-2 lg:px-3 py-1 rounded-lg font-medium border border-[#F0B100]/30">
                  <Clock className="w-4 h-4" /> До{" "}
                  {new Date(homework.deadline).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>

              <article className="flex flex-col gap-3 mb-5">
                <h2 className="text-2xl">{homework.title}</h2>
                <p className="text-[#999]">{homework.description}</p>
              </article>

              {homework.files?.length > 0 && (
                <div className="flex flex-col gap-1 mb-5">
                  {homework.files.map((file, idx) => (
                    <a
                      key={idx}
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FDC700] text-sm hover:underline"
                    >
                      {file.split("/").pop()}
                    </a>
                  ))}
                </div>
              )}

              {/* Кнопки */}
              <div className="flex gap-5 items-stretch mt-5">
                <button
                  className={`flex items-center px-4 py-1 text-sm rounded-sm ${
                    isPastDeadline
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-[#FF7A00]"
                  }`}
                  onClick={() => !isPastDeadline && setOpenModalId(homework.id)}
                  disabled={isPastDeadline}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isPastDeadline ? "Дедлайн прошёл" : "Загрузить решение"}
                </button>
              </div>

              {/* Модалка */}
              {openModalId === homework.id && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                  <div className="bg-[#1A1A1A] p-6 rounded-lg w-full max-w-lg relative">
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-white"
                      onClick={() => setOpenModalId(null)}
                    >
                      <X />
                    </button>
                    <h3 className="text-xl mb-4">Отправка домашки</h3>
                    <textarea
                      className="w-full p-3 mb-3 bg-[#2A2A2A] text-white rounded-lg"
                      rows={4}
                      placeholder="Ваше решение"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="mb-3 text-sm text-white"
                    />

                    {/* Список файлов с кнопкой удалить */}
                    {files.length > 0 && (
                      <div className="mb-3 flex flex-col gap-2">
                        {files.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-[#2A2A2A] px-3 py-1 rounded"
                          >
                            <span className="text-sm text-white truncate">{file.name}</span>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleFileRemove(idx)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end gap-3">
                      <button
                        className="bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-1 rounded-sm text-sm"
                        onClick={() => setOpenModalId(null)}
                      >
                        Отмена
                      </button>
                      <button
                        className="bg-[#FF7A00] px-4 py-1 rounded-sm text-sm"
                        onClick={() => handleSubmit(homework.id)}
                        disabled={loading}
                      >
                        {loading ? "Отправка..." : "Отправить"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
