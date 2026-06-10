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
        alt="Moda infantil Valutin — crianças com estilo"
        fill
        priority
        className="object-cover object-center"
        unoptimized
      />

      <div className="absolute inset-0 bg-gradient-to-t from-brand/50 to-transparent" />

      <div className="absolute bottom-0 left-0 px-8 pb-20 md:px-16 md:pb-28 max-w-4xl">
        <p className="font-poppins text-[11px] uppercase tracking-[0.25em] text-white/70 mb-6">
          {HERO_COPY.tag}
        </p>

        <h1 className="font-playfair text-3xl md:text-5xl lg:text-[64px] italic text-white max-w-2xl leading-tight mb-8">
          {HERO_COPY.h1}
        </h1>

        <button
          onClick={onCtaClick}
          className="inline-flex items-center px-8 py-3 rounded-full border border-white text-white font-poppins text-sm font-medium hover:bg-white hover:text-brand transition-all duration-300"
        >
          {HERO_COPY.cta}
        </button>

        <p className="mt-4 font-poppins text-xs text-white/60">
          {HERO_COPY.urgency}
        </p>
      </div>
    </section>
  );
}
