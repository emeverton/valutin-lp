import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "../../components/AnnouncementBar";
import Footer from "../../components/Footer";
import GtmSnippet from "../../components/GtmSnippet";
import Header from "../../components/Header";
import ProductDetail from "../../components/ProductDetail";
import { getCatalogProducts } from "../../lib/editor/catalog-store";
import { categoryHref, productCategoryTrail, productForCategory } from "../../lib/catalog-navigation";

const siteUrl = "https://www.valutin.com.br";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = (await getCatalogProducts()).find((item) => item.handle === params.handle);
  if (!product) return {};
  const title = `${product.title} | Valutin`;
  const url = `/catalogo/${product.handle}`;
  const image = { url: product.displayImages[0], alt: product.title };
  return {
    title,
    description: product.description,
    alternates: { canonical: url },
    openGraph: { title, description: product.description, url, type: "website", images: [image] },
    twitter: { card: "summary_large_image", title, description: product.description, images: [image.url] },
  };
}
export default async function ProductPage({ params, searchParams }: { params: { handle: string }; searchParams?: { categoria?: string } }) {
  const sourceProduct = (await getCatalogProducts()).find((item) => item.handle === params.handle);
  if (!sourceProduct) notFound();
  const product = productForCategory(sourceProduct, searchParams?.categoria);
  const url = `${siteUrl}/catalogo/${product.handle}`;
  const categoryTrail = productCategoryTrail(product, searchParams?.categoria);
  const breadcrumbItems = [
    { name: "Início", url: `${siteUrl}/` },
    { name: "Catálogo", url: `${siteUrl}/catalogo` },
    ...categoryTrail.map((item) => ({ name: item.label, url: `${siteUrl}${categoryHref(item.slug)}` })),
    { name: product.title, url },
  ];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.title,
        description: product.description,
        image: product.displayImages.map((path) => new URL(path, siteUrl).href),
        brand: { "@type": "Brand", name: "Valutin" },
        ...(typeof product.price === "number" ? { offers: { "@type": "Offer", url, priceCurrency: "BRL", price: product.price } } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: breadcrumbItems.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.url })),
      },
    ],
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <a href="#main-content" className="skip-link">Pular para o conteúdo</a><GtmSnippet/><AnnouncementBar/><Header/><main id="main-content" tabIndex={-1} className="pt-[142px]"><ProductDetail product={product} categoryTrail={categoryTrail}/></main><Footer/>
  </>;
}
