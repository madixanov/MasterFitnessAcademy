import type { Metadata } from "next";
import AuthHeader from "./components/AuthHeader";
import AuthFooter from "./components/AuthFooter";

export const metadata: Metadata = {
  title: "Вход | Master Fitness Academy",
  description: "Лучшие тренеры и курсы по нутрициологии. Обучение от профессионалов.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className=" bg-black text-white flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <AuthHeader />
          {children}
        <AuthFooter />
      </div>
  );
}
