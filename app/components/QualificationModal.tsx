"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  STEP1_OPTIONS,
  STEP2_OPTIONS,
  STEP3_OPTIONS,
  WEBHOOK_URL,
  WHATSAPP_URL,
  buildWhatsAppMessage,
} from "../lib/constants";
import type { Step1Value, Step2Value, Step3Value, StepOption } from "../lib/constants";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  para_quem: Step1Value | "";
  ocasiao: Step2Value | "";
  investimento: Step3Value | "";
  nome: string;
  whatsapp: string;
}

const EMPTY_FORM: FormData = {
  para_quem: "",
  ocasiao: "",
  investimento: "",
  nome: "",
  whatsapp: "",
};

function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function OptionCard<T extends string>({
  option,
  selected,
  onClick,
}: {
  option: StepOption<T>;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left font-poppins text-sm font-medium transition-all duration-200 ${
        selected
          ? "border-brand bg-brand/5 text-ink"
          : "border-brand-light bg-white hover:border-brand text-ink"
      }`}
    >
      <span className="text-2xl">{option.emoji}</span>
      <span>{option.label}</span>
    </button>
  );
}

const SLIDE = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.22 },
};

export default function QualificationModal({ isOpen, onClose }: ModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  function reset() {
    setStep(1);
    setForm(EMPTY_FORM);
    setLoading(false);
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 400);
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          whatsapp: form.whatsapp,
          para_quem: form.para_quem,
          ocasiao: form.ocasiao,
          investimento: form.investimento,
          origem: "LP",
        }),
      });
    } catch {
      // Best-effort — redirect to WhatsApp regardless
    }
    const msg = encodeURIComponent(
      buildWhatsAppMessage(form.nome, form.para_quem, form.ocasiao, form.investimento)
    );
    window.open(`${WHATSAPP_URL}?text=${msg}`, "_blank");
    handleClose();
  }

  const canSubmit =
    form.nome.trim().length >= 2 && form.whatsapp.replace(/\D/g, "").length >= 10;

  const progress = (step / 4) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="h-1 bg-gray-100">
              <motion.div
                className="h-full bg-brand"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>

            <button
              onClick={handleClose}
              aria-label="Fechar"
              className="absolute top-6 right-8 font-poppins text-[11px] uppercase tracking-[0.2em] text-brand-light hover:text-brand transition-colors duration-200"
            >
              FECHAR
            </button>

            <div className="p-8">
              <p className="font-poppins text-xs text-gray-400 mb-3">Etapa {step} de 4</p>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" {...SLIDE}>
                    <h2 className="font-playfair text-2xl text-ink mb-6">
                      Para quem você está buscando?
                    </h2>
                    <div className="flex flex-col gap-3">
                      {STEP1_OPTIONS.map((opt) => (
                        <OptionCard
                          key={opt.value}
                          option={opt}
                          selected={form.para_quem === opt.value}
                          onClick={() => {
                            setForm((f) => ({ ...f, para_quem: opt.value }));
                            setTimeout(() => setStep(2), 280);
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" {...SLIDE}>
                    <h2 className="font-playfair text-2xl text-ink mb-6">Qual é a ocasião?</h2>
                    <div className="flex flex-col gap-3">
                      {STEP2_OPTIONS.map((opt) => (
                        <OptionCard
                          key={opt.value}
                          option={opt}
                          selected={form.ocasiao === opt.value}
                          onClick={() => {
                            setForm((f) => ({ ...f, ocasiao: opt.value }));
                            setTimeout(() => setStep(3), 280);
                          }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="mt-4 font-poppins text-xs text-gray-400 hover:text-ink transition-colors"
                    >
                      ← Voltar
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" {...SLIDE}>
                    <h2 className="font-playfair text-2xl text-ink mb-6">
                      Qual sua faixa de investimento?
                    </h2>
                    <div className="flex flex-col gap-3">
                      {STEP3_OPTIONS.map((opt) => (
                        <OptionCard
                          key={opt.value}
                          option={opt}
                          selected={form.investimento === opt.value}
                          onClick={() => {
                            setForm((f) => ({ ...f, investimento: opt.value }));
                            setTimeout(() => setStep(4), 280);
                          }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="mt-4 font-poppins text-xs text-gray-400 hover:text-ink transition-colors"
                    >
                      ← Voltar
                    </button>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="s4" {...SLIDE}>
                    <h2 className="font-playfair text-2xl text-ink mb-1">Quase lá!</h2>
                    <p className="font-poppins text-sm text-gray-500 mb-6">
                      Como podemos te chamar?
                    </p>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block font-poppins text-xs text-gray-500 mb-1">
                          Nome
                        </label>
                        <input
                          type="text"
                          placeholder="Seu nome"
                          value={form.nome}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, nome: e.target.value }))
                          }
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-poppins text-sm focus:border-brand focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block font-poppins text-xs text-gray-500 mb-1">
                          WhatsApp
                        </label>
                        <input
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={form.whatsapp}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              whatsapp: formatWhatsApp(e.target.value),
                            }))
                          }
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-poppins text-sm focus:border-brand focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || loading}
                      className="mt-6 w-full flex items-center justify-center py-4 rounded-full bg-brand text-white font-poppins text-[15px] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all duration-200"
                    >
                      {loading ? "Enviando..." : "Falar com a equipe →"}
                    </button>

                    <button
                      onClick={() => setStep(3)}
                      className="mt-3 w-full text-center font-poppins text-xs text-gray-400 hover:text-ink transition-colors"
                    >
                      ← Voltar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
