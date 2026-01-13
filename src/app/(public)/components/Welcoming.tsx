"use client";

import MainContainer from "@/components/MainContainer";
import Link from "next/link";
import Head from "next/head";
import { motion, Variants } from "framer-motion";

// ===== Framer Motion Variants =====
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } 
  },
};

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
            <motion.h1
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUpVariants}
              className="text-[#FF6600] text-5xl text-wrap lg:text-8xl font-semibold mb-4"
            >
              РАЗВИВАЙ <br />ТЕЛО. <br />ПРОКАЧИВАЙ <br />ХАРАКТЕР.
            </motion.h1>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUpVariants}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-4xl block"
            >
              Тренировки и курсы от <br />лучших инструкторов <br />
              Master <span className="text-[#FF6600]">Fitness</span> Academy
            </motion.p>
          </article>

          <div className="flex gap-5 justify-start items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUpVariants}
              transition={{ delay: 0.4 }}
            >
              <Link href="/courses">
                <button className="text-white cursor-pointer bg-[#FF6600] w-50 py-2 font-semibold text-lg rounded-lg lg:w-60 lg:h-15 transition-all duration-300 hover:bg-white hover:text-[#FF6600]">
                  КУРСЫ
                </button>
              </Link>
            </motion.div>
          </div>
        </MainContainer>
      </div>
    </>
  );
}
