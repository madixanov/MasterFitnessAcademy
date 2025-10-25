import MainContainer from "@/components/MainContainer";
import Image from "next/image";

const advantagesList = [
  {
    icon: "/ifbb.svg",
    title: "IFBB",
    text: "Сотрудничество с International Fitness and Bodybuilding",
  },
  {
    icon: "/achievments.svg",
    text: "Наши выпускники не только тренера фитнеса,но и чемпионы Узбекистана ",
  },
  {
    icon: "/online.svg",
    text: "Возможность онлайн обучения с доступом в личный кабинет",
  },
  {
    icon: "/diploma.svg",
    text: "Возможность получения Красного и Синего диплома"
  },
  {
    icon: "/teachers.svg",
    text: "Преподаватели с опытом более 15 лет",
  },
  {
    icon: "/grade.svg",
    text: "Повышение квалификации и рентабельности",
  },
]

export default function Advantages() {
  return (
    <div className="relative flex justify-center items-center mb-10 bg-[url('/figure.svg')] w-full bg-center bg-cover xl:bg-none">
      <Image
        src="/advantages-photo.svg"
        alt="decor 1"
        width={300}
        height={300}
        className="absolute 2xl:top-[-20] rotate-40  2xl:left-130 opacity-70 hidden 2xl:block"
      />
      <Image
        src="/advantages-photo.svg"
        alt="decor 2"
        width={300}
        height={300}
        className="absolute xl:top-20 xl:left-10 -rotate-40 opacity-70 hidden xl:block"
      />
      <Image
        src="/advantages-photo.svg"
        alt="decor 4"
        width={300}
        height={300}
        className="absolute xl:-bottom-10 rotate-20 xl:left-30 2xl:left-70 opacity-70 hidden xl:block"
      />
      <Image
        src="/advantages-photo.svg"
        alt="decor 5"
        width={300}
        height={300}
        className="absolute xl:top-10 xl:right-30 rotate-120 opacity-70 hidden xl:block"
      />
      <Image
        src="/advantages-photo.svg"
        alt="decor 4"
        width={300}
        height={300}
        className="absolute xl:bottom-30 rotate-160 xl:right-40 opacity-70 hidden xl:block"
      />
      <Image
        src="/advantages-photo.svg"
        alt="decor 4"
        width={300}
        height={300}
        className="absolute 2xl:bottom-0 rotate-250 2xl:right-120 opacity-70 hidden 2xl:block"
      />
      {/* Ромб-контейнер */}
      <div
        className="xl:bg-[url('/figure.svg')] bg-center bg-cover bg-no-repeat overflow-hidden text-white w-[1920px] h-[800px] md:h-[1000px] lg:h-[1130px] xl:h-[1168px] relative flex flex-col justify-center items-center lg:justify-start lg:pt-30 xl:pt-50"
      >
        <MainContainer>
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold mb-6 md:text-5xl md:mb-10 lg:mb-10">ПОЧЕМУ ВЫБИРАЮТ НАС?</h2>
            <div className="flex max-w-[1000px] flex-wrap gap-6 text-sm mx-auto justify-center items-center">
              {advantagesList.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center max-w-[250px] lg:h-[344px]"
                  >
                    <div className="relative w-full h-20 md:w-full md:h-28 mb-4">
                      <Image src={item.icon} alt={item.title || "icon"} fill className="object-contain" />
                    </div>
                    {item.title && <p className="text-3xl font-bold md:text-5xl">{item.title}</p>}
                    <p className="text-center w-50 lg:w-65 text-lg font-semibold lg:text-3xl">{item.text}</p>
                  </div>
                ))}
            </div>
          </div>
        </MainContainer>
      </div>
    </div>
  );
}
