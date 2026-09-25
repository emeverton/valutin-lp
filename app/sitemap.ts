import type { MetadataRoute } from 'next';
import { catalogProducts as products } from './lib/catalog-individual';
import { categoryHref, departments, productCategories } from './lib/catalog-navigation';
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = 'https://www.valutin.com.br';
  return [
    { url:`${origin}/`, changeFrequency:'weekly', priority:1 },
    { url:`${origin}/catalogo`, changeFrequency:'weekly', priority:0.9 },
    { url:`${origin}/catalogo/primavera-verao`, changeFrequency:'weekly', priority:0.9 },
    { url:`${origin}/catalogo/todos`, changeFrequency:'weekly', priority:0.7 },
    ...['sobre-a-valutin', 'como-comprar', 'entregas-e-retirada', 'trocas-e-devolucoes', 'politica-de-privacidade', 'politica-de-cookies', 'termos-de-uso'].map((path) => ({ url: `${origin}/${path}`, changeFrequency: 'monthly' as const, priority: 0.4 })),
    ...[...departments, ...productCategories].map((category) => ({ url:`${origin}${categoryHref(category.slug)}`, changeFrequency:'weekly' as const, priority:0.8 })),
    ...products.map((product) => ({ url:`${origin}/catalogo/${product.handle}`, changeFrequency:'weekly' as const, priority:0.8 })),
  ];
}
