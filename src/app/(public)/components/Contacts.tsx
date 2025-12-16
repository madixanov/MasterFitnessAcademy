"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MainContainer from "@/components/MainContainer";
import { getBranches, Branch } from "@/services/branches/branches.api";

// ===== Skeleton компонент =====
function BranchSkeleton() {
  return (
    <div className="animate-pulse flex flex-col md:flex-row gap-5 mb-10">
      {/* Левая карточка */}
      <div className="w-full lg:w-[445px] border-2 rounded-xl p-8 gap-5 bg-[#2c2c2c] h-[400px]" />
      {/* Карта */}
      <div className="w-full lg:w-200 h-[400px] rounded-xl bg-[#3a3a3a]" />
    </div>
  );
}

export default function Contacts() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getBranches();
        setBranches(data);
      } catch (err) {
        console.error("Ошибка загрузки филиалов:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return (
    <div className="relative mb-15">
      <MainContainer>
        <h1 className="uppercase text-center font-semibold text-3xl md:text-5xl lg:text-7xl mb-7 lg:mb-13">
          Филиалы
        </h1>

        {isLoading ? (
          <BranchSkeleton />
        ) : (
          branches.map((branch) => (
            <div key={branch.id} className="mb-10 flex flex-col md:flex-row justify-between gap-5 relative">
              {/* Инфо о филиале */}
              <div className="relative w-full lg:w-[445px] flex flex-col justify-center items-start border-2 p-8 gap-5 lg:gap-10 backdrop-blur-md bg-black/10 border-white/10 rounded-xl shadow-[inset_0_3px_6px_rgba(255,255,255,0.1),_inset_0_-4px_8px_rgba(0,0,0,0.5),_0_8px_20px_rgba(0,0,0,0.3)]">
                
                {/* Название города */}
                <h2 className="text-white font-bold text-3xl xl:text-4xl mb-6">{branch.city}</h2>

                {/* Телефон */}
                <div className="relative z-10 text-white text-lg flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-4">
                    <h1 className="font-bold lg:mb-2 text-2xl xl:text-3xl mr-2">Телефон</h1>
                    <div className="relative w-[30px] h-[30px]">
                      <Image src="/phone.svg" alt="phone-icon" fill className="object-contain" />
                    </div>
                  </div>
                  <p className="font-semibold xl:text-2xl text-lg">{branch.phone}</p>
                </div>

                {/* Почта */}
                <div className="relative z-10 text-white text-lg flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-4">
                    <h1 className="font-bold lg:mb-2 text-2xl xl:text-3xl mr-2">Почта</h1>
                    <div className="relative w-[30px] h-[30px]">
                      <Image src="/mail.svg" alt="mail-icon" fill className="object-contain" />
                    </div>
                  </div>
                  <p className="font-semibold xl:text-2xl text-lg">{branch.email}</p>
                </div>

                {/* Адрес */}
                <div className="relative z-10 text-white text-lg flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-4">
                    <h1 className="font-bold lg:mb-2 text-2xl xl:text-3xl mr-2">Адрес</h1>
                    <div className="relative w-[30px] h-[30px]">
                      <Image src="/marker.svg" alt="marker-icon" fill className="object-contain" />
                    </div>
                  </div>
                  <p className="font-semibold xl:text-2xl text-lg">{branch.address}</p>
                </div>
              </div>

              {/* Карта */}
              <div className="w-full lg:w-200 h-[400px] rounded-xl overflow-hidden shadow-lg lg:h-auto">
                <iframe
                  src={branch.mapLink}
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${branch.city}`}
                ></iframe>
              </div>
            </div>
          ))
        )}
      </MainContainer>

      <div className="absolute w-full inset-0 -z-10 h-full overflow-hidden">
        <Image
          src="/bg-figure.svg"
          alt="bg-image"
          fill
          preload
          className="object-contain opacity-80 rotate-90 md:rotate-0 scale-130 md:scale-120"
        />
      </div>
    </div>
  );
}
