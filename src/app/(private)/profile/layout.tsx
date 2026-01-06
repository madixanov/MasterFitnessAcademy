import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../../globals.css";
import Sidebar from "@/components/Sidebar";
import PaymentBanner from "@/components/PaymentBanner";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Профиль | Master Fitness Academy",
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
        className={`${montserrat.variable} antialiased bg-black overflow-x-hidden text-white`}
      >
        <div className="flex">
          <Sidebar />

          <div className="flex flex-col flex-1 lg:ml-60">
            {/* Отступ под фиксированный Header */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <PaymentBanner />
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
