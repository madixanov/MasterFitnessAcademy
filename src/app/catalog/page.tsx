"use client";

import MainContainer from "@/components/MainContainer";
import { ArrowRight } from "lucide-react";

export default function Catalog() {
  return (
    <div className="bg-[url('/courses/bg-photo.png')] bg-center bg-cover bg-no-repeat py-25 lg:py-0">
      <div className="absolute inset-0 bg-black/60" />

      <MainContainer>
        <section className="flex flex-col justify-center items-center gap-11 min-h-[calc(100svh-140px)] lg:min-h-[calc(100vh-140px)]">
          <h1 className="uppercase text-7xl font-bold">КУРСЫ И СЕМИНАРЫ</h1>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-10 gap-10 xl:gap-20 w-full cursor-pointer">
            <div className="group w-full lg:flex-1 bg-[url('/courses/courses.jpg')] bg-cover bg-no-repeat h-100 flex items-end rounded-3xl">
              <article
                className="w-full h-20 bg-black/70 flex justify-center items-center overflow-hidden relative transition-all duration-500 ease-out rounded-b-3xl"
              >
                {/* Текст */}
                <span
                  className="font-bold text-3xl uppercase text-white transition-transform duration-500 ease-out 
                            group-hover:-translate-x-24"
                >
                  Курсы
                </span>

                {/* Стрелка + круг */}
                <div
                  className="relative flex items-center justify-center ml-4 transition-transform duration-500 ease-out
                            group-hover:translate-x-24"
                >
                  {/* Круг остаётся в центре стрелки */}
                  <span
                    className="absolute w-0 h-0 rounded-full bg-[#FF6600]/30 opacity-0
                              group-hover:w-16 group-hover:h-16 group-hover:opacity-100
                              transition-all duration-500 ease-out"
                  ></span>

                  {/* Стрелка */}
                  <ArrowRight
                    className="relative z-10 w-8 h-8 text-white transition-transform duration-300"
                  />
                </div>
              </article>
            </div>

            <div className="group w-full lg:flex-1 bg-[url('/courses/seminars.jpg')] bg-cover bg-no-repeat h-100 flex items-end rounded-3xl">
              <article
                className="w-full h-20 bg-black/70 flex justify-center items-center overflow-hidden relative transition-all duration-500 ease-out rounded-b-3xl"
              >
                {/* Текст */}
                <span
                  className="font-bold text-3xl uppercase text-white transition-transform duration-500 ease-out 
                            group-hover:-translate-x-24"
                >
                  Семинары
                </span>

                {/* Стрелка + круг */}
                <div
                  className="relative flex items-center justify-center ml-4 transition-transform duration-500 ease-out
                            group-hover:translate-x-24"
                >
                  {/* Круг остаётся в центре стрелки */}
                  <span
                    className="absolute w-0 h-0 rounded-full bg-[#FF6600]/30 opacity-0
                              group-hover:w-16 group-hover:h-16 group-hover:opacity-100
                              transition-all duration-500 ease-out"
                  ></span>

                  {/* Стрелка */}
                  <ArrowRight
                    className="relative z-10 w-8 h-8 text-white transition-transform duration-300"
                  />
                </div>
              </article>
            </div>
          </div>
        </section>
      </MainContainer>
    </div>
  )
}