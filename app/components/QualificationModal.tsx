"use client";
import { useEffect, useRef, useState } from "react";
import { RETAIL_ONLY_COPY, STEP1_OPTIONS, STEP2_OPTIONS, STEP3_OPTIONS } from "../lib/constants";
import { isBlockedWholesale } from "../lib/whatsapp/classifier";
import { trackFunnel, trackConfirmedLead } from "../lib/funnel";
import { ATTR_KEYS } from "../lib/whatsapp/config";
import { resolveBrowserIdsFromDocument } from "../lib/whatsapp/browser-ids";

export default function QualificationModal({isOpen,onClose,inline=false}:{isOpen:boolean;onClose:()=>void;inline?:boolean}) {
  const [form,setForm]=useState({nome:"",whatsapp:"",para_quem:"",ocasiao:"",investimento:"",consumidorFinal:false});
  const [loading,setLoading]=useState(false);
  const [blockReason,setBlockReason]=useState("");
  const intakeEventId=useRef("");
  const submitting=useRef(false);
  const formStarted=useRef(false);
  const firstInput=useRef<HTMLInputElement>(null);
  useEffect(()=>{if(!isOpen || inline)return;const prior=document.activeElement as HTMLElement;firstInput.current?.focus();const handler=(e:KeyboardEvent)=>{if(e.key==="Escape"&&!submitting.current)onClose();};window.addEventListener("keydown",handler);return()=>{window.removeEventListener("keydown",handler);prior?.focus();};},[isOpen,inline,onClose]);
  async function handleSubmit() {
    if (submitting.current || !canSubmit) return;
    const intent = [form.nome, form.para_quem, form.ocasiao, form.investimento].join(" ");
    const hits = isBlockedWholesale(intent);
    if (hits.length || !form.consumidorFinal) {
      setBlockReason(RETAIL_ONLY_COPY.blocked);
      return;
    }
    trackFunnel("vlt_form_submit");
    setLoading(true);
    submitting.current = true;
    if (!intakeEventId.current) intakeEventId.current = `vl_form_${crypto.randomUUID()}`;
    try {
      const query = new URLSearchParams(window.location.search);
      const attribution = Object.fromEntries(ATTR_KEYS.flatMap((key) => query.get(key) ? [[key, query.get(key)]] : []));
      const browserIds = resolveBrowserIdsFromDocument(query.get("fbclid") || attribution.fbclid || undefined);
      const res = await fetch("/api/atendimento/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...attribution,
          ...browserIds,
          event_id: intakeEventId.current,
          nome: form.nome,
          whatsapp: form.whatsapp,
          para_quem: form.para_quem,
          ocasiao: form.ocasiao,
          investimento: form.investimento,
          origem: query.get("produto") ? "LP_CATALOGO" : "LP_FORM",
          produto: query.get("produto") || undefined,
          sku: query.get("sku") || undefined,
          consumidor_final: true,
          retail_confirmed: true,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.ok !== true) throw new Error("intake_unavailable");
      if (json.blocked || !json.retail_confirmed) {
        setBlockReason(RETAIL_ONLY_COPY.blocked);
        setLoading(false);
        return;
      }
      if (json.event_id) await trackConfirmedLead(String(json.event_id));
    } catch {
      trackFunnel("vlt_form_error");
      setBlockReason("Não foi possível confirmar seu atendimento. Tente novamente em instantes.");
      setLoading(false);
      return;
    } finally {
      submitting.current = false;
    }
    window.location.href = "/wa" + (window.location.search || "");

  }

  const canSubmit =
    form.nome.trim().length >= 2 &&
    form.whatsapp.replace(/\D/g, "").length >= 10 &&
    form.whatsapp.replace(/\D/g, "").length <= 15 &&
    form.consumidorFinal &&
    !isBlockedWholesale([form.nome, form.para_quem, form.ocasiao, form.investimento].join(" ")).length;

  if(!isOpen)return null;
  const fields=<form onFocusCapture={()=>{if(!formStarted.current){formStarted.current=true;trackFunnel("vlt_form_start");}}} onSubmit={(e)=>{e.preventDefault();void handleSubmit();}} className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-2">
      <div><label htmlFor="contact-name" className="mb-2 block text-sm">Seu nome</label><input ref={firstInput} id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={100} value={form.nome} onChange={e=>{setBlockReason("");setForm({...form,nome:e.target.value});}} className="w-full rounded-xl border border-ink/25 bg-white px-4 py-3 focus:outline-brand" /></div>
      <div><label htmlFor="contact-phone" className="mb-2 block text-sm">WhatsApp com DDD</label><input id="contact-phone" name="tel" type="tel" inputMode="tel" autoComplete="tel" required aria-describedby="phone-help" placeholder="(11) 99999-9999" maxLength={20} value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value.replace(/[^0-9+() -]/g,"")})} className="w-full rounded-xl border border-ink/25 bg-white px-4 py-3 focus:outline-brand" /><p id="phone-help" className="mt-2 text-xs text-ink/65">Inclua o DDD. Exemplo: (11) 99999-9999.</p></div>
    </div>
    <details className="rounded-xl border border-brand/25 p-4">
      <summary className="cursor-pointer text-sm text-ink/80">Quer adiantar suas preferências? <span className="text-ink/65">Opcional</span></summary>
      <div className="mt-4 grid gap-4">
        {([{key:"para_quem",label:"Para quem você está buscando?",options:STEP1_OPTIONS},{key:"ocasiao",label:"Qual é a ocasião?",options:STEP2_OPTIONS},{key:"investimento",label:"Faixa de investimento",options:STEP3_OPTIONS}] as const).map(field=><div key={field.key}><label htmlFor={field.key} className="mb-1 block text-xs">{field.label}</label><select id={field.key} value={form[field.key]} onChange={e=>setForm({...form,[field.key]:e.target.value})} className="w-full rounded-lg border border-ink/20 bg-white p-3 text-sm"><option value="">Prefiro conversar com a equipe</option>{field.options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>)}
      </div>
    </details>
    <label className="flex items-start gap-3 text-xs leading-relaxed"><input type="checkbox" required checked={form.consumidorFinal} onChange={e=>{setBlockReason("");setForm({...form,consumidorFinal:e.target.checked});}} className="mt-1 h-4 w-4 shrink-0 accent-[#526c87]"/><span>Busco peças para uso próprio, da minha família ou para presentear. Não procuro atacado ou revenda.</span></label>
    <p className="text-xs leading-relaxed text-ink/65">Usaremos seu nome e telefone para organizar e dar continuidade ao atendimento solicitado pelo WhatsApp.</p>
    {blockReason&&<p role="alert" className="text-sm text-red-700">{blockReason}</p>}
    <button type="submit" disabled={!canSubmit||loading} className="w-full rounded-full bg-[#526c87] px-5 py-4 text-sm font-medium text-white transition hover:bg-[#40566e] disabled:opacity-45">{loading?"Preparando seu atendimento…":"Continuar para o WhatsApp →"}</button>
    <p className="text-center text-xs text-ink/65">Seg–Sex, 10h às 19h · Sábado, 10h às 17h</p>
  </form>;
  if(inline)return fields;
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"><section role="dialog" aria-modal="true" aria-label="Atendimento Valutin" className="max-h-[90svh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6"><button onClick={onClose} disabled={loading} className="mb-4 block ml-auto text-sm">Fechar</button>{fields}</section></div>;
}
