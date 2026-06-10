"use client";

import { useEffect, useState } from "react";
import { BRAND_NAME, INSTAGRAM_URL } from "../lib/constants";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-8 flex items-center justify-between">
        <span
          className={`font-playfair text-2xl tracking-widest transition-colors duration-300 ${
            scrolled ? "text-ink" : "text-white"
          }`}
        >
          {BRAND_NAME}
        </span>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram Valutin"
          className={`transition-colors duration-300 hover:opacity-60 ${
            scrolled ? "text-ink" : "text-white"
          }`}
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
      </div>
    </header>
  );
}
