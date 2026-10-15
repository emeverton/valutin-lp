import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnnouncementBar from "../../../components/AnnouncementBar";
import Catalog from "../../../components/Catalog";
import Footer from "../../../components/Footer";
import GtmSnippet from "../../../components/GtmSnippet";
import Header from "../../../components/Header";
import { getCatalogProducts } from "../../../lib/editor/catalog-store";
import { catalogSubcategories, categoryHref, categoryLabel, isCatalogCategory, matchesCatalogCategory } from "../../../lib/catalog-navigation";

const siteUrl = "https://www.valutin.com.br";
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  if (!isCatalogCategory(params.category)) return {};
  const label = categoryLabel(params.category);
  const url = `/catalogo/categoria/${params.category}`;
  const description = `Explore ${label.toLocaleLowerCase("pt-BR")} no catálogo Valutin. Veja cada peça individualmente e consulte tamanhos e disponibilidade.`;
  return {
    title: `${label} | Catálogo Valutin`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${label} | Catálogo Valutin`, description, url, type: "website" },
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  if (!isCatalogCategory(params.category)) notFound();
  const label = categoryLabel(params.category);
  const url = `${siteUrl}/catalogo/categoria/${params.category}`;
  const categoryProducts = (await getCatalogProducts()).filter((product) => matchesCatalogCategory(product, params.category));
  const subcategory = catalogSubcategories.find((item) => item.slug === params.category);
  const ancestors = subcategory ? [subcategory.department, subcategory.parent] : params.category === "pijamas" ? ["crianca"] : [];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": `${url}#webpage`, name: `${label} | Catálogo Valutin`, url, mainEntity: { "@id": `${url}#products` } },
      { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Catálogo", item: `${siteUrl}/catalogo` },
        ...ancestors.map((slug, index) => ({ "@type": "ListItem", position: index + 3, name: categoryLabel(slug), item: `${siteUrl}${categoryHref(slug)}` })),
        { "@type": "ListItem", position: ancestors.length + 3, name: label, item: url },
      ] },
      { "@type": "ItemList", "@id": `${url}#products`, numberOfItems: categoryProducts.length, itemListElement: categoryProducts.map((product, index) => ({
        "@type": "ListItem", position: index + 1, name: product.title, url: `${siteUrl}/catalogo/${product.handle}`,
      })) },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><a href="#main-content" className="skip-link">Pular para o conteúdo</a><GtmSnippet/><AnnouncementBar/><Header fromCatalog/><main id="main-content" tabIndex={-1} className="pt-[142px]"><Catalog initialCategory={params.category} heading={label} /></main><Footer/></>;
}
