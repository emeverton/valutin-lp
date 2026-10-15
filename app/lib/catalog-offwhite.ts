import replacements from "./catalog-offwhite.json";

const photos: Record<string, string> = replacements;

export function offwhitePhoto(src: string): string {
  return photos[src] ?? src;
}

export function applyOffwhitePhotos<T extends { displayImages: string[] }>(products: T[]): T[] {
  return products.map((product) => ({ ...product, displayImages: product.displayImages.map(offwhitePhoto) }));
}
