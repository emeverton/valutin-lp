"use client";

import { useMemo, useState } from "react";
import { WHATSAPP_URL } from "../lib/constants";

const CATEGORIES = [
  {
    id: "bebe",
    label: "Bebê",
    description: "Seleção para os primeiros meses, presentes e momentos especiais.",
  },
  {
    id: "menina",
    label: "Menina",
    description: "Peças para o dia a dia, festas e ocasiões especiais.",
  },
  {
    id: "menino",
    label: "Menino",
    description: "Curadoria infantil com atendimento personalizado.",
  },
  {
    id: "ocasioes",
    label: "Ocasiões especiais",
    description: "Batizados, cerimônias, festas e produções completas.",
  },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

function pushCatalogEvent(event: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const browserWindow = window as DataLayerWindow;
  browserWindow.dataLayer = browserWindow.dataLayer || [];
  browserWindow.dataLayer.push({ event, ...payload });
}

function normalizeReference(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export default function CatalogoAssistido() {
  const [category, setCategory] = useState<CategoryId>("menina");
  const [reference, setReference] = useState("");

  const selectedCategory = CATEGORIES.find((item) => item.id === category)!;
  const normalizedReference = normalizeReference(reference);

  const whatsappHref = useMemo(() => {
    const referenceLine = normalizedReference
      ? ` Referência da peça: ${normalizedReference}.`
      : "";
    const message = `Olá! Quero conhecer o catálogo Valutin. Interesse: ${selectedCategory.label}.${referenceLine} Gostaria de receber uma curadoria com as opções disponíveis.`;

    return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
  }, [normalizedReference, selectedCategory.label]);

  function selectCategory(nextCategory: CategoryId) {
    setCategory(nextCategory);
    const selected = CATEGORIES.find((item) => item.id === nextCategory);
    pushCatalogEvent("catalog_category_select", {
      catalog_category: selected?.label ?? nextCategory,
    });
  }

  function handleWhatsappClick() {
    pushCatalogEvent("catalog_whatsapp_click", {
      catalog_category: selectedCategory.label,
      product_reference: normalizedReference || undefined,
      contact_channel: "whatsapp",
    });
  }

  return (
    <section id="catalogo" className="scroll-mt-32 bg-cream px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="mb-3 font-poppins text-[11px] font-medium uppercase tracking-[0.22em] text-brand">
              Catálogo Valutin
            </p>
            <h2 className="max-w-3xl font-playfair text-4xl italic leading-tight text-ink md:text-5xl">
              Encontre a peça. A nossa equipe cuida do resto.
            </h2>
            <p className="mt-5 max-w-2xl font-poppins text-[14px] leading-7 text-ink/65">
              Escolha o tipo de peça que procura ou informe a referência que você viu no Instagram, anúncio ou atendimento. A disponibilidade, tamanhos e detalhes são confirmados diretamente pela equipe Valutin.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map((item) => {
                const active = item.id === category;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectCategory(item.id)}
                    className={`rounded-2xl border p-5 text-left transition-all duration-200 ${
                      active
                        ? "border-brand bg-white shadow-sm"
                        : "border-ink/10 bg-white/55 hover:border-brand/45 hover:bg-white"
                    }`}
                  >
                    <span className="block font-playfair text-2xl text-ink">
                      {item.label}
                    </span>
                    <span className="mt-2 block font-poppins text-[12px] leading-5 text-ink/55">
                      {item.description}
                    </span>
                    <span
                      className={`mt-4 inline-block font-poppins text-[10px] uppercase tracking-[0.15em] ${
                        active ? "text-brand" : "text-ink/35"
                      }`}
                    >
                      {active ? "Selecionado" : "Selecionar"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[28px] border border-brand/10 bg-white p-6 shadow-[0_24px_70px_rgba(34,34,34,0.08)] md:p-8">
            <p className="font-poppins text-[10px] uppercase tracking-[0.18em] text-brand">
              Atendimento por referência
            </p>
            <h3 className="mt-3 font-playfair text-3xl italic leading-tight text-ink">
              Já viu uma peça específica?
            </h3>
            <p className="mt-3 font-poppins text-[13px] leading-6 text-ink/60">
              Digite a referência da peça. Se você não tiver a referência, pode seguir sem preencher — a equipe fará a curadoria pelo seu interesse.
            </p>

            <label
              htmlFor="catalog-reference"
              className="mt-7 block font-poppins text-[11px] font-medium uppercase tracking-[0.12em] text-ink/55"
            >
              Referência da peça
            </label>
            <input
              id="catalog-reference"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="Ex.: VLT-C5AH9L"
              autoComplete="off"
              className="mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 font-poppins text-[14px] uppercase tracking-[0.05em] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
            />

            <div className="mt-6 rounded-2xl bg-cream/70 p-5">
              <p className="font-poppins text-[10px] uppercase tracking-[0.14em] text-ink/45">
                Sua seleção
              </p>
              <p className="mt-2 font-playfair text-2xl text-ink">
                {selectedCategory.label}
              </p>
              {normalizedReference ? (
                <p className="mt-1 font-poppins text-[12px] text-brand">
                  Ref. {normalizedReference}
                </p>
              ) : (
                <p className="mt-1 font-poppins text-[12px] text-ink/45">
                  Sem referência específica
                </p>
              )}
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsappClick}
              className="mt-6 flex w-full items-center justify-center rounded-full bg-brand px-6 py-4 font-poppins text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand/90 hover:shadow-lg"
            >
              Ver opções no WhatsApp
            </a>

            <p className="mt-4 text-center font-poppins text-[10px] leading-5 text-ink/45">
              Atendimento exclusivo ao consumidor final. Não trabalhamos com atacado ou revenda.
            </p>
          </aside>
        </div>

        <div className="mt-14 grid gap-6 border-t border-brand/10 pt-8 md:grid-cols-3">
          {[
            ["01", "Escolha", "Selecione para quem ou para qual ocasião você está procurando."],
            ["02", "Informe a referência", "Se viu uma peça específica, envie o código VLT junto com a solicitação."],
            ["03", "Receba a curadoria", "A equipe confirma opções, tamanhos e disponibilidade antes de você decidir."],
          ].map(([number, title, body]) => (
            <div key={number} className="flex gap-4">
              <span className="font-playfair text-2xl italic text-brand/70">{number}</span>
              <div>
                <p className="font-poppins text-[12px] font-semibold uppercase tracking-[0.08em] text-ink">
                  {title}
                </p>
                <p className="mt-1 font-poppins text-[12px] leading-5 text-ink/55">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
