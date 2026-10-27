"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PageContent } from "../lib/editor/content";
import { heroPortraits, nextPortrait } from "../lib/hero-slideshow";
import styles from "./SpringSummerHero.module.css";

const poster = "/media/valutin-spring-summer-carousel-poster.jpg";

export default function SpringSummerHero({ content }: { content: PageContent }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [portrait, setPortrait] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const showingPhotos = portrait >= 0 || !content.heroVideo;
  const currentPortrait = Math.max(0, portrait);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      setMotionAllowed(!preference.matches);
      if (preference.matches) setPortrait((current) => Math.max(0, current));
    };
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncMotion();
    syncVisibility();
    preference.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      preference.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !motionAllowed) return;
    if (showingPhotos || paused || !pageVisible) { element.pause(); return; }
    let cancelled = false;
    void element.play().catch(() => {
      if (!cancelled && !document.hidden) setPortrait(0);
    });
    return () => { cancelled = true; };
  }, [motionAllowed, paused, pageVisible, showingPhotos]);

  useEffect(() => {
    if (!showingPhotos || paused || !motionAllowed || !pageVisible) return;
    const timer = window.setTimeout(() => setPortrait(nextPortrait(currentPortrait)), 5000);
    return () => window.clearTimeout(timer);
  }, [currentPortrait, showingPhotos, paused, motionAllowed, pageVisible]);

  function navigate(direction: number) {
    setPortrait(nextPortrait(showingPhotos ? currentPortrait : direction > 0 ? -1 : 0, direction));
  }

  return (
    <section aria-label="Coleção Primavera–Verão Valutin" aria-roledescription="carrossel" className={`${styles.hero} ${showingPhotos ? styles.photosActive : ""}`}>
      <div className={styles.intro} aria-hidden={showingPhotos}>
        <Image src={content.heroPoster || poster} alt="" fill priority unoptimized sizes="100vw" className="object-cover object-center" />
        {motionAllowed && content.heroVideo && (
          <video ref={videoRef} autoPlay muted playsInline preload="metadata" poster={content.heroPoster || poster} aria-hidden="true"
            onPlaying={() => setVideoPlaying(true)} onPause={() => setVideoPlaying(false)} onEnded={() => setPortrait(0)} onError={() => setPortrait(0)}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300 ${videoPlaying ? "opacity-100" : "opacity-0"}`}>
            <source src={content.heroVideo} type="video/mp4" />
          </video>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#13273a]/85 via-[#13273a]/45 to-[#13273a]/10" />
      </div>
      <div className={styles.portraits} aria-hidden={!showingPhotos}>
        {heroPortraits.map((photo, index) => {
          const companion = heroPortraits[nextPortrait(index)];
          return <div key={photo.src} aria-hidden={index !== currentPortrait} className={`${styles.portrait} ${index === currentPortrait ? styles.active : ""}`}>
            <div className={styles.photoFrame}><Image src={photo.src} alt={photo.alt} fill unoptimized sizes="(max-width: 767px) 100vw, 36vw" loading={index < 2 ? "eager" : "lazy"} className={styles.photo} /></div>
            <div className={`${styles.photoFrame} ${styles.companion}`}><Image src={companion.src} alt={companion.alt} fill unoptimized sizes="36vw" className={styles.photo} /></div>
          </div>;
        })}
      </div>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{content.heroEyebrow}</p>
        <h1 className={styles.title}>{showingPhotos ? "A delicadeza de ser criança." : content.heroTitle}</h1>
        <p className={styles.description}>{showingPhotos ? "Bordados, cores suaves e sorrisos que vestem a infância." : content.heroDescription}</p>
        <a href={content.heroCtaHref} className={styles.cta}>{showingPhotos ? "Conheça a coleção" : content.heroCta} <span aria-hidden="true">→</span></a>
      </div>
      <div className={styles.controls}>
        <div className={styles.arrows}>
          <button type="button" onClick={() => navigate(-1)} aria-label="Foto anterior">←</button>
          <button type="button" onClick={() => navigate(1)} aria-label="Próxima foto">→</button>
          {motionAllowed && <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Retomar apresentação" : "Pausar apresentação"} aria-pressed={paused}>{paused ? "▶" : "Ⅱ"}</button>}
        </div>
        <span className={styles.counter} aria-live={paused || !motionAllowed ? "polite" : "off"}>{showingPhotos ? `${String(currentPortrait + 1).padStart(2, "0")} / ${String(heroPortraits.length).padStart(2, "0")}` : "Filme da coleção"}</span>
      </div>
    </section>
  );
}
