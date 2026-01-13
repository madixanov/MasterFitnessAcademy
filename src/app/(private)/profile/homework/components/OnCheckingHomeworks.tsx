"use client";

import { useState } from "react";
import { Clock, Download, CircleAlert, FileText, Upload, X } from "lucide-react";
import { HomeworkSubmission, HomeworkSubmissionPayload, submitHomework } from "@/services/homework/homework.api";
import { uploadFiles } from "@/services/upload/upload.api";
import Toast from "@/components/UI/toast";

interface OnCheckingHomeworksProps {
  homeworks: (HomeworkSubmission & { homework: any })[];
  onSubmitSuccess?: () => void;
}

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error";
}

export default function OnCheckingHomeworks({ homeworks, onSubmitSuccess }: OnCheckingHomeworksProps) {
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

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

  const handleResubmit = async (homeworkId: string) => {
    if (!text && files.length === 0) {
      addToast("Нужно добавить текст или файлы перед отправкой.", "error");
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

  // Фильтр домашек по поисковому запросу
  const filteredHomeworks = homeworks.filter(hw =>
    hw.homework.title.toLowerCase().includes(query.toLowerCase())
  );

  if (!homeworks.length) {
    return <p className="text-[#999] text-center mt-10">Домашки на проверке отсутствуют.</p>;
  }

  return (
    <div className="relative">
      {/* Список тостов */}
      <div className="fixed top-5 right-5 flex flex-col gap-3 z-50">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      {/* Поле поиска */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Поиск домашки..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#2A2A2A] text-white placeholder:text-[#777]"
        />
      </div>

      {/* Сами домашки */}
      <div className="flex flex-col gap-7">
        {filteredHomeworks.length === 0 && (
          <p className="text-[#999] text-center">Ничего не найдено по запросу "{query}".</p>
        )}

        {filteredHomeworks.map((hw) => (
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

              <div className="flex gap-2">
                <button
                  className="flex items-center bg-[#FF7A00] px-4 py-1 text-sm rounded-sm"
                  onClick={() => setOpenModalId(hw.id)}
                >
                  <Upload className="w-4 h-4 mr-2" /> Отправить ещё раз
                </button>
              </div>
            </div>

            {/* Модалка повторной отправки */}
            {openModalId === hw.id && (
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

                  {/* Список выбранных файлов с кнопкой удаления */}
                  {files.length > 0 && (
                    <div className="mb-3 flex flex-col gap-2">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-[#2A2A2A] px-3 py-1 rounded-md text-sm text-white"
                        >
                          <span>{file.name}</span>
                          <button
                            className="text-red-500 hover:text-red-400"
                            onClick={() =>
                              setFiles((prev) => prev.filter((_, i) => i !== idx))
                            }
                          >
                            Удалить
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="mb-3 text-sm text-white"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      className="bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-1 rounded-sm text-sm"
                      onClick={() => setOpenModalId(null)}
                    >
                      Отмена
                    </button>
                    <button
                      className="bg-[#FF7A00] px-4 py-1 rounded-sm text-sm"
                      onClick={() => handleResubmit(hw.homework.id)}
                      disabled={loading}
                    >
                      {loading ? "Отправка..." : "Отправить"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
