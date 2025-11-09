"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import MainContainer from "@/components/MainContainer";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="relative bg-[url('/courses/bg-photo.jpg')] bg-center bg-cover bg-no-repeat min-h-[calc(100vh-140px)] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" />

      <MainContainer>
        <div className="relative w-full flex flex-col items-center text-center text-white px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl"></div>

          <div className="relative z-10 py-20 flex flex-col items-center gap-6 animate-fadeIn">
            <h1 className="text-7xl font-bold tracking-wider">404</h1>
            <p className="text-2xl uppercase opacity-90">страница не найдена</p>

            <button
              onClick={() => router.push("/")}
              className="group relative mt-6 px-6 py-3 overflow-hidden text-lg font-medium border border-white/30 hover:border-transparent rounded-full transition-all duration-500 cursor-pointer"
            >
              <span className="absolute inset-0 bg-white/10 group-hover:bg-[#FF6600] rounded-full transition-all duration-500 scale-0 group-hover:scale-100"></span>
              <span className="relative z-10 flex items-center gap-3">
                <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                На главную
              </span>
            </button>
          </div>
        </div>
      </MainContainer>
    </div>
  );
}
