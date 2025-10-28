"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import MainContainer from "./MainContainer";
import Menu from "./UI/Menu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hideTitle, setHideTitle] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // --- Определяем мобильный экран ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize(); // сразу проверка
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Логика для скрытия хедера при скролле ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 20);
      if (currentScroll > lastScrollY && currentScroll > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // --- Таймер скрытия названия через 3 секунды ---
  useEffect(() => {
    const timer = setTimeout(() => setHideTitle(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // --- Наведение на логотип ---
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // --- Показываем название всегда на мобильных ---
  const shouldShowTitle = isMobile || !hideTitle || isHovered;

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-99
        transition-all duration-300 transform-gpu
        ${isScrolled
          ? "backdrop-blur-sm bg-black/25 border border-white/10 shadow-[inset_0_3px_6px_rgba(255,255,255,0.1),_inset_0_-4px_12px_rgba(0,0,0,0.4),_0_8px_20px_rgba(0,0,0,0.3)]"
          : "bg-white/0 border-white/0"
        }
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      `}
    >
      <MainContainer>
        <div className="flex justify-between items-center py-4 transition-all duration-700">
          {/* LOGO + TITLE */}
          <div
            className="flex gap-3 justify-center items-center cursor-pointer transition-all duration-700"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-[70px] h-[70px]">
              <Image src="/logo.svg" alt="logo" fill className="object-contain" />
            </div>

            {/* НАЗВАНИЕ */}
            <span
              className={`
                font-semibold text-xl text-white md:text-xl lg:text-2xl xl:text-4xl
                transition-all duration-700
                ${shouldShowTitle ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}
              `}
            >
              Master <span className="text-[#FF6600]">Fitness</span> Academy
            </span>
          </div>

          {/* NAVIGATION */}
          <nav
            className={`
              hidden lg:flex transition-all duration-700
              ${!shouldShowTitle
                ? "absolute left-1/3 translate-x-0"
                : "absolute lg:left-60 xl:left-75 translate-x-1/2"
              }
            `}
          >
            <ul className="flex justify-center items-center gap-4">
              {["Главная", "О нас", "Курсы", "Чемпионы", "Контакты"].map((item) => (
                <li
                  key={item}
                  className="text-white text-xl cursor-pointer transition-all duration-300 hover:text-[#FF6600] md:text-lg xl:text-2xl"
                >
                  {item}
                </li>
              ))}
            </ul>
          </nav>

          {/* MENU BURGER */}
          <Menu />

          {/* PROFILE LINK */}
          <div className="relative hidden w-10 h-10 cursor-pointer lg:flex flex-col gap-1 items-center justify-center group">
            <div className="w-[15px] h-[15px] rounded-full border-2 border-white transition-all duration-300 group-hover:border-[#FF6600]" />
            <div className="w-[35px] h-[15px] border-2 border-white rounded-b-md rounded-t-xl transition-all duration-300 group-hover:border-[#FF6600]" />
          </div>
        </div>
      </MainContainer>
    </header>
  );
}
