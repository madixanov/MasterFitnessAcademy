"use client";

import Image from "next/image";
import { Pen, Save, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Toast from "@/components/UI/toast";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import { getProfile, uploadProfilePhoto, patchUser, UpdateUserPayload } from "@/services/auth/user.api";

interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "error";
}

export default function ProfileInfo() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateUserPayload>({ name: "", phoneNumber: "" });
  const [updating, setUpdating] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastIdRef = useRef(0);

  // Добавление Toast
  const addToast = (message: string, type: "success" | "error") => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Загрузка профиля
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile(); // 🔹 token берется автоматически через HTTP-only cookie
        setUser(data);
        setEditData({ name: data.name || "", phoneNumber: data.phoneNumber || "" });
      } catch (err) {
        console.error(err);
        addToast("Не удалось загрузить данные профиля", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Превью выбранного файла
  useEffect(() => {
    if (!selectedFile) return;
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast("Файл слишком большой. Максимум 5MB", "error");
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      await uploadProfilePhoto(selectedFile); // 🔹 HTTP-only токен внутри

      const updatedUser = await getProfile();
      setUser(updatedUser);
      setSelectedFile(null);
      setPreview(null);
      addToast("Фото профиля обновлено", "success");
    } catch (err) {
      console.error(err);
      addToast("Ошибка загрузки фото", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ name: user.name || "", phoneNumber: user.phoneNumber || "" });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!user?.id) return addToast("Ошибка: пользователь не найден", "error");

    const payload: UpdateUserPayload = {};
    if (editData.name && editData.name !== user.name) payload.name = editData.name.trim();
    if (editData.phoneNumber && editData.phoneNumber !== user.phoneNumber) payload.phoneNumber = editData.phoneNumber.trim();

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return addToast("Нет изменений для сохранения", "success");
    }

    try {
      setUpdating(true);
      const updatedUser = await patchUser(user.id, payload);
      setUser(updatedUser);
      setIsEditing(false);
      addToast("Данные обновлены", "success");
    } catch (err: any) {
      console.error(err);
      addToast(err.message || "Ошибка обновления данных", "error");
    } finally {
      setUpdating(false);
    }
  };

  const initials = user ? `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase() : "";
  const createdAt = user ? new Date(user.createdAt).toLocaleDateString("ru-RU") : "";

  if (loading) return <ProfileSkeleton />;
  if (!user) return <p>Не авторизован</p>;

  return (
    <section className="relative">
      {/* Toast */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} duration={3000} />
        ))}
      </div>

      <div className="p-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md mb-10">
        <h2 className="mb-10">Информация о профиле</h2>
        <div className="flex flex-col md:flex-row gap-20 items-center md:items-start">
          <div className="flex flex-col justify-center items-stretch w-max">
            <div className="w-50 h-50 rounded-full relative bg-[#FF7A00] flex justify-center items-center mb-7 overflow-hidden">
              {preview ? (
                <Image src={preview} alt="Предпросмотр" fill className="object-cover object-center" sizes="200px" />
              ) : user.img ? (
                <Image src={user.img} alt={`${user.name} ${user.surname}`} fill className="object-cover object-center" sizes="200px" />
              ) : (
                <span className="text-5xl">{initials}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-center bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-2 rounded-md cursor-pointer hover:bg-[#111] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Pen className="w-4 h-4 mr-2"/>
                {uploading ? "Загрузка..." : "Изменить фото"}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
              </label>

              {selectedFile && (
                <button onClick={handleUpload} disabled={uploading} className="flex items-center justify-center bg-[#FF7A00] hover:bg-[#E56A00] px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {uploading ? "Загрузка..." : "Сохранить фото"}
                </button>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <p className="text-[#999] text-sm mb-1">Имя</p>
                {isEditing ? (
                  <input type="text" name="name" value={editData.name} onChange={handleInputChange} className="lg:text-xl bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2 rounded-md w-full max-w-xs focus:outline-none focus:border-[#FF7A00] transition-colors" disabled={updating} />
                ) : <span className="lg:text-xl">{user.name}</span>}

                <p className="text-[#999] text-sm mb-1 mt-5">Почта</p>
                <span className="lg:text-xl">{user.email}</span>
              </div>

              <div>
                <p className="text-[#999] text-sm mb-1">Дата регистрации</p>
                <span className="lg:text-xl mb-5">{createdAt}</span>

                <p className="text-[#999] text-sm mb-1 mt-5">Телефон</p>
                {isEditing ? (
                  <input type="tel" name="phoneNumber" value={editData.phoneNumber} onChange={handleInputChange} className="lg:text-xl bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2 rounded-md w-full max-w-xs focus:outline-none focus:border-[#FF7A00] transition-colors" disabled={updating} />
                ) : (
                  <span className="lg:text-xl mb-5">{user.phoneNumber}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-10">
              {isEditing ? (
                <>
                  <button onClick={handleSaveChanges} disabled={updating} className="flex items-center justify-center bg-[#FF7A00] hover:bg-[#E56A00] px-5 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save className="w-4 h-4 mr-2"/> {updating ? "Сохранение..." : "Сохранить изменения"}
                  </button>
                  <button onClick={handleCancelEdit} disabled={updating} className="flex items-center justify-center bg-[#0A0A0A] border border-[#2A2A2A] hover:bg-[#111] px-5 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <X className="w-4 h-4 mr-2"/> Отмена
                  </button>
                </>
              ) : (
                <button onClick={handleEditClick} className="flex items-center justify-center bg-[#FF7A00] hover:bg-[#E56A00] px-5 py-2 rounded-md transition-colors">
                  <Pen className="w-4 h-4 mr-2"/> Редактировать данные
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
