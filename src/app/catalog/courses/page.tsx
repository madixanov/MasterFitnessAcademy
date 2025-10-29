import MainContainer from "@/components/MainContainer";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Courses() {
  return (
    <div className="relative bg-[url('/courses/bg-photo.jpg')] bg-center bg-cover bg-no-repeat py-25 lg:py-20 xl:py-0">
      <div className="hidden lg:block absolute inset-0 z-10 overflow-hidden">
        <div className="w-full h-full rotate-90">
          <Image
            src="/courses/figure.svg"
            alt="figure"
            fill
            className="object-contain object-center opacity-70"
          />
        </div>
      </div>
      {/* Затемнение фона */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Контент поверх */}
      <MainContainer>
        <div className="relative z-20 flex justify-center items-center min-h-[calc(100vh-140px)] w-full">
          <section className="flex flex-col lg:flex-row w-full justify-center items-center gap-11 lg:gap-15">
            <div className="flex flex-col gap-11 w-full lg:flex-1">
              <div className="group relative w-full h-[400px] bg-[url('/courses/trainer-gym.jpg')] bg-cover bg-center rounded-3xl overflow-hidden cursor-pointer">
                {/* Основное мягкое затемнение фона */}
                <div className="absolute inset-0 bg-black/20 transition-all duration-500 ease-out group-hover:bg-black/70"></div>

                {/* Контент */}
                <article className="absolute inset-0 flex flex-col items-center justify-end text-white transition-all duration-500 ease-out group-hover:justify-center">
                  {/* Полоса под словом “Курс” */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-black/70 transition-all duration-500 ease-out group-hover:h-full"></div>

                  {/* Текст поверх затемнения */}
                  <div className="relative z-10 flex flex-col-reverse group-hover:flex-col items-center">
                    <h3
                      className="text-5xl lg:text-3xl xl:text-5xl font-semibold uppercase tracking-wide mb-6 transition-all duration-500 ease-out 
                                  group-hover:-translate-y-5 group-hover:text-[#FF6600]"
                    >
                      Курс
                    </h3>

                    <p
                      className="opacity-0 max-w-[80%] text-center font-semibold text-4xl lg:text-2xl xl:text-4xl mt-4 transition-all duration-500 ease-out 
                                  group-hover:opacity-100 group-hover:translate-y-0"
                    >
                      Инструктор Тренажерного зала
                    </p>

                    <div
                      className="opacity-0 group-hover:opacity-100 mt-6 transition-opacity duration-500 ease-out
                                  animate-[wiggleRight_1.5s_ease-in-out_infinite]"
                    >
                      <ArrowRight className="w-10 h-10 text-[#FF6600]" />
                    </div>
                  </div>
                </article>
              </div>
              <div className="group relative w-full h-[400px] bg-[url('/courses/trainer-bodybuilding.jpg')] bg-cover bg-center rounded-3xl overflow-hidden cursor-pointer">
                {/* Основное мягкое затемнение фона */}
                <div className="absolute inset-0 bg-black/20 transition-all duration-500 ease-out group-hover:bg-black/70"></div>

                {/* Контент */}
                <article className="absolute inset-0 flex flex-col items-center justify-end text-white transition-all duration-500 ease-out group-hover:justify-center">
                  {/* Полоса под словом “Курс” */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-black/70 transition-all duration-500 ease-out group-hover:h-full"></div>

                  {/* Текст поверх затемнения */}
                  <div className="relative z-10 flex flex-col-reverse group-hover:flex-col items-center">
                    <h3
                      className="text-5xl lg:text-3xl xl:text-5xl font-semibold uppercase tracking-wide mb-6 transition-all duration-500 ease-out 
                                  group-hover:-translate-y-5 group-hover:text-[#FF6600]"
                    >
                      Курс
                    </h3>

                    <p
                      className="opacity-0 max-w-[80%] text-center font-semibold text-4xl lg:text-2xl xl:text-4xl mt-4 transition-all duration-500 ease-out 
                                  group-hover:opacity-100 group-hover:translate-y-0"
                    >
                      Инструктор по бодибилдингу и фитнесу
                    </p>

                    <div
                      className="opacity-0 group-hover:opacity-100 mt-6 transition-opacity duration-500 ease-out
                                  animate-[wiggleRight_1.5s_ease-in-out_infinite]"
                    >
                      <ArrowRight className="w-10 h-10 text-[#FF6600]" />
                    </div>
                  </div>
                </article>
              </div>
            </div>
            <div className=" w-full lg:flex-1/7">
              <div className="group relative w-full h-[400px] bg-[url('/courses/fitness.jpg')] bg-cover bg-center rounded-3xl overflow-hidden cursor-pointer">
                {/* Основное мягкое затемнение фона */}
                <div className="absolute inset-0 bg-black/20 transition-all duration-500 ease-out group-hover:bg-black/70"></div>

                {/* Контент */}
                <article className="absolute inset-0 flex flex-col items-center justify-end text-white transition-all duration-500 ease-out group-hover:justify-center">
                  {/* Полоса под словом “Курс” */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-black/70 transition-all duration-500 ease-out group-hover:h-full"></div>

                  {/* Текст поверх затемнения */}
                  <div className="relative z-10 flex flex-col-reverse group-hover:flex-col items-center">
                    <h3
                      className="text-5xl lg:text-3xl xl:text-5xl font-semibold uppercase tracking-wide mb-6 transition-all duration-500 ease-out 
                                  group-hover:-translate-y-5 group-hover:text-[#FF6600]"
                    >
                      Курс
                    </h3>

                    <p
                      className="opacity-0 max-w-[80%] text-center font-semibold text-4xl lg:text-2xl xl:text-4xl mt-4 transition-all duration-500 ease-out 
                                  group-hover:opacity-100 group-hover:translate-y-0"
                    >
                      Инструктор оздоровительной физкультуры
                    </p>

                    <div
                      className="opacity-0 group-hover:opacity-100 mt-6 transition-opacity duration-500 ease-out
                                  animate-[wiggleRight_1.5s_ease-in-out_infinite]"
                    >
                      <ArrowRight className="w-10 h-10 text-[#FF6600]" />
                    </div>
                  </div>
                </article>
              </div>
            </div>
            <div className="flex flex-col gap-11  w-full lg:flex-1">
              <div className="group relative w-full h-[400px] bg-[url('/courses/yoga.jpg')] bg-cover bg-center rounded-3xl overflow-hidden cursor-pointer">
                {/* Основное мягкое затемнение фона */}
                <div className="absolute inset-0 bg-black/20 transition-all duration-500 ease-out group-hover:bg-black/70"></div>

                {/* Контент */}
                <article className="absolute inset-0 flex flex-col items-center justify-end text-white transition-all duration-500 ease-out group-hover:justify-center">
                  {/* Полоса под словом “Курс” */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-black/70 transition-all duration-500 ease-out group-hover:h-full"></div>

                  {/* Текст поверх затемнения */}
                  <div className="relative z-10 flex flex-col-reverse group-hover:flex-col items-center">
                    <h3
                      className="text-5xl lg:text-3xl xl:text-5xl font-semibold uppercase tracking-wide mb-6 transition-all duration-500 ease-out 
                                  group-hover:-translate-y-5 group-hover:text-[#FF6600]"
                    >
                      Курс
                    </h3>

                    <p
                      className="opacity-0 max-w-[80%] text-center font-semibold text-4xl lg:text-2xl xl:text-4xl mt-4 transition-all duration-500 ease-out 
                                  group-hover:opacity-100 group-hover:translate-y-0"
                    >
                      Инструктор по групповым занятиям
                    </p>

                    <div
                      className="opacity-0 group-hover:opacity-100 mt-6 transition-opacity duration-500 ease-out
                                  animate-[wiggleRight_1.5s_ease-in-out_infinite]"
                    >
                      <ArrowRight className="w-10 h-10 text-[#FF6600]" />
                    </div>
                  </div>
                </article>
              </div>
              <div className="group relative w-full h-[400px] bg-[url('/courses/diet.jpg')] bg-cover bg-center rounded-3xl overflow-hidden cursor-pointer">
                {/* Основное мягкое затемнение фона */}
                <div className="absolute inset-0 bg-black/20 transition-all duration-500 ease-out group-hover:bg-black/70"></div>

                {/* Контент */}
                <article className="absolute inset-0 flex flex-col items-center justify-end text-white transition-all duration-500 ease-out group-hover:justify-center">
                  {/* Полоса под словом “Курс” */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-black/70 transition-all duration-500 ease-out group-hover:h-full"></div>

                  {/* Текст поверх затемнения */}
                  <div className="relative z-10 flex flex-col-reverse group-hover:flex-col items-center">
                    <h3
                      className="text-5xl lg:text-3xl xl:text-5xl font-semibold uppercase tracking-wide mb-6 transition-all duration-500 ease-out 
                                  group-hover:-translate-y-5 group-hover:text-[#FF6600]"
                    >
                      Курс
                    </h3>

                    <p
                      className="opacity-0 max-w-[80%] text-center font-semibold text-4xl lg:text-2xl xl:text-4xl mt-4 transition-all duration-500 ease-out 
                                  group-hover:opacity-100 group-hover:translate-y-0"
                    >
                      Практический Нутрициолог
                    </p>

                    <div
                      className="opacity-0 group-hover:opacity-100 mt-6 transition-opacity duration-500 ease-out
                                  animate-[wiggleRight_1.5s_ease-in-out_infinite]"
                    >
                      <ArrowRight className="w-10 h-10 text-[#FF6600]" />
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </div>
      </MainContainer>
    </div>
  )
}