export const departments = [
  { slug: "bebe", label: "Bebês", title: "Para os primeiros dias", links: ["bebe-meninos", "bebe-meninas"] },
  { slug: "crianca", label: "Crianças", title: "Para acompanhar cada descoberta", links: ["vestidos-crianca", "camisetas-e-camisas", "saias-shorts-e-bermudas", "pijamas"] },
  { slug: "batizado", label: "Batizado", title: "Peças para momentos especiais", links: ["batizado-e-cerimonia"] },
  { slug: "presentes", label: "Presentes", title: "Para guardar na memória", links: ["presentes-e-lembrancas"] },
] as const;

export const productCategories = [
  { slug: "vestidos", label: "Vestidos" },
  { slug: "macacoes-e-jardineiras", label: "Macacões e jardineiras" },
  { slug: "bodys-e-conjuntos", label: "Bodys e conjuntos" },
  { slug: "camisetas-e-camisas", label: "Camisetas e camisas" },
  { slug: "saias-shorts-e-bermudas", label: "Saias, shorts e bermudas" },
  { slug: "tricos-e-casacos", label: "Tricôs e casacos" },
  { slug: "batizado-e-cerimonia", label: "Batizado e cerimônia" },
  { slug: "presentes-e-lembrancas", label: "Presentes e lembranças" },
] as const;

export const departmentCategories = [
  { slug: "vestidos-bebe", label: "Vestidos", title: "Vestidos para bebês", department: "bebe", catalogCategory: "vestidos" },
  { slug: "vestidos-crianca", label: "Vestidos", title: "Vestidos para crianças", department: "crianca", catalogCategory: "vestidos" },
  { slug: "pijamas", label: "Pijamas", title: "Pijamas", department: "crianca", catalogCategory: "pijamas" },
] as const;

export const catalogSubcategories = [
  { slug: "pijamas-meninas", label: "Meninas", title: "Pijamas para meninas", parent: "pijamas", department: "crianca" },
  { slug: "pijamas-meninos", label: "Meninos", title: "Pijamas para meninos", parent: "pijamas", department: "crianca" },
] as const;

export const babySections = [
  { slug: "bebe-meninos", label: "Meninos", title: "Bebê · Meninos", audience: "meninos", imageHandle: "macacao-tricoline-listra-sage" },
  { slug: "bebe-meninas", label: "Meninas", title: "Bebê · Meninas", audience: "meninas", imageHandle: "vestido-bebe-bordado-azul-kds005ct" },
] as const;

const babyTypes = [
  { type: "body", label: "Body", audiences: ["meninos", "meninas"] },
  { type: "macacao", label: "Macacão", audiences: ["meninos", "meninas"] },
  { type: "jardineira", label: "Jardineira", audiences: ["meninos", "meninas"] },
  { type: "conjunto", label: "Conjunto", audiences: ["meninos", "meninas"] },
  { type: "shorts-e-bermuda", label: "Shorts e Bermuda", audiences: ["meninos"] },
  { type: "vestido", label: "Vestido", audiences: ["meninas"] },
  { type: "bloomer", label: "Bloomer", audiences: ["meninas"] },
  { type: "cardigans", label: "Cardigans", audiences: ["meninos", "meninas"] },
] as const;

type BabyAudience = typeof babySections[number]["audience"];
type BabyType = typeof babyTypes[number]["type"];
type BabyAssignment = { type: BabyType; audiences: readonly BabyAudience[] };
type CategoryProduct = { category: string; catalogCategory: string; additionalDepartments?: readonly string[]; handle?: string; sourceHandle?: string };

// Classify each garment independently of its commercial fields and color.
// A piece-level entry takes precedence over its original multi-piece record.
const babyAssignments: Record<string, BabyAssignment> = {
  "macacao-tricoline": { type: "macacao", audiences: ["meninos", "meninas"] },
  "macacao-fustao": { type: "macacao", audiences: ["meninas"] },
  "macacao-fustao-azul": { type: "jardineira", audiences: ["meninas"] },
  "conjunto-body-shorts": { type: "conjunto", audiences: ["meninas"] },
  "bloomer-fustao": { type: "bloomer", audiences: ["meninas"] },
  "cardigan-bordado-mao": { type: "cardigans", audiences: ["meninas"] },
  "jardineira-ursos": { type: "jardineira", audiences: ["meninos", "meninas"] },
  "body-linho": { type: "body", audiences: ["meninos", "meninas"] },
  "shorts-algodao": { type: "shorts-e-bermuda", audiences: ["meninos"] },
  "vestido-algodao-bordado": { type: "vestido", audiences: ["meninas"] },
  "conjunto-camisa-shorts-verde": { type: "conjunto", audiences: ["meninos", "meninas"] },
  "conjunto-camisa-shorts-azul": { type: "conjunto", audiences: ["meninos", "meninas"] },
  "macacao-curto-azul-bordado": { type: "macacao", audiences: ["meninas"] },
  "jardineira-carrinhos": { type: "jardineira", audiences: ["meninos"] },
  "macacao-bordado-azul": { type: "macacao", audiences: ["meninos", "meninas"] },
  "macacao-bordado-rosa-floral": { type: "macacao", audiences: ["meninas"] },
  "macacao-bordado-elefante": { type: "macacao", audiences: ["meninos", "meninas"] },
  "macacao-bordado-branco-floral": { type: "macacao", audiences: ["meninas"] },
  "macacao-bordado-ourico": { type: "macacao", audiences: ["meninos", "meninas"] },
  "macacao-bordado-coelho": { type: "macacao", audiences: ["meninos", "meninas"] },
  "cardigan-bebe-carrinho": { type: "cardigans", audiences: ["meninos"] },
  "vestido-bordado-creme": { type: "vestido", audiences: ["meninas"] },
  "vestido-bordado-listrado-azul": { type: "vestido", audiences: ["meninas"] },
  "vestido-bordado-verde": { type: "vestido", audiences: ["meninas"] },
  "vestido-bordado-rosa": { type: "vestido", audiences: ["meninas"] },
  "vestido-bordado-azul-claro": { type: "vestido", audiences: ["meninas"] },
  "vestido-bebe-bordado-azul-kds005ct": { type: "vestido", audiences: ["meninas"] },
  "vestido-bebe-listrado-laranja-ange007bb": { type: "vestido", audiences: ["meninas"] },
  "cardigan-linha-azul-vlt-ver027ct": { type: "cardigans", audiences: ["meninas"] },
};

