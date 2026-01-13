"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Autoplay } from "swiper/modules";
import MainContainer from "@/components/MainContainer";
import { motion, Variants } from "framer-motion";
import { getPhotos, Photo } from "@/services/gallery/photoes.api";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";

// ===== Framer Motion Variants =====
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function GallerySlider() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    getPhotos().then(setPhotos);
  }, []);

  if (!photos.length) return null;

  return (
    <MainContainer>
      <section className="relative w-full flex flex-col justify-center mb-5 lg:pb-30 lg:pt-5">
        {/* Заголовок */}
        <motion.h1
          className="uppercase text-center font-semibold text-3xl md:text-5xl lg:text-7xl mb-13"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
        >
          Чемпионы
        </motion.h1>

        {/* Карусель */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="w-full"
          onMouseEnter={() => swiperRef.current?.autoplay.stop()}
          onMouseLeave={() => swiperRef.current?.autoplay.start()}
        >
          <Swiper
            modules={[Autoplay]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            centeredSlides
            loop
            slidesPerView={1.3}
            spaceBetween={20}
            speed={800}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: false, // мы контролируем сами
            }}
            breakpoints={{
              768: { slidesPerView: 1.6, spaceBetween: 40 },
              1024: { slidesPerView: 1.8, spaceBetween: 60 },
            }}
            className="carousel w-full max-w-[1320px] h-[400px] md:h-[600px] xl:h-[800px]"
          >
            {photos.map((photo) => (
              <SwiperSlide key={photo.id}>
                <motion.div
                  variants={fadeUpVariants}
                  className="relative w-full h-full rounded-3xl overflow-hidden"
                >
                  <Image
                    src={photo.imageUrl}
                    alt="чемпионы"
                    fill
                    priority
                    className="object-cover object-center"
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Фон */}
        <div className="absolute inset-0 -z-10 hidden xl:block">
          <Image
            src="/bg-figure.svg"
            alt="bg"
            fill
            className="object-contain opacity-80 rotate-90"
          />
        </div>
      </section>
    </MainContainer>
  );
}
