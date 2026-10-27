import type { CompositionItem } from "../lib/catalog-composition";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function CompositionPrices({ items, detailed = false }: { items: readonly CompositionItem[]; detailed?: boolean }) {
  return <dl aria-label="Preços das peças vendidas separadamente" className={`mt-3 divide-y divide-ink/10 font-poppins ${detailed ? "text-sm" : "text-[11px]"}`}>
    {items.map((item) => <div key={item.reference} className="py-3">
      <div className="flex items-start justify-between gap-2"><dt className="leading-relaxed text-ink">{item.title}</dt><dd className="shrink-0 whitespace-nowrap font-medium text-ink">{money.format(item.price)}</dd></div>
      <dd className={`mt-1 leading-relaxed text-ink/60 ${detailed ? "text-xs" : "text-[9px]"}`}>{item.reference}<br />{item.sizes.join(" · ")}</dd>
    </div>)}
  </dl>;
}
