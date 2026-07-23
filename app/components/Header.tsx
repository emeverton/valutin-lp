"use client";

import { useEffect, useState } from "react";
import { BRAND_NAME, INSTAGRAM_URL } from "../lib/constants";

interface HeaderProps {
  onOpenModal: () => void;
}

export default function Header({ onOpenModal }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToComoChegar() {
    document.getElementById("como-chegar")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header
      className={`fixed top-[40px] left-0 right-0 z-50 h-[72px] transition-all duration-300 border-b ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-brand/10 shadow-sm"
          : "bg-white/90 backdrop-blur-md border-brand/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 h-full grid grid-cols-3 items-center">
        <div className="flex items-center gap-8">
          <button className="font-poppins text-[11px] uppercase tracking-[0.15em] text-ink/70 hover:text-brand transition-colors duration-200">
            A MAISON VALUTIN
          </button>
          <button
            onClick={scrollToComoChegar}
            className="font-poppins text-[11px] uppercase tracking-[0.15em] text-ink/70 hover:text-brand transition-colors duration-200"
          >
            SERVIÇOS
          </button>
        </div>

        <div className="flex justify-center">
          <span className="font-playfair text-[20px] tracking-[0.25em] text-ink">
            {BRAND_NAME}
          </span>
        </div>

        <div className="flex justify-end items-center gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Valutin"
            className="text-ink/70 hover:text-brand transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </a>

          <div className="w-px h-4 bg-ink/20" />

          <button
            onClick={onOpenModal}
            className="font-poppins text-[12px] border border-brand text-brand px-4 py-1.5 rounded-full hover:bg-brand hover:text-white transition-all duration-200"
          >
            Falar com a equipe
          </button>
        </div>
      </div>
    </header>
  );
}
