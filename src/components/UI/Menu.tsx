"use client"

import { useState } from "react"

export default function Menu() {

  const [ openMenu, setOpenMenu ] = useState(false);

  return (
    <div>
      {/* Бургер */}
      <div
        className="flex flex-col justify-between items-center h-4 cursor-pointer group lg:hidden"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <div className="w-6 h-px bg-white transition-all duration-300 group-hover:bg-[#FF6600]"></div>
        <div className="w-6 h-px bg-white transition-all duration-300 group-hover:bg-[#FF6600]"></div>
        <div className="w-6 h-px bg-white transition-all duration-300 group-hover:bg-[#FF6600]"></div>
      </div>

      {/* Меню */}
      {openMenu && (
        <div className="absolute right-5 top-15 mt-4 bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden p-4 rounded-xl lg:hidden z-100">
          <nav>
            <ul className="flex flex-col items-center gap-4 mb-4">
              <li className="text-white text-lg cursor-pointer transition-all duration-300 hover:text-[#FF6600]">Главная</li>
              <li className="text-white text-lg cursor-pointer transition-all duration-300 hover:text-[#FF6600]">О нас</li>
              <li className="text-white text-lg cursor-pointer transition-all duration-300 hover:text-[#FF6600]">Курсы</li>
              <li className="text-white text-lg cursor-pointer transition-all duration-300 hover:text-[#FF6600]">Чемпионы</li>
              <li className="text-white text-lg cursor-pointer transition-all duration-300 hover:text-[#FF6600]">Контакты</li>
            </ul>
            <div className="relative flex flex-col gap-1 items-center justify-center cursor-pointer group">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-white transition-all duration-300 group-hover:border-[#FF6600]"></div>
              <div className="w-[25px] h-2.5 border-2 border-white rounded-b-md rounded-t-xl transition-all duration-300 group-hover:border-[#FF6600]"></div>
              <span className="text-white text-lg cursor-pointer transition-all duration-300 group-hover:text-[#FF6600]">Профиль</span>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}