"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MainContainer from "./MainContainer";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import MobileMenu from "./UI/MobileMenu";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

export default function Header() {
  const [state, setState] = useState({
    isScrolled: false,
    isVisible: true,
    hideTitle: false,
    isHovered: false,
    isMobile: false,
    lastScrollY: 0,
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const scrollOrRedirect = (id: string) => {
    if (pathname !== "/") {
      router.push(`/?scroll=${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleResize = () =>
      setState((prev) => ({ ...prev, isMobile: window.innerWidth < 1024 }));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    const timer = setTimeout(
      () => setState((prev) => ({ ...prev, hideTitle: true })),
      3000
    );
    return () => clearTimeout(timer);
  }, []);

  const shouldShowTitle =
    state.isMobile || !state.hideTitle || state.isHovered;

  const handleMouseEnter = () =>
    setState((prev) => ({ ...prev, isHovered: true }));
  const handleMouseLeave = () =>
    setState((prev) => ({ ...prev, isHovered: false }));

  const handleProfileClick = () => {
    const token = Cookies.get("accessToken");
    if (token) router.push("/profile");
    else router.push("/auth");
  };

  // Анимации framer-motion для nav
  const navVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform-gpu
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
            <Link
              href="/"
              className="flex gap-3 items-center cursor-pointer transition-all duration-700"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative w-[70px] h-[70px]">
                <Image src="/logo.svg" alt="logo" fill className="object-contain" />
              </div>
              <span
                className={`font-semibold text-xl text-white md:text-xl lg:text-2xl xl:text-4xl transition-all duration-700 ${
                  shouldShowTitle ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
              >
                Master <span className="text-[#FF6600]">Fitness</span> Academy
              </span>
            </Link>

            {/* NAVIGATION для десктопа с fade-up */}
            <motion.nav
              className={`hidden lg:flex transition-all duration-700 ${
                !shouldShowTitle
                  ? "absolute left-1/3"
                  : "absolute lg:left-35 xl:left-75 translate-x-1/2"
              }`}
              variants={navVariants}
              initial="hidden"
              animate="show"
            >
              <ul className="flex gap-4">
                {[
                  { label: "Главная", href: "/" },
                  { label: "Курсы", href: "/courses" },
                  { label: "Дипломы", href: "/diplomas" },
                  { label: "Чемпионы", scrollTo: "gallery" },
                  { label: "Контакты", scrollTo: "contacts" },
                ].map((item) => (
                  <motion.li key={item.label} variants={navItemVariants}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-white text-2xl hover:text-[#FF6600] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => scrollOrRedirect(item.scrollTo!)}
                        className="text-white text-2xl hover:text-[#FF6600] transition-colors"
                      >
                        {item.label}
                      </button>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.nav>

            {/* Бургер */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="lg:hidden flex flex-col justify-between w-8 h-6 relative z-50"
              aria-label="Toggle menu"
            >
              <span
                className={`block h-1 w-full bg-white rounded transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2.5" : ""
                }`}
              />
              <span
                className={`block h-1 w-full bg-white rounded transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-1 w-full bg-white rounded transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2.5" : ""
                }`}
              />
            </button>

            {/* Кнопка профиля */}
            <button
              onClick={handleProfileClick}
              className="relative hidden w-10 h-10 cursor-pointer lg:flex flex-col gap-1 items-center justify-center group"
            >
              <div className="w-[15px] h-[15px] rounded-full border-2 border-white transition-all duration-300 group-hover:border-[#FF6600]" />
              <div className="w-[35px] h-[15px] border-2 border-white rounded-b-md rounded-t-xl transition-all duration-300 group-hover:border-[#FF6600]" />
            </button>
          </div>
        </MainContainer>
      </header>

      {/* Мобильное меню */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
