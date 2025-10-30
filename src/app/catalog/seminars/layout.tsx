import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Семинары | Master Fitness Academy",
  description: "Лучшие тренеры и курсы по нутрициологии. Обучение от профессионалов.",
};

// Default export должен быть React-компонентом
export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <>
        {children}
      </>
  );
}
