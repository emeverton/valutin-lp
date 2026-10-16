"use client";

import Image from "next/image";
import { useCatalogProducts } from "./CatalogMediaProvider";
import { babyCategories, babySections, categoryHref, matchesCatalogCategory } from "../lib/catalog-navigation";
import { catalogImageClass } from "../lib/catalog-image";

export default function BabyDepartment({ section }: { section: string }) {
  const products = useCatalogProducts();
  const selected = babySections.find((item) => item.slug === section);
  const cards = selected ? babyCategories.filter((item) => item.parent === selected.slug) : babySections;

  return <section className="mx-auto max-w-[1440px] px-4 pb-24 pt-9 sm:px-7 sm:pt-12 lg:px-10">
    <a href={selected ? categoryHref("bebe") : "/catalogo"} className="font-poppins text-xs text-brand-strong underline underline-offset-4">{selected ? "← Voltar a Bebê" : "← Voltar às categorias"}</a>
    <p className="mt-6 font-poppins text-[11px] uppercase tracking-[0.18em] text-brand-strong">Valutin · Os primeiros dias</p>
    <h1 className="mt-3 font-playfair text-4xl text-ink sm:text-5xl">{selected?.title ?? "Bebê"}</h1>
    <p className="mt-4 max-w-xl font-poppins text-sm leading-relaxed text-ink/65">{selected ? "Escolha o tipo de peça para encontrar os modelos e consultar os tamanhos." : "Escolha Meninos ou Meninas e descubra as peças organizadas por categoria."}</p>
    {selected && <nav aria-label="Seleções de bebê" className="mt-7 flex gap-6 border-y border-ink/15 py-4">{babySections.map((item) => <a key={item.slug} href={categoryHref(item.slug)} aria-current={item.slug === selected.slug ? "page" : undefined} className={`min-h-10 content-center font-poppins text-sm ${item.slug === selected.slug ? "font-medium text-brand-strong underline underline-offset-8" : "text-ink/65 hover:text-brand-strong"}`}>{item.label}</a>)}</nav>}
    <div className={`mt-9 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 ${selected ? "lg:grid-cols-4" : "mx-auto max-w-[980px]"}`}>
      {cards.map((item, index) => {
        const matches = products.filter((product) => matchesCatalogCategory(product, item.slug));
        const preferred = "imageHandle" in item ? item.imageHandle : undefined;
        const cover = matches.find((product) => product.handle === preferred) ?? matches[0];
        return <a key={item.slug} href={categoryHref(item.slug)} className="group min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2"><h2 className={`text-ink group-hover:text-brand-strong ${selected ? "font-poppins text-sm font-medium" : "font-playfair text-2xl sm:text-3xl"}`}>{item.label}</h2><span aria-hidden="true" className="text-xl text-brand-strong">→</span></div>
          <div className={`catalog-product-surface relative overflow-hidden border border-ink/10 bg-[#f7f4ef] transition group-hover:border-ink/30 ${selected ? "aspect-[4/4.5]" : "aspect-[4/4.3]"}`}>
            {cover ? <Image src={cover.displayImages[0]} alt={cover.title} fill priority={index < 2} sizes={selected ? "(max-width: 1024px) 50vw, 25vw" : "(max-width: 1024px) 50vw, 490px"} className={catalogImageClass(cover.displayImages[0], "transition-transform duration-500 group-hover:scale-[1.035]")} /> : <span className="absolute inset-0 grid place-items-center px-4 text-center font-playfair text-2xl text-ink/45">{item.label}</span>}
          </div>
          <p className="mt-3 font-poppins text-xs text-ink/55">{matches.length ? `${matches.length} ${matches.length === 1 ? "peça" : "peças"}` : "Novidades em breve"}</p>
        </a>;
      })}
    </div>
  </section>;
}
