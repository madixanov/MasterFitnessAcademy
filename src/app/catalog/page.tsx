"use client";

import MainContainer from "@/components/MainContainer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Catalog() {
  return (
    <div className="relative bg-[url('/catalog/bg-photo.png')] bg-center bg-cover bg-no-repeat py-25 lg:py-0">
      {/* Затемнение фона */}
      <div className="absolute inset-0 bg-black/60" />

      <MainContainer>
        <section className="relative z-10 flex flex-col justify-center items-center gap-11 min-h-[calc(100svh-140px)] lg:min-h-[calc(100vh-140px)] text-white">
          <h1 className="uppercase text-4xl lg:text-5xl xl:text-7xl font-bold text-center">
            КУРСЫ И СЕМИНАРЫ
          </h1>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-10 xl:gap-20 w-full">
            {/* Карточка 1 */}
            <Link href="/catalog/courses" className="group w-full lg:flex-1">
              <div className="relative bg-[url('/catalog/courses.jpg')] bg-cover bg-no-repeat h-100 flex items-end rounded-3xl overflow-hidden transition-transform duration-500 ease-out hover:scale-105">
                <article className="w-full h-20 bg-black/70 flex justify-center items-center overflow-hidden transition-all duration-500 ease-out rounded-b-3xl">
                  <span className="font-bold text-3xl uppercase transition-transform duration-500 ease-out group-hover:-translate-x-24">
                    Курсы
                  </span>

                  <div className="relative flex items-center justify-center transition-transform duration-500 ease-out group-hover:translate-x-24">
                    <span
                      className="absolute w-16 h-16 rounded-full bg-[#FF6600]/30 scale-0 opacity-0
                                group-hover:scale-100 group-hover:opacity-100
                                transition-all duration-500 ease-out"
                    ></span>
                    <ArrowRight className="relative z-10 w-8 h-8 text-white transition-transform duration-300" />
                  </div>
                </article>
              </div>
            </Link>

            {/* Карточка 2 */}
            <div className="group w-full lg:flex-1 relative bg-[url('/catalog/seminars.jpg')] bg-cover bg-no-repeat h-100 flex items-end rounded-3xl overflow-hidden transition-transform duration-500 ease-out hover:scale-105">
              <article className="w-full h-20 bg-black/70 flex justify-center items-center overflow-hidden transition-all duration-500 ease-out rounded-b-3xl">
                <span className="font-bold text-3xl uppercase transition-transform duration-500 ease-out group-hover:-translate-x-24">
                  Семинары
                </span>

                <div className="relative flex items-center justify-center transition-transform duration-500 ease-out group-hover:translate-x-24">
                  <span
                    className="absolute w-16 h-16 rounded-full bg-[#FF6600]/30 scale-0 opacity-0
                              group-hover:scale-100 group-hover:opacity-100
                              transition-all duration-500 ease-out"
                  ></span>
                  <ArrowRight className="relative z-10 w-8 h-8 text-white transition-transform duration-300" />
                </div>
              </article>
            </div>
          </div>
        </section>
      </MainContainer>
    </div>
  );
}
