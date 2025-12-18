"use client";

import { useEffect, useState } from "react";
import MainContainer from "@/components/MainContainer";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import "../../../styles/slider.css";

import { getTrainers, Trainer } from "@/services/coaches/coaches.api";

function TrainerSkeleton() {
  return (
    <div className="w-full flex justify-center items-center h-full animate-pulse">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 bg-black/10 border border-white/10 rounded-2xl p-8 w-full md:max-w-[600px] lg:max-w-[800px] xl:max-w-[950px] 2xl:max-w-[1100px]">

        {/* Фото */}
        <div className="w-[280px] h-[280px] 2xl:w-[500px] 2xl:h-[500px] rounded-full bg-white/10 shrink-0" />

        {/* Текст */}
        <div className="flex flex-col flex-1 gap-4 w-full">
          <div className="h-10 lg:h-12 2xl:h-14 w-2/3 bg-white/10 rounded-lg" />

          <div className="space-y-3">
            <div className="h-5 md:h-6 w-full bg-white/10 rounded" />
            <div className="h-5 md:h-6 w-[95%] bg-white/10 rounded" />
            <div className="h-5 md:h-6 w-[90%] bg-white/10 rounded" />
            <div className="h-5 md:h-6 w-[85%] bg-white/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrainersSlider() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrainers()
      .then(setTrainers)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <MainContainer>
        <section className="relative overflow-visible z-10 flex justify-center mb-20">
          <Swiper
            slidesPerView={1}
            className="w-full !pb-7 lg:!pb-10"
          >
            {[1, 2, 3].map((i) => (
              <SwiperSlide key={i} className="flex justify-center">
                <TrainerSkeleton />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </MainContainer>
    );
  }

  if (!trainers.length) {
    return null;
  }

  function shortFullName(fullName: string) {
    const parts = fullName.trim().split(" ");

    if (parts.length < 2) return fullName;

    const lastName = parts[0];
    const firstInitial = parts[1]?.[0] ? `${parts[1][0]}.` : "";
    const middleInitial = parts[2]?.[0] ? `${parts[2][0]}.` : "";

    return `${lastName} ${firstInitial}${middleInitial}`;
  }

  return (
    <MainContainer>
      <section className="relative overflow-visible z-10 flex justify-center mb-20">
        <Swiper
          modules={[Navigation, Pagination]}
          loop
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="w-full !pb-7 lg:!pb-10 relative overflow-visible flex justify-center items-center"
        >
          {trainers.map((trainer) => (
            <SwiperSlide
              key={trainer.id}
              className="flex justify-center items-center"
            >
              <div className="w-full flex justify-center items-center h-full">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-10 bg-black/10 border border-white/10 rounded-2xl shadow-[inset_0_3px_6px_rgba(255,255,255,0.1),_inset_0_-4px_8px_rgba(0,0,0,0.9),_0_8px_20px_rgba(0,0,0,0.5)] p-8 w-full md:max-w-[600px] lg:max-w-[800px] xl:max-w-[950px] 2xl:max-w-[1100px]">

                  {/* Фото тренера */}
                  <div className="relative w-[280px] h-[280px] 2xl:w-[500px] 2xl:h-[500px] rounded-full shrink-0 overflow-hidden">
                    {trainer.img ? (
                      <Image
                        src={trainer.img.startsWith("http") ? trainer.img : `/uploads/${trainer.img}`}
                        alt={trainer.name}
                        fill
                        priority
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-full" />
                    )}
                  </div>

                  {/* Описание */}
                  <article className="flex flex-col flex-1 text-center md:text-left">
                    <h1 className="font-semibold text-4xl lg:text-5xl 2xl:text-6xl mb-4 text-white">
                      {shortFullName(trainer.name)}
                    </h1>

                    {trainer.description && (
                      <p className="text-lg md:text-2xl font-medium leading-relaxed text-white/80 whitespace-pre-line">
                        {trainer.description}
                      </p>
                    )}
                  </article>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </MainContainer>
  );
}
