import { DIFERENCIAIS } from "../lib/constants";

export default function Diferenciais() {
  return (
    <section className="bg-brand py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
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
    </section>
  );
}
