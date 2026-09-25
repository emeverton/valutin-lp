import type { Metadata } from "next";
import AnnouncementBar from "../../components/AnnouncementBar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import GtmSnippet from "../../components/GtmSnippet";
import SpringSummerSecondFold from "../../components/SpringSummerSecondFold";
import SpringSummerProductShelf from "../../components/SpringSummerProductShelf";
import SpringSummerEditorial from "../../components/SpringSummerEditorial";
import SpringSummerStoreVisit from "../../components/SpringSummerStoreVisit";
import SpringSummerCategoryStories from "../../components/SpringSummerCategoryStories";
import SpringSummerConcierge from "../../components/SpringSummerConcierge";
import SpringSummerHero from "../../components/SpringSummerHero";
import { categoryHref, productCategories, productHref } from "../../lib/catalog-navigation";
import { catalogProducts } from "../../lib/catalog-individual";
import { springSummerSourceHandles } from "../../lib/seasonal";

const seasonalHandles = new Set<string>(springSummerSourceHandles);
const seasonalProducts = catalogProducts.filter((product) => seasonalHandles.has(product.sourceHandle ?? product.handle));
const seasonalCategories = productCategories.filter((category) =>
  seasonalProducts.some((product) => product.catalogCategory === category.slug),
);

const pageUrl = "https://www.valutin.com.br/catalogo/primavera-verao";
const pageTitle = "Primavera Verão 2026/27 | Valutin";
const pageDescription = "Peças leves em algodão, linho e laise para bebês e crianças. Explore a seleção Primavera Verão da Valutin.";
const socialDescription = "Descubra a nova coleção Primavera Verão Valutin. Peças leves em algodão, linho e laise para acompanhar os dias mais especiais da infância.";
const socialImage = "/campaign-spring-summer-2026/collection-flatlay-desktop.jpg";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: socialDescription,
    url: pageUrl,
    siteName: "Valutin",
    locale: "pt_BR",
    type: "website",
    images: [{ url: socialImage, width: 1672, height: 941, alt: "Peças da coleção Primavera Verão Valutin" }],
  },
  twitter: { card: "summary_large_image", title: pageTitle, description: socialDescription, images: [socialImage] },
};

export default function SpringSummerPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        name: pageTitle,
        description: pageDescription,
        url: pageUrl,
        image: `https://www.valutin.com.br${socialImage}`,
        mainEntity: { "@id": `${pageUrl}#products` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: "https://www.valutin.com.br/" },
          { "@type": "ListItem", position: 2, name: "Catálogo", item: "https://www.valutin.com.br/catalogo" },
          { "@type": "ListItem", position: 3, name: "Primavera Verão", item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#products`,
        name: "Peças Primavera Verão Valutin",
        numberOfItems: seasonalProducts.length,
        itemListElement: seasonalProducts.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.title,
          url: `https://www.valutin.com.br${productHref(product.handle)}`,
        })),
      },
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
    <GtmSnippet />
    <AnnouncementBar />
    <Header />
    <main id="main-content" tabIndex={-1} className="bg-white pt-[100px] lg:pt-[142px]">
      <section aria-label="Coleção Primavera–Verão Valutin">
        <SpringSummerHero />
        <div id="destaques" className="scroll-mt-36"><SpringSummerSecondFold /></div>
        <SpringSummerProductShelf shelf="passeios" />
        <SpringSummerCategoryStories />
        <SpringSummerConcierge />
        <SpringSummerEditorial />
        <SpringSummerStoreVisit />
        <nav id="categorias" aria-label="Categorias das peças Primavera–Verão" className="mx-auto max-w-[1440px] border-t border-ink/15 px-4 pb-24 pt-10 sm:px-7 lg:px-10">
          <p className="font-poppins text-[10px] uppercase tracking-[0.2em] text-brand-strong">Continue no catálogo</p>
          <h2 className="mt-3 font-playfair text-3xl text-ink sm:text-4xl">Encontre sua peça por categoria</h2>
          <p className="mt-3 max-w-2xl font-poppins text-sm leading-relaxed text-ink/65">As peças desta coleção estão organizadas no catálogo Valutin, com cada cor e estampa em uma página individual.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {seasonalCategories.map((category) => <a key={category.slug} href={categoryHref(category.slug)} className="border border-ink/20 px-5 py-3 font-poppins text-xs text-ink transition hover:border-brand-strong hover:text-brand-strong">{category.label} →</a>)}
            <a href="/catalogo" className="border border-brand-strong bg-brand-strong px-5 py-3 font-poppins text-xs text-white transition hover:bg-white hover:text-brand-strong">Ver todas as categorias →</a>
          </div>
        </nav>
      </section>
    </main>
    <Footer />
  </>;
}
