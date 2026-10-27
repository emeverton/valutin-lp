const directory = "/campaign-spring-summer-2026/portraits";
export const heroPortraits = [
  { src: `${directory}/vestido-xadrez-rosa.webp`, alt: "Vestido xadrez rosa com gola bordada, em retrato da coleção Valutin" },
  { src: `${directory}/camiseta-azul.webp`, alt: "Camiseta azul com veleiro e um sorriso de brincadeira" },
  { src: `${directory}/vestido-branco.webp`, alt: "Vestido branco com textura e delicados bordados na gola" },
  { src: `${directory}/camisa-linho.webp`, alt: "Camisa clara com gola e mangas dobradas, em retrato da coleção" },
  { src: `${directory}/vestido-xadrez-azul.webp`, alt: "Vestido xadrez azul com flores bordadas na gola" },
  { src: `${directory}/camiseta-branca.webp`, alt: "Camiseta branca com estampa de motocross, em retrato da coleção" },
  { src: `${directory}/vestido-amarelo.webp`, alt: "Vestido amarelo com babados e detalhes florais" },
] as const;

export function nextPortrait(current: number, direction = 1) {
  return ((current + direction) % heroPortraits.length + heroPortraits.length) % heroPortraits.length;
}
