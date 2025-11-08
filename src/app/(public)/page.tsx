"use client";

import { Suspense, lazy } from "react";
import WelcomingContainer from "./components/Welcoming";
import Advantages from "./components/Advantages";
import Contacts from "./components/Contacts";
import Loader from "@/components/Loader";

const TrainersSlider = lazy(() => import("./components/TrainersSlider"));
const GallerySlider = lazy(() => import("./components/GallerySlider"));

export default function Home() {
  return (
    <main>
      <section aria-label="Приветствие">
        <WelcomingContainer />
      </section>

      <section aria-label="Преимущества">
        <Advantages />
      </section>

      <Suspense fallback={<Loader />}>
        <section aria-label="Наши тренеры">
          <TrainersSlider />
        </section>

        <section aria-label="Галерея">
          <GallerySlider />
        </section>
      </Suspense>

      <section aria-label="Контакты">
        <Contacts />
      </section>
    </main>
  );
}
