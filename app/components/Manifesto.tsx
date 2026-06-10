import { MANIFESTO_COPY } from "../lib/constants";

export default function Manifesto() {
  return (
    <section className="bg-white py-32 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-px bg-brand mx-auto mb-12" />

        <blockquote className="font-playfair text-[28px] italic text-ink leading-relaxed mb-10">
          &ldquo;{MANIFESTO_COPY.quote}&rdquo;
        </blockquote>

        <p className="font-poppins text-xs uppercase tracking-widest text-brand">
          {MANIFESTO_COPY.attribution}
        </p>
      </div>
    </section>
  );
}
