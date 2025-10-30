"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MainContainer from "./MainContainer";
import Menu from "./UI/Menu";
import Link from "next/link";

export default function Header() {
  const [state, setState] = useState({
    isScrolled: false,
    isVisible: true,
    hideTitle: false,
    isHovered: false,
    isMobile: false,
    lastScrollY: 0,
  });

  // --- Определяем мобильный экран ---
  useEffect(() => {
    const handleResize = () =>
      setState((prev) => ({ ...prev, isMobile: window.innerWidth < 1024 }));

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Скрытие хедера при скролле ---
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          setState((prev) => ({
            ...prev,
            isScrolled: currentScroll > 20,
            isVisible:
              !(currentScroll > prev.lastScrollY && currentScroll > 100),
            lastScrollY: currentScroll,
          }));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Таймер скрытия названия через 3 секунды ---
  useEffect(() => {
    const timer = setTimeout(
      () => setState((prev) => ({ ...prev, hideTitle: true })),
      3000
    );
    return () => clearTimeout(timer);
  }, []);

  // --- Показываем название всегда на мобильных ---
  const shouldShowTitle =
    state.isMobile || !state.hideTitle || state.isHovered;

  // --- Handlers ---
  const handleMouseEnter = () =>
    setState((prev) => ({ ...prev, isHovered: true }));
  const handleMouseLeave = () =>
    setState((prev) => ({ ...prev, isHovered: false }));

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-99 transition-all duration-300 transform-gpu
        ${
          state.isScrolled
            ? "backdrop-blur-sm bg-black/25 border border-white/10 shadow-[inset_0_3px_6px_rgba(255,255,255,0.1),_inset_0_-4px_12px_rgba(0,0,0,0.4),_0_8px_20px_rgba(0,0,0,0.3)]"
            : "bg-transparent border-transparent"
        }
        ${state.isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      `}
    >
      <MainContainer>
        <div className="flex justify-between items-center py-4 transition-all duration-700">
          {/* LOGO + TITLE */}
          <Link href="/" className="flex gap-3 items-center cursor-pointer transition-all duration-700"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-[70px] h-[70px]">
              <Image src="/logo.svg" alt="logo" fill className="object-contain" />
            </div>

            <span
              className={`
                font-semibold text-xl text-white md:text-xl lg:text-2xl xl:text-4xl
                transition-all duration-700
                ${shouldShowTitle ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}
              `}
            >
              Master <span className="text-[#FF6600]">Fitness</span> Academy
            </span>
          </Link>

          {/* NAVIGATION */}
          <nav
            className={`
              hidden lg:flex transition-all duration-700
              ${!shouldShowTitle
                ? "absolute left-1/3"
                : "absolute lg:left-35 xl:left-75 translate-x-1/2"}
            `}
          >
            <ul className="flex gap-4">
              <Link href="/"><li className="text-white text-2xl cursor-pointer transition-all duration-300 hover:text-[#FF6600]">Главная</li></Link>
              <Link href="/catalog"><li className="text-white text-2xl cursor-pointer transition-all duration-300 hover:text-[#FF6600]">Курсы</li></Link>
              <li className="text-white text-2xl cursor-pointer transition-all duration-300 hover:text-[#FF6600]">О нас</li>
              <li className="text-white text-2xl cursor-pointer transition-all duration-300 hover:text-[#FF6600]">Чемпионы</li>
              <li className="text-white text-2xl cursor-pointer transition-all duration-300 hover:text-[#FF6600]">Контакты</li>
            </ul>
          </nav>

          {/* MENU BURGER */}
          <Menu />

          {/* PROFILE ICON */}
          <div className="relative hidden w-10 h-10 cursor-pointer lg:flex flex-col gap-1 items-center justify-center group">
            <div className="w-[15px] h-[15px] rounded-full border-2 border-white transition-all duration-300 group-hover:border-[#FF6600]" />
            <div className="w-[35px] h-[15px] border-2 border-white rounded-b-md rounded-t-xl transition-all duration-300 group-hover:border-[#FF6600]" />
          </div>
        </div>
      </MainContainer>
    </header>
  );
}
