import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../../../globals.css";
import { Suspense } from "react";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Сброс пароля | Master Fitness Academy",
  description: "Лучшие тренеры и курсы по нутрициологии. Обучение от профессионалов.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased bg-black overflow-x-hidden text-white flex flex-col justify-center items-center`}
      >
        <Suspense fallback={<div>Загрузка...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
