export const BRAND_NAME = "VALUTIN";
export const LOGO_SRC = "/logo-valutin.png";
export const GTM_ID = "GTM-5WWWR8FX";

export const VIDEO_YOUTUBE_ID = "OIclPAGWXNo";
export const VIDEO_LABEL = "NOSSA HISTÓRIA";
export const VIDEO_TITLE = "Conheça a Valutin.";

export const INSTAGRAM_URL = "https://www.instagram.com/valutin.infantil";
export const WHATSAPP_URL = "https://wa.me/5511915702555";
export const WHATSAPP_DISPLAY = "+55 11 91570-2555";
export const WEBHOOK_URL = "https://n8n.ehos.com.br/webhook/valutin-lead";

export const MAPS_DIR_URL =
  "https://www.google.com/maps/dir//R.+Jo%C3%A3o+Louren%C3%A7o,+323+-+Vila+Nova+Concei%C3%A7%C3%A3o,+S%C3%A3o+Paulo+-+SP,+04508-030";

export const MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.1!2d-46.6736!3d-23.5965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce577bcde48fc7%3A0x1!2sR.+Jo%C3%A3o+Louren%C3%A7o%2C+323+-+Vila+Nova+Concei%C3%A7%C3%A3o%2C+S%C3%A3o+Paulo+-+SP%2C+04508-030!5e0!3m2!1spt-BR!2sbr!4v1";

export const ADDRESS = {
  street: "Rua João Lourenço, 323",
  neighborhood: "Vila Nova Conceição, São Paulo – SP",
  hoursWeekdays: "Seg–Sex: 10h às 19h",
  hoursSaturday: "Sábado: 10h às 17h",
} as const;

export const COMO_CHEGAR_COPY = {
  label: "Venha nos visitar",
  online: "Ou prefere ser atendida online? Nossa equipe responde no WhatsApp.",
} as const;

export const HERO_IMAGE = "/hero.jpg";

export const HERO_COPY = {
  tag: "Moda Infantil · Desde 1998 · Vila Nova Conceição",
  h1: "Vestir a infância com leveza e sofisticação.",
  cta: "Atendimento consultivo gratuito",
  urgency: "Nossa equipe responde em até 2 horas · Seg–Sáb 10h–19h",
} as const;

export const MANIFESTO_COPY = {
  quote:
    "Acreditamos que a infância merece ser vivida com beleza. Cada peça que criamos carrega o cuidado de quem entende que vestir uma criança é também uma forma de amor.",
  attribution: "Família Valutin · São Paulo, 1998",
} as const;

export interface ConsultoriaServiceItem {
  title: string;
  body: string;
}

export const CONSULTORIA_COPY = {
  label: "Serviço exclusivo",
  title: "Uma consultora dedicada para encontrar o look perfeito.",
  body: "Seja para um batizado, uma ocasião especial ou simplesmente para renovar o guarda-roupa do seu filho, nossa equipe está pronta para guiar você com atenção e cuidado, online ou na loja.",
  cta: "Iniciar atendimento →",
} as const;

export const CONSULTORIA_ITEMS: ConsultoriaServiceItem[] = [
  { title: "Atendimento por WhatsApp", body: "resposta personalizada com curadoria de looks" },
  { title: "Visita à loja", body: "experiência completa na Vila Nova Conceição" },
  { title: "Para ocasiões especiais", body: "batizados, festas, primeira comunhão" },
];

export const CONSULTORIA_IMAGE =
  "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&q=80";

export const DEPOIMENTOS_TITLE = "O que as famílias dizem";

export interface Diferencial {
  number: string;
  title: string;
  body: string;
}

export const DIFERENCIAIS: Diferencial[] = [
  {
    number: "01",
    title: "Peças exclusivas",
    body: "Modelagem própria, sem reprodução em massa. Cada peça é pensada para ser única e durar.",
  },
  {
    number: "02",
    title: "Atendimento consultivo",
    body: "Nossa equipe ajuda a encontrar o look ideal para cada criança e cada ocasião especial.",
  },
  {
    number: "03",
    title: "Desde 1998",
    body: "25 anos vestindo a infância paulistana com sofisticação, cuidado e muito amor.",
  },
];

export interface GalleryImage {
  src: string;
  caption: string;
  alt: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=800&q=80",
    caption: "Bebê · Nova Coleção",
    alt: "Criança com roupa Valutin",
  },
  {
    src: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=800&q=80",
    caption: "Dia a Dia · Infantil",
    alt: "Moda infantil do dia a dia",
  },
  {
    src: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80",
    caption: "Ocasiões Especiais",
    alt: "Roupa para ocasiões especiais",
  },
];

export const GALERIA_HEADER = {
  label: "Coleção Atual",
  title: "Peças que contam histórias.",
} as const;

export interface Review {
  quote: string;
  author: string;
}

export const REVIEWS: Review[] = [
  {
    quote:
      "Loja maravilhosa, roupas de muito bom gosto, com design próprio. Super indico a Valutin!",
    author: "Ana Paula M.",
  },
  {
    quote:
      "Atendimento impecável e peças lindíssimas. Minha filha adora cada roupa que compramos aqui.",
    author: "Fernanda C.",
  },
  {
    quote:
      "Desde que descobri a Valutin não compro moda infantil em outro lugar. Qualidade incomparável.",
    author: "Renata S.",
  },
];

export const REVIEW_SOURCE = "⭐ Google Avaliações";

export type Step1Value = "bebê" | "criança" | "ocasião especial";
export type Step2Value =
  | "uso do dia a dia"
  | "presente especial"
  | "batizado ou cerimônia"
  | "quero visitar a loja";
export type Step3Value = "até R$ 300" | "R$ 300 a R$ 800" | "acima de R$ 800";

export interface StepOption<T extends string> {
  emoji: string;
  label: string;
  value: T;
}

export const STEP1_OPTIONS: StepOption<Step1Value>[] = [
  { emoji: "👶", label: "Bebê (0 a 24 meses)", value: "bebê" },
  { emoji: "🧒", label: "Criança (2 a 12 anos)", value: "criança" },
  { emoji: "🎀", label: "Ocasião especial (até 16 anos)", value: "ocasião especial" },
];

export const STEP2_OPTIONS: StepOption<Step2Value>[] = [
  { emoji: "🌸", label: "Uso do dia a dia", value: "uso do dia a dia" },
  { emoji: "🎁", label: "Presente especial", value: "presente especial" },
  { emoji: "⛪", label: "Batizado ou cerimônia", value: "batizado ou cerimônia" },
  { emoji: "🏪", label: "Quero visitar a loja", value: "quero visitar a loja" },
];

export const STEP3_OPTIONS: StepOption<Step3Value>[] = [
  { emoji: "💛", label: "Até R$ 300", value: "até R$ 300" },
  { emoji: "💎", label: "R$ 300 a R$ 800", value: "R$ 300 a R$ 800" },
  { emoji: "✨", label: "Acima de R$ 800", value: "acima de R$ 800" },
];

export function buildWhatsAppMessage(
  nome: string,
  para_quem: string,
  ocasiao: string,
  investimento: string
): string {
  return `Olá! Me chamo ${nome}. Estou buscando para ${para_quem}, ocasião: ${ocasiao}, investimento: ${investimento}.`;
}
