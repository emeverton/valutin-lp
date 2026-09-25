"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { LOGO_SRC } from "@/app/lib/constants";
import "../dashboard/dashboard.css";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Senha inválida");
        setLoading(false);
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Falha de conexão");
      setLoading(false);
    }
  }

  return (
    <main className="dash-paper dash-noise relative flex min-h-screen items-center justify-center px-6 py-16">
      <div className="relative z-[1] w-full max-w-md">
        <div className="mb-12 text-center">
          <Image
            src={LOGO_SRC}
            alt="Valutin"
            width={180}
            height={54}
            className="mx-auto h-12 w-auto object-contain"
            priority
          />
          <h1 className="mt-10 font-playfair text-4xl tracking-tight text-ink">Performance</h1>
          <div className="mx-auto mt-4 h-px w-12 bg-brand" />
          <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-ink/45">
            Acesso restrito · painel executivo
          </p>
        </div>

        <form onSubmit={onSubmit} className="dash-surface px-8 py-9">
          <label className="block text-[10px] uppercase tracking-[0.18em] text-ink/50" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-3 w-full border-b border-ink/20 bg-transparent py-3 text-base outline-none focus:border-brand"
            placeholder="••••••••"
          />
          {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || !password}
            className="mt-8 w-full bg-ink px-4 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-brand disabled:opacity-40"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="dash-paper min-h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}
