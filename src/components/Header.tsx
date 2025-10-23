import Image from "next/image"
import MainContainer from "./MainContainer"
import Menu from "./UI/Menu"

export default function Header() {
  return (
      <header className="absolute top-0 right-0 left-0 z-99">
        <MainContainer>
          <div className="flex justify-between items-center">
            {/* LOGO CONTAINER */}
            <div className="flex gap-3 justify-center items-center cursor-pointer">
              <div className="relative w-[70px] h-[70px]">
                <Image src="/logo.svg" alt="logo" fill className="object-contain" />
              </div>
              <span className="font-semibold text-xl text-white md:text-xl lg:text-2xl">
                Master <span className="text-[#FF6600]">Fitness</span> Academy 
              </span>
            </div>  
            {/* NAV LINKS */}
            <nav className="hidden lg:flex">
              <ul className="flex justify-center items-center gap-4">
                <li className="text-white text-xl cursor-pointer transition-all duration-300 hover:text-[#FF6600] md:text-lg xl:text-xl">Главная</li>
                <li className="text-white text-xl cursor-pointer transition-all duration-300 hover:text-[#FF6600] md:text-lg xl:text-xl">О нас</li>
                <li className="text-white text-xl cursor-pointer transition-all duration-300 hover:text-[#FF6600] md:text-lg xl:text-xl">Курсы</li>
                <li className="text-white text-xl cursor-pointer transition-all duration-300 hover:text-[#FF6600] md:text-lg xl:text-xl">Чемпионы</li>
                <li className="text-white text-xl cursor-pointer transition-all duration-300 hover:text-[#FF6600] md:text-lg xl:text-xl">Контакты</li>
              </ul>
            </nav>
            {/* PROFILE LINK */}
            <div className="relative hidden w-10 h-10 cursor-pointer lg:flex flex-col gap-1 items-center justify-center group">
              <div className="w-[15px] h-[15px] rounded-full border-2 border-white transition-all duration-300 group-hover:border-[#FF6600]"></div>
              <div className="w-[35px] h-[15px] border-2 border-white rounded-b-md rounded-t-xl transition-all duration-300 group-hover:border-[#FF6600]  "></div>
            </div>
            
            {/* MENU BURGER */}
            <Menu />
          </div>
        </MainContainer>
      </header>    
  )
}