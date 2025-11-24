"use client";

import { Suspense, lazy } from "react";
import WelcomingContainer from "./components/Welcoming";
import Advantages from "./components/Advantages";
import Contacts from "./components/Contacts";
import Loader from "@/components/Loader";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const TrainersSlider = lazy(() => import("./components/TrainersSlider"));
const GallerySlider = lazy(() => import("./components/GallerySlider"));

export default function Home() {
  const params = useSearchParams();
  const scrollTo = params.get("scroll");

  useEffect(() => {
    if (!scrollTo) return;

    const timeout = setTimeout(() => {
      const element = document.getElementById(scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 200); // оптимальное время 100–300мс

    return () => clearTimeout(timeout);
  }, [scrollTo]);

  return (
    <main>
      <section aria-label="Приветствие" id="welcoming">
        <WelcomingContainer />
      </section>

      <section aria-label="Преимущества" id="advantages">
        <Advantages />
      </section>

      <Suspense fallback={<Loader />}>
        <section aria-label="Наши тренеры" id="coaches">
          <TrainersSlider />
        </section>
      </Suspense>

      <Suspense fallback={<Loader />}>
        <section aria-label="Галерея" id="gallery">
          <GallerySlider />
        </section>
      </Suspense>

      <section aria-label="Контакты" id="contacts">
        <Contacts />
      </section>
    </main>
  );
}
