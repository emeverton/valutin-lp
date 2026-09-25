import Image from "next/image";
import { categoryHref } from "../lib/catalog-navigation";

const stories = [
  {
    href: categoryHref("crianca"),
    image: "/campaign-spring-summer-2026/embroidered-detail.jpg",
    alt: "Detalhe editorial de bordado floral em cardigan infantil",
    eyebrow: "Feito para guardar",
    title: "Detalhes que contam história.",
    cta: "Ver para crianças",
    gradient: "from-black/60",
    imagePosition: "object-center",
  },
  {
    href: categoryHref("presentes"),
    image: "/campaign-spring-summer-2026/gifts-still-life.jpg",
    alt: "Vestido branco de laise e macaquinho branco da coleção Primavera–Verão",
    eyebrow: "Para presentear",
    title: "Uma escolha que permanece.",
    cta: "Ver presentes",
    gradient: "from-[#244466]/70",
    imagePosition: "object-center",
  },
] as const;

export default function SpringSummerCategoryStories() {
  return (
    <section id="historias-primavera-verao" aria-label="Descubra peças para crianças e presentes" className="mx-auto max-w-[1440px] scroll-mt-36 px-4 py-8 sm:px-7 sm:py-12 lg:px-10">
      <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
        {stories.map((story) => (
          <a key={story.href} href={story.href} className="group relative block min-h-[440px] overflow-hidden bg-[#e8e4dc] sm:min-h-[540px] lg:min-h-[600px]">
            <Image src={story.image} alt={story.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1440px) 50vw, 700px" className={`object-cover ${story.imagePosition} transition-transform duration-700 group-hover:scale-[1.03]`} />
            <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t ${story.gradient} to-transparent`} />
            <div className="absolute inset-x-0 bottom-0 px-7 pb-8 pt-24 text-white sm:px-9 sm:pb-10">
              <p className="font-poppins text-[10px] uppercase tracking-[0.18em] text-white/85">{story.eyebrow}</p>
              <h2 className="mt-3 max-w-md font-playfair text-4xl leading-[1.06] sm:text-5xl">{story.title}</h2>
              <span className="mt-6 inline-block border-b border-white pb-1 font-poppins text-[11px] uppercase tracking-[0.13em]">{story.cta}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
