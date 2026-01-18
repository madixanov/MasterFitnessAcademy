"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import MainContainer from "./MainContainer";
import { getSocialNetworks, SocialNetwork } from "@/services/socials/socials.api";

/* ================== CONFIG ================== */
const ALLOWED_SOCIALS = ["telegram", "instagram", "facebook", "whatsapp", "number"];

const SOCIAL_ICONS: Record<string, string> = {
  telegram: "/tg.svg",
  instagram: "/ig.svg",
  facebook: "/fb.svg",
  whatsapp: "/wp.svg",
  number: "/phone.svg", // иконка для телефона
};
/* ============================================ */

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const [socials, setSocials] = useState<SocialNetwork[]>([]);
  const [phoneSocial, setPhoneSocial] = useState<SocialNetwork | null>(null);

  const scrollOrRedirect = (id: string) => {
    if (pathname !== "/") {
      router.push(`/?scroll=${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchSocialNetworks = async () => {
      try {
        const data = await getSocialNetworks();

        // Соцсети без телефона
        const socialsOnly = data.filter((social) =>
          ["telegram", "instagram", "facebook", "whatsapp"].includes(social.name.toLowerCase())
        );
        setSocials(socialsOnly);

        // Телефон ищем отдельно
        const phone = data.find((s) => s.name.startsWith("+998"));
        setPhoneSocial(phone || null);
      } catch (error) {
        console.error("Ошибка загрузки соцсетей:", error);
      }
    };

    fetchSocialNetworks();
  }, []);

  return (
    <footer className="relative z-10 overflow-hidden backdrop-blur-sm bg-black/25 border border-white/10 shadow-[inset_0_3px_6px_rgba(255,255,255,0.1),_inset_0_-4px_12px_rgba(0,0,0,0.4),_0_8px_20px_rgba(0,0,0,0.3)] py-5">
      <MainContainer>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-0">

          {/* ================= NAV ================= */}
          <nav className="w-full lg:w-auto">
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-3 place-items-center">
              <li>
                <Link href="/" className="text-white text-lg transition hover:text-[#FF6600]">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-white text-lg transition hover:text-[#FF6600]">
                  Курсы
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollOrRedirect("advantages")}
                  className="text-white text-lg transition hover:text-[#FF6600]"
                >
                  О нас
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollOrRedirect("gallery")}
                  className="text-white text-lg transition hover:text-[#FF6600]"
                >
                  Чемпионы
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollOrRedirect("contacts")}
                  className="text-white text-lg transition hover:text-[#FF6600]"
                >
                  Контакты
                </button>
              </li>
            </ul>
          </nav>

          {/* ============== SOCIALS ============== */}
          <div className="relative flex flex-col items-center">
            <div className="flex justify-between items-center gap-5 mb-3">
              {socials.map((social) => {
                const name = social.name.toLowerCase();
                const icon = SOCIAL_ICONS[name];
                if (!icon) return null;

                const href = name === "number" ? `tel:${social.name}` : social.url;

                return (
                  <a
                    key={social.id}
                    href={href}
                    target={name !== "number" ? "_blank" : undefined}
                    rel={name !== "number" ? "noopener noreferrer" : undefined}
                    title={name === "number" ? "Позвонить" : social.name}
                    className="w-[45px] h-[45px] relative cursor-pointer transition hover:scale-110"
                  >
                    <Image src={icon} alt={social.name} fill className="object-contain" />
                  </a>
                );
              })}
            </div>

            {/* Показать номер отдельным текстом */}
            {phoneSocial && (
              <span className="font-semibold text-3xl mt-2">
                {phoneSocial.name}
              </span>
            )}
          </div>

          {/* ============== COPYRIGHT ============== */}
          <div className="flex flex-col justify-center items-center gap-3">
            <span className="uppercase font-bold text-base underline text-center text-white/50">
              Master Fitness Academy <br /> since 2025
            </span>
          </div>
        </div>
      </MainContainer>
    </footer>
  );
}
