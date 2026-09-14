"use client";

import { useState } from "react";
import AnnouncementBar from "./components/AnnouncementBar";
import CatalogoAssistido from "./components/CatalogoAssistido";
import ComoChegar from "./components/ComoChegar";
import Consultoria from "./components/Consultoria";
import Depoimentos from "./components/Depoimentos";
import Diferenciais from "./components/Diferenciais";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import QualificationModal from "./components/QualificationModal";
import Video from "./components/Video";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  function scrollToCatalogo() {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <AnnouncementBar />
      <Header
        onOpenModal={() => setModalOpen(true)}
        onCatalogClick={scrollToCatalogo}
      />
      <main>
        <Hero
          onCtaClick={() => setModalOpen(true)}
          onCatalogClick={scrollToCatalogo}
        />
        <Manifesto />
        <Video />
        <Consultoria onCtaClick={() => setModalOpen(true)} />
        <CatalogoAssistido />
        <Diferenciais onOpenModal={() => setModalOpen(true)} />
        <Depoimentos />
        <div id="como-chegar">
          <ComoChegar />
        </div>
      </main>
      <Footer />
      <QualificationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
