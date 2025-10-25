import MainContainer from "@/components/MainContainer";
import Image from "next/image";

export default function Advantages() {
  return (
    <div className="relative flex justify-center items-center mb-10 bg-[url('/figure.svg')] w-full bg-center bg-cover xl:bg-none">
      {/* Ромб-контейнер */}
      <div
        className="xl:bg-[url('/figure.svg')] bg-center bg-contain bg-no-repeat overflow-visible text-white w-full h-[1168px] relative flex flex-col justify-center items-center lg:justify-start lg:pt-50"
      >
        <MainContainer>
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold mb-6 md:text-5xl md:mb-10 lg:mb-2">ПОЧЕМУ ВЫБИРАЮТ НАС?</h2>
            <div className="flex max-w-[1000px] flex-wrap gap-6 text-sm mx-auto justify-center items-center">
              <div className="flex flex-col justify-center items-center">
                <div className="w-20 h-23 relative md:w-30 md:h-33">
                  <Image src="/ifbb.svg" alt="IFBB icon" fill className="object-contain"/>
                </div>
                <p className="font-bold text-4xl lg:text-5xl">IFBB</p>
                <p className="text-center w-50 lg:w-75 text-lg font-semibold lg:text-3xl">Сотрудничество с International Fitness and Bodybuilding</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="w-20 h-23 relative md:w-30 md:h-33">
                  <Image src="/achievments.svg" alt="IFBB icon" fill className="object-contain"/>
                </div>
                <p className="text-center w-50 lg:w-75 text-lg font-semibold lg:text-3xl">Наши выпускники не только тренеры фитнеса, но и чемпионы Узбекистана</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="w-20 h-23 relative md:w-30 md:h-33">
                  <Image src="/online.svg" alt="IFBB icon" fill className="object-contain"/>
                </div>
                <p className="text-center w-50 lg:w-75 text-lg font-semibold lg:text-3xl">Возможность получения Красного и Синего диплома</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="w-20 h-23 relative md:w-30 md:h-33">
                  <Image src="/teachers.svg" alt="IFBB icon" fill className="object-contain"/>
                </div>
                <p className="text-center w-50 lg:w-75 text-lg font-semibold lg:text-3xl">Возможность получения Красного и Синего диплома</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="w-20 h-23 relative md:w-30 md:h-33">
                  <Image src="/teachers.svg" alt="IFBB icon" fill className="object-contain"/>
                </div>
                <p className="text-center w-50 lg:w-75 text-lg font-semibold lg:text-3xl">Преподаватели с опытом более 15 лет</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="w-20 h-23 relative md:w-30 md:h-33">
                  <Image src="/grade.svg" alt="IFBB icon" fill className="object-contain"/>
                </div>
                <p className="text-center w-50 lg:w-75 text-lg font-semibold lg:text-3xl">Повышение квалификации и рентабельности</p>
              </div>
            </div>
          </div>
        </MainContainer>
      </div>
    </div>
  );
}
