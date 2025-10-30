import MainContainer from "@/components/MainContainer";
import Image from "next/image";
import ProductContainer from "@/components/UI/ProductContainer";
import Head from "next/head";

const courses = [
  {id: 1, title: "Курсы", name: "Инструктор Тренажерного зала", image: "/courses/trainer-gym.jpg"},
  {id: 2, title: "Курсы", name: "Инструктор по бодибилдингу и фитнесу", image: "/courses/trainer-bodybuilding.jpg"},
  {id: 3, title: "Курсы", name: "Инструктор оздоровительной физкультуры", image: "/courses/fitness.jpg"},
  {id: 4, title: "Курсы", name: "Инструктор по групповым занятиям", image: "/courses/yoga.jpg"},
  {id: 5, title: "Курсы", name: "Практический Нутрициолог", image: "'/courses/diet.jpg'"},
]

export default function Courses() {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/courses/bg-photo.jpg"
          as="image"
          type="image/svg+xml"
        />
      </Head>

      <main className="relative bg-[url('/courses/bg-photo.jpg')] bg-center bg-cover bg-no-repeat py-25 lg:py-30 xl:py-40 flex justify-center items-center min-h-[calc(100vh-140px)] w-full">
        <div className="hidden lg:block absolute inset-0 z-10 overflow-hidden">
          <div className="w-full h-full rotate-90">
            <Image
              src="/courses/figure.svg"
              alt="figure"
              fill
              className="object-contain object-center opacity-70"
            />
          </div>
        </div>
        {/* Затемнение фона */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        {/* Контент поверх */}
        <MainContainer>
            <section className="relative z-20   grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {courses.map((course) => (
                <ProductContainer key={course.id} title={course.title} description={course.name} image={course.image} />
              ))}
            </section>
        </MainContainer>
      </main>
    </>
  )
}