export const babyCategories = babySections.flatMap((section) => babyTypes
  .filter((item) => (item.audiences as readonly string[]).includes(section.audience))
  .map((item) => ({ slug: `${section.slug}-${item.type}`, label: item.label, title: `${item.label} · ${section.label}`, parent: section.slug, audience: section.audience, type: item.type })));

export function babyClassification(product: CategoryProduct): BabyAssignment | undefined {
  if (product.category !== "bebe" && !product.additionalDepartments?.includes("bebe")) return undefined;
  return babyAssignments[product.handle ?? ""] ?? babyAssignments[product.sourceHandle ?? ""];
}

export const categoryLabel = (slug: string) => babySections.find((item) => item.slug === slug)?.title ?? babyCategories.find((item) => item.slug === slug)?.title ?? catalogSubcategories.find((category) => category.slug === slug)?.title ?? departmentCategories.find((category) => category.slug === slug)?.title ?? productCategories.find((category) => category.slug === slug)?.label ?? departments.find((department) => department.slug === slug)?.label ?? "A coleção";
export const isCatalogCategory = (slug: string) => babySections.some((item) => item.slug === slug) || babyCategories.some((item) => item.slug === slug) || catalogSubcategories.some((category) => category.slug === slug) || departmentCategories.some((category) => category.slug === slug) || productCategories.some((category) => category.slug === slug) || departments.some((department) => department.slug === slug);

export function matchesCatalogCategory(product: CategoryProduct, slug: string) {
  const babyCategory = babyCategories.find((item) => item.slug === slug);
  const babySection = babySections.find((item) => item.slug === slug);
  if (babyCategory || babySection) {
    const assignment = babyClassification(product);
    const audience = babyCategory?.audience ?? babySection!.audience;
    return !!assignment && assignment.audiences.includes(audience) && (!babyCategory || assignment.type === babyCategory.type);
  }
  const inDepartment = (department: string) => product.category === department || product.additionalDepartments?.includes(department) === true;
  const subcategory = catalogSubcategories.find((category) => category.slug === slug);
  if (subcategory) return inDepartment(subcategory.department) && product.catalogCategory === subcategory.slug;
  const scoped = departmentCategories.find((category) => category.slug === slug);
  if (scoped) return inDepartment(scoped.department) && (product.catalogCategory === scoped.catalogCategory || catalogSubcategories.some((category) => category.parent === slug && category.slug === product.catalogCategory));
  return slug === "todos" || inDepartment(slug) || product.catalogCategory === slug;
}

export const categoryHref = (slug: string, department?: string) => `/catalogo/categoria/${departmentCategories.find((category) => category.catalogCategory === slug && category.department === department)?.slug ?? slug}`;
export const productHref = (handle: string) => `/catalogo/${handle}`;

export function categoryAncestors(slug: string): string[] {
  const babyCategory = babyCategories.find((item) => item.slug === slug);
  if (babyCategory) return ["bebe", babyCategory.parent];
  if (babySections.some((item) => item.slug === slug)) return ["bebe"];
  const subcategory = catalogSubcategories.find((item) => item.slug === slug);
  return subcategory ? [subcategory.department, subcategory.parent] : slug === "pijamas" ? ["crianca"] : [];
}

export function productCategoryTrail(product: CategoryProduct, requestedCategory?: string): { slug: string; label: string }[] {
  const assignment = babyClassification(product);
  if (assignment) {
    const requested = babyCategories.find((item) => item.slug === requestedCategory && matchesCatalogCategory(product, item.slug));
    const selected = requested ?? babyCategories.find((item) => item.type === assignment.type && item.audience === assignment.audiences[0]);
    if (selected) return [
      { slug: "bebe", label: "Bebês" },
      { slug: selected.parent, label: babySections.find((item) => item.slug === selected.parent)!.label },
      { slug: selected.slug, label: selected.label },
    ];
  }
  return [{ slug: product.category, label: categoryLabel(product.category) }, { slug: departmentCategories.find((item) => item.catalogCategory === product.catalogCategory && item.department === product.category)?.slug ?? product.catalogCategory, label: categoryLabel(product.catalogCategory) }];
}
