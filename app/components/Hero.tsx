"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { BRAND_NAME, HERO_COPY, HERO_IMAGE, LOGO_SRC } from "../lib/constants";

interface HeroProps {
  onCtaClick: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  const tagRef = useRef<HTMLParagraphElement>(null);
  const [logoWidth, setLogoWidth] = useState(0);

  useLayoutEffect(() => {
    const el = tagRef.current;
    if (!el) return;

    const measure = () => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const width = Math.ceil(range.getBoundingClientRect().width);
      if (width > 0) setLogoWidth(width);
    };

    measure();
    void document.fonts?.ready?.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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

      <div className="absolute inset-0 bg-gradient-to-t from-brand/40 via-transparent to-black/15" />

      <div className="absolute bottom-0 left-0 px-8 pb-20 md:px-16 md:pb-28 max-w-4xl pt-[112px]">
        <div className="mb-5 md:mb-6">
          <Image
            src={`${LOGO_SRC}?v=6`}
            alt={BRAND_NAME}
            width={1024}
            height={295}
            priority
            unoptimized
            className="block h-auto object-contain drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] transition-opacity duration-200"
            style={{
              width: logoWidth ? `${logoWidth}px` : "auto",
              maxWidth: "100%",
              height: "auto",
              opacity: logoWidth ? 1 : 0,
            }}
          />
          <p
            ref={tagRef}
            className="mt-3 font-poppins text-[11px] uppercase tracking-[0.25em] text-white/75 whitespace-nowrap w-max"
          >
            {HERO_COPY.tag}
          </p>
        </div>

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
