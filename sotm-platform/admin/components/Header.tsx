"use client";
import React from "react";
import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";
import { motion } from "motion/react";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Header() {
  const letterAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };
  return (
    <div className="relative w-full h-[200px] md:h-[250px] lg:h-[350px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center bg-[url('/hero-bg.png')] bg-no-repeat" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-[#0F2473]/100"></div>

      {/* Left pastor image */}
      <div className="absolute left-0 bottom-0 h-full w-[200px] md:w-[300px] lg:w-[400px] lg:left-20">
        <div className="relative h-full w-full">
          <Image
            src="/setman.png"
            alt="Church Leaders"
            fill
            priority
            className="object-contain object-left-bottom"
            sizes="(max-width: 768px) 200px, (max-width: 1024px) 300px, 400px"
          />
        </div>
      </div>

      {/* Right pastor image (mirrored) */}
      <div className="absolute right-0 bottom-0 h-full w-[100px] md:w-[300px] lg:w-[400px]">
        <div className="relative h-full w-full">
          <Image
            src="/setman.png"
            alt="Church Leaders"
            fill
            priority
            className="object-contain object-right-bottom opacity-30 lg:opacity-20 lg:scale-125"
            sizes="(max-width: 768px) 200px, (max-width: 1024px) 300px, 400px"
          />
        </div>
      </div>

      {/* Content container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end lg:justify-center">
        {/* <h1
          className={`text-white font-semibold text-3xl md:text-5xl lg:text-6xl tracking-wider text-center ${plusJakartaSans.className}`}
        >
          <motion.span
            className="block lg:inline"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1], 
              delay: 0.1,
            }}
          >
            Spirit-Filled{" "}
          </motion.span>
          <motion.span
            className="block lg:inline"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
          >
            Messages
          </motion.span>
        </h1> */}
        <motion.h1
          className={`text-white font-semibold text-3xl md:text-5xl lg:text-6xl tracking-wider text-center ${plusJakartaSans.className}`}
          initial="initial"
          animate="animate"
        >
          <span className="block lg:inline">
            {"Spirit-Filled".split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterAnimation}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>{" "}
          <span className="block lg:inline">
            {"Messages".split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterAnimation}
                transition={{
                  duration: 0.5,
                  delay: (index + "Spirit-Filled".length) * 0.1,
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </motion.h1>
      </div>
    </div>
  );
}
