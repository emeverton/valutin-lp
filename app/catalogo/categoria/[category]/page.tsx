import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import AnnouncementBar from "../../../components/AnnouncementBar";
import Catalog from "../../../components/Catalog";
import DepartmentSelection from "../../../components/DepartmentSelection";
import Footer from "../../../components/Footer";
import GtmSnippet from "../../../components/GtmSnippet";
import Header from "../../../components/Header";
import { getCatalogProducts } from "../../../lib/editor/catalog-store";
import { babyCategories, babySections, childrenCategories, childrenSections, selectionSections, departmentCategories, categoryAncestors, categoryHref, categoryLabel, isCatalogCategory, matchesCatalogCategory, productHref } from "../../../lib/catalog-navigation";

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
  const dollExamples = params.category === "crianca-meninas-vestidos-de-boneca"
    ? categoryProducts.flatMap((product) => {
        const index = product.images.findIndex((image) => image.endsWith("-na-boneca.jpg"));
        return index < 0 ? [] : [{ handle: product.handle, title: product.title, image: product.displayImages[index], alt: product.imageLabels[index] }];
      })
    : [];
  const ancestors = categoryAncestors(params.category);
  const selectionLanding = params.category === "bebe" || params.category === "crianca" || selectionSections.some((item) => item.slug === params.category);
  const selectionDepartment = params.category === "crianca" || params.category.startsWith("crianca-") ? "crianca" : "bebe";
  const sections = selectionDepartment === "bebe" ? babySections : childrenSections;
  const categories = selectionDepartment === "bebe" ? babyCategories : childrenCategories;
  const categoryLinks = params.category === selectionDepartment ? [...sections, ...departmentCategories.filter((item) => params.category === "crianca" && item.slug === "banho-crianca")] : categories.filter((item) => item.parent === params.category);
  const listing = selectionLanding ? categoryLinks.map((item) => ({ name: item.label, url: `${siteUrl}${categoryHref(item.slug)}` })) : categoryProducts.map((product) => ({ name: product.title, url: `${siteUrl}/catalogo/${product.handle}` }));
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
      { "@type": "ItemList", "@id": `${url}#products`, numberOfItems: listing.length, itemListElement: listing.map((item, index) => ({
        "@type": "ListItem", position: index + 1, name: item.name, url: item.url,
      })) },
    ],
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <a href="#main-content" className="skip-link">Pular para o conteúdo</a><GtmSnippet/><AnnouncementBar/><Header fromCatalog={!selectionLanding}/>
    <main id="main-content" tabIndex={-1} className="pt-[142px]">
      {selectionLanding ? <DepartmentSelection section={params.category} department={selectionDepartment}/> : <Catalog initialCategory={params.category} heading={label} />}
      {dollExamples.length > 0 && <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-7" aria-labelledby="doll-examples-title">
        <h2 id="doll-examples-title" className="mb-5 font-playfair text-3xl">Veja os vestidos na boneca</h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {dollExamples.map((example) => <Link key={example.handle} href={productHref(example.handle, params.category)} className="group block">
            <div className="catalog-product-surface relative aspect-[3/4]">
              <Image src={example.image} alt={example.alt} fill sizes="(max-width: 768px) 50vw, 360px" className="object-contain" />
            </div>
            <span className="mt-3 block font-poppins text-sm underline underline-offset-4 group-hover:text-brand-strong">{example.title}</span>
          </Link>)}
        </div>
      </section>}
    </main>
    <Footer/>
  </>;
}
