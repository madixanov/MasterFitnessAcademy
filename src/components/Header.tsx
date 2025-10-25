"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import MainContainer from "./MainContainer";
import Menu from "./UI/Menu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      // Эффект при скролле > 20px
      setIsScrolled(currentScroll > 20);

      // Проверяем направление скролла
      if (currentScroll > lastScrollY && currentScroll > 100) {
        // Скролл вниз → скрываем
        setIsVisible(false);
      } else {
        // Скролл вверх → показываем
        setIsVisible(true);
      }

      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-[99]
        transition-all duration-500
        ${isScrolled
          ? "backdrop-blur-md bg-white/10 border-b border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.1)]"
          : "bg-white/0 border-white/0"
        }
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      `}
    >
      <MainContainer>
        <div className="flex justify-between items-center py-4">
          {/* LOGO */}
          <div className="flex gap-3 justify-center items-center cursor-pointer">
            <div className="relative w-[70px] h-[70px]">
              <Image src="/logo.svg" alt="logo" fill className="object-contain" />
            </div>
            <span className="font-semibold text-xl text-white md:text-xl lg:text-2xl xl:text-4xl">
              Master <span className="text-[#FF6600]">Fitness</span> Academy
            </span>
          </div>

          {/* NAV LINKS */}
          <nav className="hidden lg:flex">
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

          {/* PROFILE LINK */}
          <div className="relative hidden w-10 h-10 cursor-pointer lg:flex flex-col gap-1 items-center justify-center group">
            <div className="w-[15px] h-[15px] rounded-full border-2 border-white transition-all duration-300 group-hover:border-[#FF6600]" />
            <div className="w-[35px] h-[15px] border-2 border-white rounded-b-md rounded-t-xl transition-all duration-300 group-hover:border-[#FF6600]" />
          </div>

          {/* MENU BURGER */}
          <Menu />
        </div>
      </MainContainer>
    </header>
  );
}
