import MainContainer from "@/components/MainContainer";
import Image from "next/image";

export default function Contacts() {
  return (
    <div className="relative mb-15">
      <MainContainer>
        <h1 className="uppercase text-center font-semibold text-3xl md:text-5xl lg:text-7xl mb-13 ">Филиал</h1>
        <div className="mb-10 flex flex-col md:flex-row justify-between gap-5 relative">
          <div className="relative w-full lg:w-[445px] flex flex-col justify-center items-start border-2 p-8 gap-5 lg:gap-10 backdrop-blur-md bg-black/10 border-white/10 rounded-xl shadow-[inset_0_3px_6px_rgba(255,255,255,0.1),_inset_0_-4px_8px_rgba(0,0,0,0.5),_0_8px_20px_rgba(0,0,0,0.3)]">
            <div className="relative z-10 text-white text-lg flex flex-col items-start">
              <div className="flex items-center gap-2 mb-4">
                <h1 className="font-bold lg:mb-2 text-3xl xl:text-4xl mr-2">Телефон</h1>
                <div className="relative w-[35px] h-[35px]">
                  <Image src="/phone.svg" alt="phone-icon" fill className="object-contain" />
                </div>
              </div>
              <p className="font-semibold xl:text-3xl text-xl">+998 (99) 842-21-04</p>
            </div>
            <div className="relative z-10 text-white text-lg flex flex-col items-start">
              <div className="flex items-center gap-2 mb-4">
                <h1 className="font-bold lg:mb-2 text-3xl xl:text-4xl mr-2">Почта</h1>
                <div className="relative w-[35px] h-[35px]">
                  <Image src="/mail.svg" alt="mail-icon" fill className="object-contain" />
                </div>
              </div>
              <p className="font-semibold xl:text-3xl text-xl">info@masterfitness.uz</p>
            </div>
            <div className="relative z-10 text-white text-lg flex flex-col items-start">
              <div className="flex items-center gap-2 mb-4">
                <h1 className="font-bold lg:mb-2 text-3xl xl:text-4xl mr-2">Адресс</h1>
                <div className="relative w-[35px] h-[35px]">
                    <Image src="/marker.svg" alt="marker-icon" fill className="object-contain" />
                </div>
              </div>
              <p className="font-semibold xl:text-3xl text-xl">Ул. Ахмад Дониша 64/66</p>
            </div>
          </div>

          <div className="w-full lg:w-200 h-[400px] rounded-xl overflow-hidden shadow-lg lg:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d344.1166822487097!2d69.27687216437772!3d41.35903728863422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8d006abdb93f%3A0x113117520bc11950!2sMax%20Sport%20GYM!5e1!3m2!1sru!2s!4v1761473269564!5m2!1sru!2s"
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Max Sport GYM Map"
            ></iframe>
          </div>
        </div>
      </MainContainer>

      <div className="absolute w-full inset-0 -z-10 h-full overflow-hidden">
        <Image
          src="/bg-figure.svg"
          alt="bg-image"
          fill
          className="object-contain opacity-80 rotate-90 md:rotate-0 scale-130 md:scale-120"
        />
      </div>
    </div>
  )
}