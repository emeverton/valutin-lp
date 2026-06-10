"use client";

import Image from "next/image";
import {
  CONSULTORIA_COPY,
  CONSULTORIA_IMAGE,
  CONSULTORIA_ITEMS,
} from "../lib/constants";

interface ConsultoriaProps {
  onCtaClick: () => void;
}

export default function Consultoria({ onCtaClick }: ConsultoriaProps) {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 items-stretch">
        <div className="md:col-span-3 flex flex-col justify-center">
          <p className="font-poppins text-[11px] uppercase tracking-[0.2em] text-brand mb-4">
            {CONSULTORIA_COPY.label}
          </p>

          <h2 className="font-playfair text-[40px] italic text-ink leading-tight mb-6">
            {CONSULTORIA_COPY.title}
          </h2>

          <p className="font-poppins text-base text-gray-600 leading-relaxed mb-8">
            {CONSULTORIA_COPY.body}
          </p>

          <div className="flex flex-col gap-5 mb-8">
            {CONSULTORIA_ITEMS.map((item) => (
              <div key={item.title} className="border-l border-brand pl-4">
                <p className="font-poppins text-sm font-medium text-ink">{item.title}</p>
                <p className="font-poppins text-sm text-gray-500">{item.body}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onCtaClick}
            className="self-start font-poppins text-sm text-brand hover:opacity-60 transition-opacity"
          >
            {CONSULTORIA_COPY.cta}
          </button>
        </div>

        <div className="md:col-span-2 relative min-h-80 md:min-h-0 overflow-hidden">
          <Image
            src={CONSULTORIA_IMAGE}
            alt="Consultora Valutin com cliente"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
