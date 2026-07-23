"use client";

import Image from "next/image";
import { HERO_COPY, HERO_IMAGE } from "../lib/constants";

interface HeroProps {
  onCtaClick: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className="relative h-screen overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt="Menina com vestido Valutin — moda infantil"
        fill
        priority
        className="object-cover object-[58%_center]"
        unoptimized
      />

      <div className="absolute inset-0 bg-gradient-to-t from-brand/35 via-transparent to-black/10" />

      <div className="absolute bottom-0 left-0 px-8 pb-20 md:px-16 md:pb-28 max-w-4xl pt-[112px]">
        <p className="font-poppins text-[11px] uppercase tracking-[0.25em] text-white/70 mb-6">
          {HERO_COPY.tag}
        </p>

        <h1 className="font-playfair text-3xl md:text-5xl lg:text-[64px] italic text-white max-w-2xl leading-tight mb-8">
          {HERO_COPY.h1}
        </h1>

        <div className="relative inline-flex">
          <div
            className="absolute inset-0 rounded-full bg-white/30 animate-ping"
            style={{ animationDuration: "3s" }}
          />
          <button
            onClick={onCtaClick}
            className="relative inline-flex items-center bg-white text-brand font-poppins text-base font-semibold px-10 py-4 rounded-full hover:bg-white/95 hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {HERO_COPY.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
