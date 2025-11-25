"use client";

import WelcomingContainer from "./components/Welcoming";
import Advantages from "./components/Advantages";
import Contacts from "./components/Contacts";
import Loader from "@/components/Loader";
import ScrollHandler from "@/components/ScrollHandler";
import { Suspense, lazy } from "react";

const TrainersSlider = lazy(() => import("./components/TrainersSlider"));
const GallerySlider = lazy(() => import("./components/GallerySlider"));

export default function Home() {
  return (
    <main>
      {/* Вставляем внутри Suspense */}
      <Suspense>
        <ScrollHandler />
      </Suspense>

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
