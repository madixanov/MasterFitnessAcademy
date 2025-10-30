import MainContainer from "@/components/MainContainer"
import Link from "next/link"
import Head from "next/head"

export default function WelcomingContainer() {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/bg-photo.svg"
          as="image"
          type="image/svg+xml"
        />
      </Head>

      <div className="bg-[url('/bg-photo.svg')] bg-center bg-cover pb-34 pt-34">
        <MainContainer>
          <article className="text-white flex flex-col mb-21">
            <h1 className="text-[#FF6600] text-5xl text-wrap lg:text-8xl font-semibold mb-4">РАЗВИВАЙ <br />ТЕЛО. <br />ПРОКАЧИВАЙ <br />ХАРАКТЕР.</h1>
            <p className="text-xl lg:text-4xl block">Тренировки и курсы от <br />лучших инструкторов <br />Master <span className="text-[#FF6600]">Fitness</span> Academy</p>
          </article>
          <div className="flex gap-5 justify-start items-center">
            <Link href="/catalog">
              <button className="text-white cursor-pointer bg-[#FF6600] w-50 py-2 font-semibold text-lg rounded-lg lg:w-60 lg:h-15 transition-all duration-300 hover:bg-white hover:text-[#FF6600]">ЗАПИСАТЬСЯ</button>
            </Link>
            <Link href="/catalog/courses">
              <button className="bg-black cursor-pointer w-35 py-2 rounded-lg border-3 border-white drop-shadow-[0_0_43px_rgba(255,255,255,0.25)] lg:w-45 lg:h-15 transition-all duration-300 hover:bg-white hover:text-[#FF6600]">
                <span className="font-semibold text-lg inline-block text-[#FF6600]" style={{ textShadow: '0 0 15px #FF6600, 0 0 55px #FF6600' }}>КУРСЫ</span>
              </button>
            </Link>
          </div>
        </MainContainer>
      </div>
    </>
  )
}