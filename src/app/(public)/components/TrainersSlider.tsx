"use client"

import MainContainer from "@/components/MainContainer";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import "../../../styles/slider.css"

const trainers = [
  { 
    id: 1,
    name: "Сергей Н.",
    bio: "Тренер-преподаватель по бодибилдингу и фитнесу. Судья национальной категории по бодибилдингу и фитнесу (AFBB, WBPF, WBBF, WFF). Судья международной категории WBPF. Судил чемпионаты Центральной Азии (Алма-Ата, 2019 и 2022 гг., WBPF; 2019 г., NABBA). Судейский стаж — 9 лет, тренерский стаж — 32 года.",
    img: "/trainers/sergey.jpg"
  },
  {
    id: 2,
    name: "Баймирзаева Д.Э",
    bio: "Врач акушер-гинеколог, аллерголог, эндокринолог, диетолог, кетодиетолог, рефлексотерапевт, валеолог, нутрициолог, реабилитолог. Руководитель обучающего центра «Академия Здоровья, Узбекистан» с 2004 года.",
    img: "/trainers/baymirzayeva.jpg"
  },
  {
    id: 3, 
    name: "Нураев Р.Р", 
    bio: "Неоднократный чемпион и рекордсмен Республики Узбекистан по пауэрлифтингу. Заслуженный мастер спорта международного класса. В 2004 году стал чемпионом Азиатских игр по пауэрлифтингу и установил рекорд Азии — тяга 302,5 кг в весе 82,5 кг. В 2009–2014 годах выступал по бодибилдингу. Неоднократный чемпион Республики Узбекистан в весе 90 кг. Организатор и тренер женской команды по бодибилдингу NFT — Nuraev Fitness Team, в составе которой 18 спортсменок, из них 5 чемпионок мира и 8 чемпионок Азии по фитнесу. ",
    img: "/trainers/nuraev.jpg"
  },
  {
    id: 4, 
    name: "Татаренко В.Г", 
    bio: "Мастер спорта по лёгкой атлетике. Фитнес-инструктор.",
    img: "/trainers/tatarenko.png"
  },
  {
    id: 5,
    name: "Светличная Н.К",
    bio: "Опубликовано более 220 работ, в том числе более 30 научных статей, 16 книг и пособий. Проходила стажировку в Национальном государственном университете физической культуры, спорта и здоровья имени П.Ф. Лесгафта, г. Санкт-Петербург (Россия, 2019). Участвовала в тренингах, семинарах и вебинарах, проводимых Всемирным антидопинговым агентством WADA, Национальным Олимпийским комитетом Украины, а также специалистами из Италии, России, Украины, Казахстана и Узбекистана.",
    img: "/trainers/svetlichnaya.jpg"
  },
];

export default function TrainersSlider() {
  return (
    <MainContainer>
      <section className="relative overflow-visible z-10 flex justify-center mb-20">
        <Swiper
          modules={[Navigation, Pagination]}
          loop
          slidesPerView={1}
          navigation={true}
          pagination={{ clickable: true }}
          className="w-full !pb-7 lg:!pb-10 relative overflow-visible flex justify-center items-center"
        >
          {trainers.map((trainer) => (
            <SwiperSlide key={trainer.id} className="flex justify-center items-center">
              <div className="w-full flex justify-center items-center h-full">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-10 bg-black/10 border border-white/10 rounded-2xl shadow-[inset_0_3px_6px_rgba(255,255,255,0.1),_inset_0_-4px_8px_rgba(0,0,0,0.9),_0_8px_20px_rgba(0,0,0,0.5)] p-8 w-full md:max-w-[600px] lg:max-w-[800px] xl:max-w-[950px] 2xl:max-w-[1100px]">
                  {/* Фото тренера */}
                  <div className="relative w-[280px] h-[280px] 2xl:w-[500px] 2xl:h-[500px] rounded-full shrink-0">
                    <Image
                      src={trainer.img}
                      alt={trainer.name}
                      fill
                      priority
                      className="object-cover object-center rounded-full"
                    />
                  </div>

                  {/* Описание */}
                  <article className="flex flex-col flex-1 text-center md:text-left">
                    <h1 className="font-semibold text-4xl lg:text-5xl 2xl:text-6xl mb-4 text-white">
                      {trainer.name}
                    </h1>
                    <p className="text-lg md:text-2xl font-medium leading-relaxed text-white/80">
                      {trainer.bio}
                    </p>
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