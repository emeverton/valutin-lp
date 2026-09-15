"use client";
import {useRef, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {trackFunnel} from '../lib/funnel';
import {appendAttrFromSearch} from '../lib/whatsapp/attr-merge';
import products from '../lib/catalog.json';
const money = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});

function ProductCard({product}:{product:typeof products[number]}) {
  const [photo, setPhoto] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const label = product.imageLabels[photo];
  const text = `Olá! Gostaria de consultar ${product.title}, opção ${label}, os tamanhos e a disponibilidade.`;
  const params = new URLSearchParams({src:'catalogo', produto:product.handle, text});
  if (typeof window !== 'undefined') appendAttrFromSearch(params, window.location.search);
  function movePhoto(step:number) {
    setPhoto(current => (current + step + product.images.length) % product.images.length);
    setZoomed(false);
  }
  return <article id={product.handle} className="min-w-0 scroll-mt-32">
    <button type="button" onClick={() => {setZoomed(false); setIsOpen(true); dialog.current?.showModal();}} aria-label={`Ampliar ${product.title}: ${label}`} className="group relative block aspect-[4/5] w-full overflow-hidden rounded-sm bg-cream">
      <Image src={product.displayImages[photo]} alt={`${product.title} — ${label}`} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" className="object-contain"/>
      <span className="absolute bottom-3 right-3 rounded-full border border-brand bg-cream px-3 py-2 font-poppins text-xs text-brand-strong">Ampliar ↗</span>
    </button>
    <div className="mt-3 flex flex-wrap gap-2" aria-label={`Fotos de ${product.title}`}>
      {product.images.map((src, i) => <button key={src} type="button" aria-label={`Ver ${product.imageLabels[i]} de ${product.title}`} aria-pressed={photo===i} onClick={() => setPhoto(i)} className={`relative h-12 w-12 overflow-hidden rounded border-2 ${photo===i?'border-brand-strong':'border-transparent'}`}>
        <Image src={product.displayImages[i]} alt="" fill sizes="48px" className="object-contain"/>
      </button>)}
    </div>
    <p aria-live="polite" className="mt-3 font-poppins text-xs text-brand-strong">{label} <span className="text-ink/60">· {photo+1}/{product.images.length}</span></p>
    <div className="pt-4">
      <p className="font-poppins text-[10px] uppercase tracking-widest text-brand-strong">{product.category==='bebe'?'Bebês':'Crianças'}</p>
      <h2 className="mt-2 font-playfair text-2xl">{product.title}</h2>
      <p className="mt-2 font-poppins text-sm text-ink/80">{money.format(product.price)} <span className="text-xs text-ink/65">· referência</span></p>
      <p className="mt-3 font-poppins text-xs leading-relaxed text-ink/65">{product.description}</p>
      <p className="mt-3 font-poppins text-xs leading-relaxed">Tamanhos: {product.sizes.map(s=>s.replace('M',' meses').replace('A',' anos')).join(' · ')}</p>
      <p className="mt-3 font-poppins text-xs text-ink/65">Disponibilidade e valor atual confirmados pela equipe.</p>
      <Link onClick={()=>trackFunnel('vlt_product_select')} href={`/atendimento?${params}`} className="mt-5 inline-flex min-h-12 items-center rounded-full border border-brand-strong px-5 py-3 font-poppins text-xs text-brand-strong transition hover:bg-brand-strong hover:text-white">Consultar esta opção no WhatsApp →</Link>
    </div>
    <dialog ref={dialog} aria-label={`Fotos ampliadas de ${product.title}`} onClose={()=>{setZoomed(false);setIsOpen(false);}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();movePhoto(1);} if(e.key==='ArrowLeft'){e.preventDefault();movePhoto(-1);}}} className="m-auto max-h-[94dvh] w-[calc(100%-1rem)] max-w-4xl rounded-lg bg-cream p-4 text-ink backdrop:bg-black/60 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-playfair text-xl">{product.title}</h3>
        <button type="button" autoFocus onClick={()=>dialog.current?.close()} className="min-h-11 rounded-full border border-brand px-4 text-sm text-brand-strong">Fechar ✕</button>
      </div>
      {isOpen && <div className="mt-4 max-h-[65dvh] overflow-auto rounded bg-cream">
        <button type="button" aria-label={zoomed?'Reduzir foto':'Ampliar detalhes da foto'} aria-pressed={zoomed} onClick={()=>setZoomed(!zoomed)} className={`block ${zoomed?'w-[180%] max-w-none cursor-zoom-out':'w-full cursor-zoom-in'}`}>
          {/* Original-resolution asset keeps small embroidery details available on zoom. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images[photo]} alt={`${product.title} — ${label}`} className={zoomed?'h-auto w-full':'mx-auto max-h-[65dvh] w-auto max-w-full'}/>
        </button>
      </div>}
      <div className="mt-4 flex items-center justify-between gap-2 text-xs sm:text-sm">
        <button type="button" onClick={()=>movePhoto(-1)} className="min-h-11 rounded-full border border-brand px-3 text-brand-strong">← Anterior</button>
        <p aria-live="polite" className="text-center">{label} · {photo+1}/{product.images.length}</p>
        <button type="button" onClick={()=>movePhoto(1)} className="min-h-11 rounded-full border border-brand px-3 text-brand-strong">Próxima →</button>
      </div>
      <p className="mt-3 text-center text-xs text-ink/65">Toque na foto para ampliar os detalhes. Use as setas para navegar e Esc para fechar.</p>
    </dialog>
  </article>;
}

export default function Catalog() {
  const [category,setCategory] = useState('todos');
  const visible = products.filter(p=>category==='todos'||p.category===category);
  return <section aria-label="Peças do catálogo" className="mx-auto max-w-6xl px-5 pb-20">
    <div className="mb-8 flex flex-wrap gap-3" aria-label="Filtrar catálogo">{[['todos','Todas as peças'],['bebe','Bebês'],['crianca','Crianças']].map(([id,label])=><button key={id} type="button" onClick={()=>setCategory(id)} aria-pressed={category===id} className={`rounded-full border px-5 py-3 font-poppins text-xs ${category===id?'border-brand-strong bg-brand-strong text-white':'border-ink/20 bg-white text-ink'}`}>{label}</button>)}</div>
    <p role="status" className="mb-6 font-poppins text-xs text-ink/60">{visible.length} peças para explorar · Toque nas fotos para ver os detalhes.</p>
    <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{visible.map(p=><ProductCard key={p.handle} product={p}/>)}</div>
    <Link href="/" className="mt-14 inline-flex min-h-12 items-center text-sm text-brand-strong underline underline-offset-4">← Voltar à página principal da Valutin</Link>
  </section>;
}
