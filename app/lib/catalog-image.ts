export function catalogImageClass(src: string, extra = "") {
  // Preserve the source photo's colors; no blend/filter effect is applied.
  const fit = src === "/catalog/camisa-jeans-azul-dame008ct.jpg" ? "object-cover" : "object-contain";
  return [fit, extra].filter(Boolean).join(" ");
}
