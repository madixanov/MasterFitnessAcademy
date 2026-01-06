import { ArrowRight } from "lucide-react";

interface ProductContainerProps {
  title: string;
  description: string;
  image: string;
}

export default function ProductContainer({ title, description, image }: ProductContainerProps) {
  return (
    <div
      className="group relative w-full h-[300px] bg-cover bg-center rounded-3xl overflow-hidden cursor-pointer shadow-[0_6px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Основное мягкое затемнение фона */}
      <div className="absolute inset-0 bg-black/20 transition-all duration-500 ease-out group-hover:bg-black/70"></div>

      {/* Контент */}
      <article className="absolute inset-0 flex flex-col items-center justify-end text-white transition-all duration-500 ease-out group-hover:justify-center">
        {/* Полоса под словом “Курс” */}
        <div className="absolute bottom-0 left-0 right-0 h-40 lg:h-20 bg-black/70 transition-all duration-500 ease-out group-hover:h-full"></div>

        {/* Текст поверх затемнения */}
        <div className="relative z-10 flex flex-col items-center pb-5 lg:pb-0 group-hover:pb-0">
          <h3 className="hidden lg:block text-5xl lg:text-3xl font-semibold uppercase tracking-wide translate-y-35 mb-6 transition-all duration-500 ease-out group-hover:-translate-y-5 group-hover:text-[#FF6600]">
            {title}
          </h3>

          <p className="opacity-100 lg:opacity-0 w-full px-2 text-center font-semibold text-2xl xl:text-2xl mt-4 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
            {description}
          </p>

          <div className="opacity-100 lg:opacity-0 group-hover:opacity-100 mt-6 transition-opacity duration-500 ease-out animate-[wiggleRight_1.5s_ease-in-out_infinite]">
            <ArrowRight className="w-10 h-10 text-[#FF6600]" />
          </div>
        </div>
      </article>
    </div>
  );
}
