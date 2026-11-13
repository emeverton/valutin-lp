"use client";

import { useState } from "react";
import Image from "next/image";
import { buildAtendimentoHref } from "../lib/whatsapp/attr-merge";

const galleries = [
  {
    id: "bodies",
    title: "Bodies bordados",
    description: "Golas, pontos e delicados acabamentos para acompanhar os primeiros dias.",
    photos: [
      { file: "bodies-bordados", alt: "Seleção de bodies com golas e bordados variados", label: "Bordados delicados" },
      { file: "bodies-golas", alt: "Variedade de bodies com diferentes modelos de golas e detalhes", label: "Modelos de golas" },
      { file: "bodies-detalhes", alt: "Bodies em tons claros com golas rendadas e detalhes bordados", label: "Rendas e detalhes" },
    ],
  },
  {
    id: "enxoval",
    title: "Enxoval completo",
    description: "Roupas, mantas e acessórios que se combinam com todo o cuidado Valutin.",
    photos: [
      { file: "enxoval-azul", alt: "Composição de enxoval azul-marinho com tricô e peças com bordado de cavalinho", label: "Composição azul" },
      { file: "enxoval-rosa", alt: "Composição de enxoval rosa com macacão de tricô, manta e acessórios", label: "Composição rosa" },
    ],
  },
] as const;

function EditorialGallery({ gallery }: { gallery: typeof galleries[number] }) {
  const [selected, setSelected] = useState(0);
  const photo = gallery.photos[selected];

  return <div className="min-w-0">
    <h3 className="font-playfair text-2xl text-ink">{gallery.title}</h3>
    <p className="mb-4 mt-2 font-poppins text-xs leading-relaxed text-ink/65">{gallery.description}</p>
    <div id={`maternidade-${gallery.id}-foto`} className="relative aspect-[4/3] overflow-hidden bg-[#f5eadf]" aria-live="polite" aria-atomic="true">
      <Image src={`/maternidade-editorial/${photo.file}.jpg`} alt={photo.alt} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-contain" priority={gallery.id === "bodies" && selected === 0} />
    </div>
    <div className="mt-3 flex gap-3" role="group" aria-label={`Fotos de ${gallery.title.toLowerCase()}`}>
      {gallery.photos.map((item, index) => <button key={item.file} type="button" onClick={() => setSelected(index)} aria-label={`Ver ${item.label.toLowerCase()}`} aria-pressed={selected === index} aria-controls={`maternidade-${gallery.id}-foto`} className={`relative h-16 w-20 overflow-hidden border-2 bg-[#f5eadf] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-strong ${selected === index ? "border-brand-strong" : "border-transparent hover:border-ink/30"}`}>
        <Image src={`/maternidade-editorial/${item.file}.jpg`} alt="" fill sizes="80px" className="object-contain" />
      </button>)}
    </div>
  </div>;
}

const contact = {
  src: "produto_consulta",
  peca: "Bodies bordados e enxoval completo",
  text: "Olá! Gostaria de conhecer os bodies bordados e montar o enxoval do meu bebê.",
};

export default function MaternityEditorial() {
  return <section aria-labelledby="maternidade-enxoval-titulo" className="mb-8 border border-ink/10 bg-cream p-5 sm:p-8 lg:p-10">
    <div className="max-w-3xl">
      <p className="font-poppins text-[10px] uppercase tracking-[0.18em] text-brand-strong">Para os primeiros dias</p>
      <h2 id="maternidade-enxoval-titulo" className="mt-3 font-playfair text-3xl leading-tight text-ink sm:text-4xl">Do primeiro body ao enxoval completo</h2>
      <p className="mt-4 font-poppins text-sm leading-relaxed text-ink/70">Temos sempre uma variedade de bodies com bordados à mão e à máquina, em diferentes modelos e delicados acabamentos. Também ajudamos você a montar o enxoval completo do bebê, combinando roupas, mantas e acessórios com todo o cuidado Valutin.</p>
    </div>
    <div className="mt-8 grid gap-8 md:grid-cols-2">
      {galleries.map((gallery) => <EditorialGallery key={gallery.id} gallery={gallery} />)}
    </div>
    <p className="mt-5 font-poppins text-[11px] leading-relaxed text-ink/60">As imagens apresentam algumas opções. Consulte os modelos, cores e tamanhos disponíveis.</p>
    <a href={"/atendimento?" + new URLSearchParams(contact)} onClick={(event) => { event.currentTarget.href = buildAtendimentoHref({ extra: contact }); }} className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-brand-strong px-6 py-3 text-center font-poppins text-xs font-medium uppercase tracking-[0.1em] text-white transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-strong sm:w-auto">Quero montar meu enxoval <span aria-hidden="true" className="ml-3">→</span></a>
  </section>;
}
