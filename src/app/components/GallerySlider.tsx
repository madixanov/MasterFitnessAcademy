"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import MainContainer from "@/components/MainContainer";

const gallery = [
  { id: 1, title: "photo1", url: "/gallery/photo1.jpg" },
  { id: 2, title: "photo2", url: "/gallery/photo2.jpg" },
  { id: 3, title: "photo3", url: "/gallery/photo3.jpg" },
  { id: 4, title: "photo4", url: "/gallery/photo4.jpg" },
  { id: 5, title: "photo5", url: "/gallery/photo5.jpg" },
];

export default function GallerySlider() {
  return (
    <MainContainer>
      <section className="relative w-full flex flex-col justify-center py-20 mb-25">
        <h1 className="uppercase text-center font-semibold text-3xl md:text-5xl lg:text-7xl mb-13 ">Чемпионы</h1>
        <Swiper
          modules={[Pagination]}
          centeredSlides
          loop
          slidesPerView={1.4}
          spaceBetween={20}
          className="w-full max-w-[1320px] h-[400px] md:h-[600px] xl:h-[800px]"
          breakpoints={{
            768: { slidesPerView: 1.6, spaceBetween: 40 },
            1024: { slidesPerView: 1.8, spaceBetween: 60 },
          }}
        >
          {gallery.map((photo) => (
            <SwiperSlide
              key={photo.id}
              className="relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] w-[620px] h-[400px] md:h-[600px] xl:h-[800px]"
            >
              <Image
                src={photo.url}
                alt={photo.title}
                fill
                className="object-cover object-center select-none pointer-events-none"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <div className="absolute w-full inset-0 -z-10 top-10 h-full overflow-hidden hidden lg:block lg:-left-150">
                <Image
                  src="/bg-figure.svg"
                  alt="bg-image"
                  fill
                  className="object-contain opacity-80 rotate-90 scale-100 xl:scale-80"
                />
        </div>
        <div className="absolute w-full inset-0 -z-10 top-10 h-full overflow-hidden hidden lg:block lg:left-150">
                <Image
                  src="/bg-figure.svg"
                  alt="bg-image"
                  fill
                  className="object-contain opacity-80 rotate-90 scale-100 xl:scale-80"
                />
        </div>
    </MainContainer>
  );
}
