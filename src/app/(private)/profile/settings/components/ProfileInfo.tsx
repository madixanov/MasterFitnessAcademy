"use client"

import Image from "next/image"
import { Pen } from "lucide-react"
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { getProfile } from "@/services/auth/user.api";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import { uploadProfilePhoto } from "@/services/auth/user.api";

export default function ProfileInfo() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) throw new Error("Нет токена");
      
        const data = await getProfile(token);
        setUser(data);
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    try {
      setUploading(true);
      const token = Cookies.get("token");
      if (!token) throw new Error("Нет токена");
      const data = await uploadProfilePhoto(file, token);
      setUser((prev: any) => ({ ...prev, photo: data.img || data.url }));
    } catch (err) {
      console.error("Ошибка при загрузке фото", err);
    } finally {
      setUploading(false);
    }
  }

  const triggerFileSelect = () => {
    inputFileRef.current?.click();
  }

  const initials = user
    ? `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase()
    : "";

  const createdAt = user
    ? new Date(user.createdAt).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  if (loading) return <ProfileSkeleton />
  if (!user) return <p>Не авторизован</p>

  return (
    <section>
      <div className="p-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md mb-10">
        <h2 className="mb-10">Информация о профиле</h2>
        <div className="flex gap-20 items-center md:items-start flex-col md:flex-row">
          <div className="flex flex-col justify-center items-stretch w-max">
            <div className="w-50 h-50 rounded-full relative bg-[#FF7A00] flex justify-center items-center mb-7 overflow-hidden">
              {user.photo ? (
                <Image src={user.photo} alt={`${user.name} ${user.surname}`} fill className="object-cover object-center" />
              ) : (
                <span className="text-5xl">{initials}</span>
              )}
            </div>
            <button
              onClick={triggerFileSelect}
              disabled={uploading}
              className="flex items-center bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-1 rounded-md justify-center"
            >
              <Pen className="w-4 h-4 mr-2"/>
              {uploading ? "Загрузка..." : "Изменить фото"}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={inputFileRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <div className="grid grid-cols-2 gap-10">
              <div>
                <p className="text-[#999] text-sm mb-1">Имя</p>
                <span className="lg:text-xl">{user.name}</span>

                <p className="text-[#999] text-sm mb-1 mt-5">Почта</p>
                <span className="lg:text-xl">{user.email}</span>
              </div>
              <div>
                <p className="text-[#999] text-sm mb-1">Дата регистрации</p>
                <span className="lg:text-xl mb-5">{createdAt}</span>

                <p className="text-[#999] text-sm mb-1 mt-5">Телефон</p>
                <span className="lg:text-xl mb-5">{user.phoneNumber}</span>
              </div>
            </div>
            <button className="w-full md:w-max flex justify-center mt-10 items-center text-lg bg-[#FF7A00] px-5 py-1 rounded-md">
              <Pen className="w-4 h-4 mr-2"/> Редактировать данные
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
