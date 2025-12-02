"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, House, BookOpen, FileText, CreditCard, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const menu = [
  { name: "Главная", href: "/profile", icon: House },
  { name: "Уроки", href: "/profile/lessons", icon: BookOpen },
  { name: "Домашние Задания", href: "/profile/homework", icon: FileText },
  { name: "Платежи", href: "/profile/payments", icon: CreditCard },
  { name: "Профиль", href: "/profile/settings", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    Cookies.remove("token")
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    router.push("/auth")
  }

  return (
    <>
      {/* Кнопка меню (только на мобильных) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 bg-[#1A1A1A] shadow-md p-2 rounded-md border border-gray-400"
      >
        <Menu className="w-6 h-6 text-gray-400" />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Сайдбар */}
      <aside
        className={cn(
          // 🧱 Фиксированная позиция на всех экранах
          "fixed top-0 left-0 bottom-0 z-40 bg-[#1A1A1A] border-r border-[#2A2A2A] p-4 flex flex-col transition-transform duration-300 overflow-y-auto",
          // ширина и адаптация
          "w-64 lg:w-60",
          // поведение при открытии на мобильных
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex justify-center items-center w-full">
            <h2 className="text-2xl font-semibold text-white text-center w-full">
              <span className="text-orange-500 text-center">Master Fitness</span><br />Academy
            </h2>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition text-sm font-medium group",
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/35"
                    : "text-gray-500 hover:bg-[#454444] hover:translate-x-2 hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition group-hover:text-white",
                    isActive ? "text-white" : "text-gray-500"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-gray-200 text-xs text-gray-400 flex group cursor-pointer gap-2" onClick={handleLogout}>
          <LogOut className="w-5 h-5 transition group-hover:text-white" />
          <span className="transition group-hover:text-white text-sm">Выход</span>
        </div>
      </aside>
    </>
  );
}
