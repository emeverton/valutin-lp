"use client";

import { useState } from "react";
import ComoChegar from "./components/ComoChegar";
import Consultoria from "./components/Consultoria";
import Depoimentos from "./components/Depoimentos";
import Diferenciais from "./components/Diferenciais";
import Footer from "./components/Footer";
import Galeria from "./components/Galeria";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import QualificationModal from "./components/QualificationModal";
import Video from "./components/Video";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Header />
      <main>
        <Hero onCtaClick={() => setModalOpen(true)} />
        <Manifesto />
        <Video />
        <Consultoria onCtaClick={() => setModalOpen(true)} />
        <Diferenciais />
        <Galeria />
        <Depoimentos />
        <ComoChegar />
      </main>
      <Footer />
      <QualificationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
