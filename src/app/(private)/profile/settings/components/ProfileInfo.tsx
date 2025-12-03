"use client"

import Image from "next/image"
import { Pen } from "lucide-react"
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getProfile } from "@/services/auth/user.api";
import ProfileSkeleton from "@/components/ProfileSkeleton";

export default function ProfileInfo() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
            <div className="w-50 h-50 rounded-full relative bg-[#FF7A00] flex justify-center items-center mb-7">
              {user.photo ? (
                <Image src={user.photo} alt={`${user.name} ${user.surname}`} fill className="object-cover rounded-full object-center" />
              ) : (
                <span className="text-5xl">{initials}</span>
              )}
            </div>
            <button className="flex items-center bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-1 rounded-md justify-center"><Pen className="w-4 h-4 mr-2"/> Изменить фото</button>
          </div>
          <div>
            {/*<div className="mb-10">
              <p className="text-[#999] mb-2 text-lg">ID Ученика</p>
              <span className="w-full md:w-max justify-center inline-flex items-center gap-2 text-[#FF7A00] bg-[#FF7A00]/20 px-4 py-2 rounded-md text-lg font-medium border border-[#FF7A00]/30">{user.id}</span>
            </div>*/}
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
            <button className="w-full md:w-max flex justify-center mt-10 items-center text-lg bg-[#FF7A00] px-5 py-1 rounded-md"><Pen className="w-4 h-4 mr-2"/> Редактировать данные</button>
          </div>
        </div>
      </div>

      {/*<div className="flex gap-10 flex-col md:flex-row">
        <div className="p-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md w-full">
          <h2 className="mb-10">Статистика</h2>
          <div className="flex flex-col gap-7">
            <p className="text-[#999] text-lg flex justify-between items-center px-5 py-7 bg-[#2A2A2A] rounded-lg">Завершено уроков <span className="text-[#FF7A00] text-xl">{user.finishedLessons}</span></p>
            <p className="text-[#999] text-lg flex justify-between items-center px-5 py-7 bg-[#2A2A2A] rounded-lg">Сдано заданий <span className="text-[#FF7A00] text-xl">{user.passedTasks}</span></p>
            <p className="text-[#999] text-lg flex justify-between items-center px-5 py-7 bg-[#2A2A2A] rounded-lg">Средний балл <span className="text-[#FF7A00] text-xl">{user.gpa}</span></p>
          </div>
        </div>
        <div className="p-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md w-full">
          <h2 className="mb-10">Активные курсы</h2>
          <div className="flex flex-col gap-5">
            {user.activeCourse.map((course, index) => (
              <div key={index} className="flex flex-col gap-1.5 border-l-4 border-l-[#FF7A00] rounded-lg px-5 py-3 bg-[#2A2A2A]">
                <h3 className="text-lg">{course.subject}</h3>
                <p className="text-[#999]">Прогресс: {course.progress}</p>
              </div>
            ))}
          </div>
        </div>
      </div>*/}
    </section>
  )
}