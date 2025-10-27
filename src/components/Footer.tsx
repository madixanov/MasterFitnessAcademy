import Image from "next/image";
import MainContainer from "./MainContainer";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden  backdrop-blur-sm bg-black/25 border border-white/10 shadow-[inset_0_3px_6px_rgba(255,255,255,0.1),_inset_0_-4px_12px_rgba(0,0,0,0.4),_0_8px_20px_rgba(0,0,0,0.3)] py-5">
      <MainContainer>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-0">
          <nav className="flex-1 w-full lg:min-w-[400px]">
            <ul className="flex items-center justify-evenly gap-3">
              <li className=" font-bold text-xl md:text-2xl cursor-pointer transition-all duration-300 hover:text-[#FF6600]">Главная</li>
              <li className=" font-bold text-xl md:text-2xl cursor-pointer transition-all duration-300 hover:text-[#FF6600]">О нас</li>
              <li className=" font-bold text-xl md:text-2xl cursor-pointer transition-all duration-300 hover:text-[#FF6600]">Курсы</li>
              <li className=" font-bold text-xl md:text-2xl cursor-pointer transition-all duration-300 hover:text-[#FF6600]">Чемпионы</li>
            </ul>
          </nav>

          <div className="relative flex-2 flex justify-center items-center flex-col">
            <div className="flex justify-between items-center gap-5">
              <div className="w-[45px] h-[45px] relative cursor-pointer transition-all duration-300 hover:scale-110">
                <Image src="/tg.svg" alt="telegram icon" fill className="object-contain"/>
              </div>
              <div className="w-[45px] h-[45px] relative cursor-pointer transition-all duration-300 hover:scale-110">
                <Image src="/ig.svg" alt="instagram icon" fill className="object-contain"/>
              </div>
              <div className="w-[45px] h-[45px] relative cursor-pointer transition-all duration-300 hover:scale-110">
                <Image src="/fb.svg" alt="facebook icon" fill className="object-contain"/>
              </div>
              <div className="w-[50px] h-[50px] relative cursor-pointer transition-all duration-300 hover:scale-110">
                <Image src="/wp.svg" alt="whatsapp icon" fill className="object-contain"/>
              </div>
            </div>
            <span className="font-semibold text-3xl">+998 (99) 842-21-04</span>

            <div className="absolute w-20 h-20 z-2 -left-20 lg:hidden xl:block xl:left-5 2xl:left-20 rotate-90">
              <Image src="/footer-figure.svg" alt="footer-figure" fill className="object-contain"/>
            </div>
            <div className="absolute w-20 h-20 z-2 -right-20 lg:hidden xl:block xl:right-5 2xl:right-20">
              <Image src="/footer-figure.svg" alt="footer-figure" fill className="object-contain"/>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center gap-3">
            <span className="uppercase font-bold text-base underline text-[rgba(255,255,255,0.5)]">Powered by jann design</span>
            <span className="uppercase font-bold text-base underline text-center text-[rgba(255,255,255,0.5)]">Master Fitness Academy <br /> since 2025</span>
          </div>
        </div>
      </MainContainer>

      <div className="absolute left-1/2 bottom-[-150px] -translate-x-1/2 w-[2000px] h-[450px] opacity-80 pointer-events-none overflow-hidden -z-1">
        <Image
          src="/bg-figure.svg"
          alt="footer background"
          fill
          className="object-contain translate-y-[20%]"
        />
      </div>
    </footer>
  )
}