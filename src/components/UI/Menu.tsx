"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Menu() {
  const [openMenu, setOpenMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (openMenu) setOpenMenu(false)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [openMenu])

  return (
    <div className="relative z-200">
      {/* Бургер */}
      <div
        className="flex flex-col justify-between items-center h-4 cursor-pointer group lg:hidden"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <div className="w-6 h-px bg-white transition-all duration-300 group-hover:bg-[#FF6600]" />
        <div className="w-6 h-px bg-white transition-all duration-300 group-hover:bg-[#FF6600]" />
        <div className="w-6 h-px bg-white transition-all duration-300 group-hover:bg-[#FF6600]" />
      </div>

      {/* Меню */}
      {openMenu && (
        <div
          className="
            absolute right-0 top-20
            bg-white/10 backdrop-blur-xl border border-white/20
            p-6 rounded-2xl
            shadow-[0_0_25px_rgba(255,255,255,0.1)]
            lg:hidden animate-fadeIn
            z-300
            will-change-[backdrop-filter] transform-gpu
          "
        >
          <nav>
            <ul className="flex flex-col gap-4 mb-4">
              <li>
                <Link
                  href="/"
                  aria-label="Главная страница"
                  className="text-white text-xl cursor-pointer transition-all duration-300 hover:text-[#FF6600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]/70 rounded-md"
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  aria-label="Курсы"
                  className="text-white text-xl cursor-pointer transition-all duration-300 hover:text-[#FF6600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]/70 rounded-md"
                >
                  Курсы
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  aria-label="О нас"
                  className="text-white text-xl cursor-pointer transition-all duration-300 hover:text-[#FF6600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]/70 rounded-md"
                >
                  О нас
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  aria-label="Чемпионы"
                  className="text-white text-xl cursor-pointer transition-all duration-300 hover:text-[#FF6600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]/70 rounded-md"
                >
                  Чемпионы
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  aria-label="Контакты"
                  className="text-white text-xl cursor-pointer transition-all duration-300 hover:text-[#FF6600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]/70 rounded-md"
                >
                  Контакты
                </Link>
              </li>
            </ul>

            <div className="relative flex flex-col gap-1 items-center justify-center cursor-pointer group">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-white transition-all duration-300 group-hover:border-[#FF6600]" />
              <div className="w-[25px] h-2.5 border-2 border-white rounded-b-md rounded-t-xl transition-all duration-300 group-hover:border-[#FF6600]" />
              <span className="text-white text-lg transition-all duration-300 group-hover:text-[#FF6600]">
                Профиль
              </span>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
