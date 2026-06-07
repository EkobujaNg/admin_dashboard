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
    <main className="flex flex-col md:flex-row items-center justify-center md:h-screen bg-white container mx-auto">
      <figure className="md:hidden self-start px-5 pt-12 pb-4 md:px-24 md:py-16">
        <Image src={LogoColored} alt="logo white" className="" />
      </figure>

      <section className=" hidden px-5 py-12 md:px-24 md:py-16 bg-opacityClr-100 rounded-tr-[128px] h-full md:flex gap-24 justify-center flex-col relative w-[704px]">
        <Image src={FooterLogo} alt="logo white" className="" />

        <div className="flex flex-col items-start gap-6">
          {/* Animated H1 */}
          <motion.h1
            className="font-Raleway font-bold text-[64px] text-white leading-[96%] tracking-[-3.2px] w-[530px]"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Are My Funds & Assets Safe on <span className="text-neutral-lightGreen">EkoBuja?</span>
          </motion.h1>

          {/* Animated Paragraph */}
          <motion.p
            className="text-white font-Raleway text-lg font-light leading-[150%] w-[566px]"
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

      <section className="md:flex-1 flex items-center justify-center overflow-y-scroll  px-5 py-12 md:px-24 md:py-16 h-full bg-white w-full md:w-auto">
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
