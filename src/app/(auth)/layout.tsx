"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import FooterLogo from "../../../public/assets/images/footerLogo-white.svg";
import LogoColored from "../../../public/assets/images/logo-colored.svg";

const AuthLayout = ({ children }) => {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="flex flex-col md:flex-row w-full min-h-screen bg-white">
      <figure className="md:hidden self-start px-5 pt-12 pb-4 md:px-24 md:py-16">
        <Image src={LogoColored} alt="logo white" className="" />
      </figure>

      <section className="hidden px-5 py-12 md:px-16 lg:px-24 md:py-16 bg-opacityClr-100 rounded-tr-[128px] min-h-screen md:flex gap-16 lg:gap-24 justify-center flex-col relative md:w-1/2 xl:w-[704px] xl:shrink-0">
        <Image src={FooterLogo} alt="logo white" className="" />

        <div className="flex flex-col items-start gap-6">
          <motion.h1
            className="font-Raleway font-bold text-4xl lg:text-[64px] text-white leading-[96%] tracking-[-3.2px] max-w-xl"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Are My Funds & Assets Safe on <span className="text-neutral-lightGreen">EkoBuja?</span>
          </motion.h1>

          <motion.p
            className="text-white font-Raleway text-base lg:text-lg font-light leading-[150%] max-w-xl"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            Yes, your funds and assets are safe on EkoBuja. We prioritize the security of your investments by employing robust measures to
            ensure trust, transparency, and protection at every step.
          </motion.p>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center overflow-y-auto px-5 py-12 md:px-16 lg:px-24 md:py-16 min-h-screen bg-white w-full">
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
