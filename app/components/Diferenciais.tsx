"use client";

import { DIFERENCIAIS } from "../lib/constants";

interface DiferenciaisProps {
  onOpenModal: () => void;
}

export default function Diferenciais({ onOpenModal }: DiferenciaisProps) {
  return (
    <section className="bg-brand py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {DIFERENCIAIS.map((item) => (
            <div key={item.number}>
              <span className="block font-playfair text-5xl italic text-white/20 mb-4 leading-none">
                {item.number}
              </span>
              <h3 className="font-playfair text-[22px] text-white mb-3">{item.title}</h3>
              <p className="font-poppins text-sm text-white/80 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-white/20 text-center">
          <button
            onClick={onOpenModal}
            className="font-poppins text-[13px] uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Iniciar atendimento →
          </button>
        </div>
      </div>
    </section>
  );
}
