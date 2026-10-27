export const departments = [
  { slug: "bebe", label: "Bebês", title: "Para os primeiros dias", links: ["bebe-meninos", "bebe-meninas"] },
  { slug: "crianca", label: "Crianças", title: "Para acompanhar cada descoberta", links: ["crianca-meninos", "crianca-meninas"] },
  { slug: "batizado", label: "Batizado", title: "Peças para momentos especiais", links: ["batizado-e-cerimonia"] },
  { slug: "presentes", label: "Presentes", title: "Para guardar na memória", links: ["presentes-e-lembrancas"] },
] as const;

export const productCategories = [
  { slug: "calcas", label: "Calças" },
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
  { type: "camisetas", label: "Camisetas", audiences: ["meninas"] },
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
  "camiseta-branca-gola-babado-vlt-mar089ct": { type: "camisetas", audiences: ["meninas"] },
  "camiseta-floral-estampa-exclusiva-vlt-mar129ct": { type: "camisetas", audiences: ["meninas"] },
  "body-algodao-gola-babado-branco-vlt-mar030bb": { type: "body", audiences: ["meninas"] },
  "body-algodao-gola-babado-off-white-vlt-mar030bb": { type: "body", audiences: ["meninas"] },
  "macacao-suedine-bordado-mao-carrinho-azul-vlt-mar0106bb": { type: "macacao", audiences: ["meninos"] },
  "macacao-suedine-elefantinhos-verde-vlt-dbela002bb": { type: "macacao", audiences: ["meninos"] },
  "vestido-tricoline-estampa-exclusiva-rosas-azuis": { type: "vestido", audiences: ["meninas"] },
  "macacao-suedine-ovelhinhas-azul-vlt-dbela002bb": { type: "macacao", audiences: ["meninos"] },
  "macacao-suedine-ursinho-azul-vlt-dbela002bb": { type: "macacao", audiences: ["meninos"] },
  "macacao-suedine-polo-azul-vlt-dbela002bb": { type: "macacao", audiences: ["meninos"] },
  "macacao-suedine-girafa-verde-vlt-dbela002bb": { type: "macacao", audiences: ["meninos"] },
  "macacao-suedine-barquinhos-azul-vlt-dbela002bb": { type: "macacao", audiences: ["meninos"] },
  "macacao-suedine-gola-branca-flores-azul-vlt-dbela001bb": { type: "macacao", audiences: ["meninas"] },
  "macacao-suedine-tulipa-rose-vlt-dbela001bb": { type: "macacao", audiences: ["meninas"] },
  "macacao-suedine-ursinhos-rose-vlt-dbela001bb": { type: "macacao", audiences: ["meninas"] },
  "macacao-suedine-flores-azul-vlt-dbela001bb": { type: "macacao", audiences: ["meninas"] },
  "macacao-suedine-gola-ursinhas-rose-vlt-dbela001bb": { type: "macacao", audiences: ["meninas"] },
  "macacao-suedine-gola-floral-rosa-vlt-dbela001bb": { type: "macacao", audiences: ["meninas"] },
  "conjunto-camiseta-shorts-basico-futebol-hayooqct": { type: "conjunto", audiences: ["meninos"] },
  "conjunto-camiseta-shorts-basico-barcos-hayooqct": { type: "conjunto", audiences: ["meninos"] },
  "conjunto-camiseta-shorts-basico-dinossauros-hayooqct": { type: "conjunto", audiences: ["meninos"] },
  "conjunto-camiseta-shorts-basico-safari-hayooqct": { type: "conjunto", audiences: ["meninos"] },
  "conjunto-camiseta-shorts-basico-coqueiros-hayooqct": { type: "conjunto", audiences: ["meninos"] },
  "vestido-malha-estampa-exclusiva-vlt-geni012ct": { type: "vestido", audiences: ["meninas"] },
  "vestido-listrado-laranja-pv26-27ange008ct": { type: "vestido", audiences: ["meninas"] },
  "macacao-algodao-egipcio-coral-flores": { type: "macacao", audiences: ["meninas"] },
  "macacao-tricoline": { type: "macacao", audiences: ["meninos"] },
  "macacao-fustao": { type: "macacao", audiences: ["meninas"] },
  "macacao-fustao-floral-rosa": { type: "jardineira", audiences: ["meninas"] },
  "macacao-fustao-azul": { type: "jardineira", audiences: ["meninas"] },
  "conjunto-body-shorts": { type: "conjunto", audiences: ["meninas"] },
  "bloomer-fustao": { type: "bloomer", audiences: ["meninas"] },
  "cardigan-bordado-mao": { type: "cardigans", audiences: ["meninas"] },
  "jardineira-ursos": { type: "jardineira", audiences: ["meninos"] },
  "body-linho": { type: "body", audiences: ["meninos"] },
  "body-menina-branco-manga-curta-vlt-mar060bb": { type: "body", audiences: ["meninas"] },
  "body-gola-floral-verde-vlt-mar120bb": { type: "body", audiences: ["meninas"] },
  "body-gola-floral-azul-vlt-mar120bb": { type: "body", audiences: ["meninas"] },
  "body-gola-floral-azul-e-rosa-vlt-mar120bb": { type: "body", audiences: ["meninas"] },
  "body-gola-floral-rosa-vlt-mar120bb": { type: "body", audiences: ["meninas"] },
  "body-gola-borboletas-azuis-vlt-mar120bb": { type: "body", audiences: ["meninas"] },
  "body-polo-branco-vlt-mar060bb": { type: "body", audiences: ["meninos"] },
  "body-gola-offwhite-vlt-mar060bb": { type: "body", audiences: ["meninos"] },
  "shorts-algodao": { type: "shorts-e-bermuda", audiences: ["meninos"] },
  "vestido-algodao-bordado": { type: "vestido", audiences: ["meninas"] },
  "conjunto-camisa-shorts-verde": { type: "conjunto", audiences: ["meninos"] },
  "conjunto-camisa-shorts-azul": { type: "conjunto", audiences: ["meninos"] },
  "macacao-curto-azul-bordado": { type: "bloomer", audiences: ["meninas"] },
  "jardineira-carrinhos": { type: "jardineira", audiences: ["meninos"] },
  "jardineira-cargo-listras-bege-pv26-27ge009bb": { type: "jardineira", audiences: ["meninos"] },
  "jardineira-cargo-listras-azuis-pv26-27ge009bb": { type: "jardineira", audiences: ["meninos"] },
  "jardineira-cargo-azul-espinha-de-peixe-pv26-27ge009bb": { type: "jardineira", audiences: ["meninos"] },
  "macacao-bordado-azul": { type: "macacao", audiences: ["meninos", "meninas"] },
  "macacao-bordado-rosa-floral": { type: "macacao", audiences: ["meninas"] },
  "macacao-bordado-elefante": { type: "macacao", audiences: ["meninas"] },
  "macacao-bordado-branco-floral": { type: "macacao", audiences: ["meninas"] },
  "macacao-bordado-ourico": { type: "macacao", audiences: ["meninos", "meninas"] },
  "macacao-bordado-coelho": { type: "macacao", audiences: ["meninas"] },
  "macacao-pima-passarinhos-vlt-pf004bb": { type: "macacao", audiences: ["meninos", "meninas"] },
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

export const childrenSections = [
  { slug: "crianca-meninos", label: "Meninos", title: "Criança · Meninos", audience: "meninos", imageHandle: "camiseta-algodao-veleiro-01" },
  { slug: "crianca-meninas", label: "Meninas", title: "Criança · Meninas", audience: "meninas", imageHandle: "vestido-de-laise-rosa" },
] as const;

const childrenTypes = [
  { type: "camisetas", label: "Camisetas", audiences: ["meninos", "meninas"] },
  { type: "camisa-batas", label: "Camisa/Batas", audiences: ["meninos", "meninas"] },
  { type: "shorts", label: "Shorts/Bermudas", audiences: ["meninos", "meninas"] },
  { type: "conjuntos", label: "Conjuntos", audiences: ["meninos", "meninas"] },
  { type: "saia", label: "Saia", audiences: ["meninas"] },
  { type: "calcas", label: "Calças", audiences: ["meninos", "meninas"] },
  { type: "vestido", label: "Vestido", audiences: ["meninas"] },
  { type: "cardigan", label: "Cardigan", audiences: ["meninos", "meninas"] },
  { type: "pijama", label: "Pijama", audiences: ["meninos", "meninas"] },
] as const;
type ChildrenAssignment = { type: typeof childrenTypes[number]["type"]; audiences: readonly BabyAudience[] };
const childrenAssignments: Record<string, ChildrenAssignment> = {
  "camiseta-branca-gola-babado-vlt-mar089ct": { type: "camisetas", audiences: ["meninas"] },
  "camiseta-floral-estampa-exclusiva-vlt-mar129ct": { type: "camisetas", audiences: ["meninas"] },
  "conjunto-camiseta-shorts-basico-futebol-hayooqct": { type: "conjuntos", audiences: ["meninos"] },
  "conjunto-camiseta-shorts-basico-barcos-hayooqct": { type: "conjuntos", audiences: ["meninos"] },
  "conjunto-camiseta-shorts-basico-dinossauros-hayooqct": { type: "conjuntos", audiences: ["meninos"] },
  "conjunto-camiseta-shorts-basico-safari-hayooqct": { type: "conjuntos", audiences: ["meninos"] },
  "conjunto-camiseta-shorts-basico-coqueiros-hayooqct": { type: "conjuntos", audiences: ["meninos"] },
  "shorts-fustao-rosa-pv26-27ange004ct": { type: "shorts", audiences: ["meninas"] },
  "shorts-fustao-branco-pv26-27ange004ct": { type: "shorts", audiences: ["meninas"] },
  "camiseta-brilho-paris-azul-vlt-mar077ct": { type: "camisetas", audiences: ["meninas"] },
  "camiseta-brilho-musical-verde-vlt-mar077ct": { type: "camisetas", audiences: ["meninas"] },
  "calca-basica-feminina-verde-vlt-ange008ct": { type: "calcas", audiences: ["meninas"] },
  "calca-basica-feminina-rosa-vlt-ange008ct": { type: "calcas", audiences: ["meninas"] },
  "camiseta-algodao": { type: "camisetas", audiences: ["meninos"] },
  "camiseta-skate": { type: "camisetas", audiences: ["meninos"] },
  "camisa-linho": { type: "camisa-batas", audiences: ["meninos"] },
  "regata-floral-babados": { type: "camisa-batas", audiences: ["meninas"] },
  "regata-branca-babados": { type: "camisa-batas", audiences: ["meninas"] },
  "bermuda-linho": { type: "shorts", audiences: ["meninos"] },
  "bermuda-moletom": { type: "shorts", audiences: ["meninos"] },
  "conjunto-laise": { type: "conjuntos", audiences: ["meninas"] },
  "saia-algodao": { type: "saia", audiences: ["meninas"] },
  "cardigan-bordado-analu": { type: "cardigan", audiences: ["meninas"] },
};

export const childrenCategories = childrenSections.flatMap((section) => childrenTypes
  .filter((item) => (item.audiences as readonly string[]).includes(section.audience))
  .map((item) => {
    const label = item.type === "shorts" && section.audience === "meninas" ? "Shorts/Shorts-saia" : item.label;
    return { slug: `${section.slug}-${item.type}`, label, title: `${label} · ${section.label}`, parent: section.slug, audience: section.audience, type: item.type };
  }));

export function childrenClassification(product: CategoryProduct): ChildrenAssignment | undefined {
  if (product.category !== "crianca" && !product.additionalDepartments?.includes("crianca")) return undefined;
  const assigned = childrenAssignments[product.handle ?? ""] ?? childrenAssignments[product.sourceHandle ?? ""];
  if (assigned) return assigned;
  if (product.catalogCategory === "vestidos") return { type: "vestido", audiences: ["meninas"] };
  if (product.catalogCategory === "pijamas-meninos") return { type: "pijama", audiences: ["meninos"] };
  if (product.catalogCategory === "pijamas-meninas") return { type: "pijama", audiences: ["meninas"] };
  if (product.catalogCategory === "pijamas") return { type: "pijama", audiences: ["meninos", "meninas"] };
  return undefined;
}

export const selectionSections = [...babySections, ...childrenSections];
export const selectionCategories = [...babyCategories, ...childrenCategories];

export const categoryLabel = (slug: string) => selectionSections.find((item) => item.slug === slug)?.title ?? selectionCategories.find((item) => item.slug === slug)?.title ?? catalogSubcategories.find((category) => category.slug === slug)?.title ?? departmentCategories.find((category) => category.slug === slug)?.title ?? productCategories.find((category) => category.slug === slug)?.label ?? departments.find((department) => department.slug === slug)?.label ?? "A coleção";
export const isCatalogCategory = (slug: string) => selectionSections.some((item) => item.slug === slug) || selectionCategories.some((item) => item.slug === slug) || catalogSubcategories.some((category) => category.slug === slug) || departmentCategories.some((category) => category.slug === slug) || productCategories.some((category) => category.slug === slug) || departments.some((department) => department.slug === slug);

export function matchesCatalogCategory(product: CategoryProduct, slug: string) {
  const babyCategory = selectionCategories.find((item) => item.slug === slug);
  const babySection = selectionSections.find((item) => item.slug === slug);
  if (babyCategory || babySection) {
    const assignment = slug.startsWith("crianca-") ? childrenClassification(product) : babyClassification(product);
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
  const selected = selectionCategories.find((item) => item.slug === slug);
  const department = slug.startsWith("crianca-") ? "crianca" : "bebe";
  if (selected) return [department, selected.parent];
  if (selectionSections.some((item) => item.slug === slug)) return [department];
  const subcategory = catalogSubcategories.find((item) => item.slug === slug);
  return subcategory ? [subcategory.department, subcategory.parent] : slug === "pijamas" ? ["crianca"] : [];
}

export function productCategoryTrail(product: CategoryProduct, requestedCategory?: string): { slug: string; label: string }[] {
  const requested = selectionCategories.find((item) => item.slug === requestedCategory && matchesCatalogCategory(product, item.slug));
  const childrenAssignment = childrenClassification(product);
  const assignment = babyClassification(product);
  if (assignment || childrenAssignment) {
    const selected = requested ?? (product.category === "crianca" && childrenAssignment
      ? childrenCategories.find((item) => item.type === childrenAssignment.type && item.audience === childrenAssignment.audiences[0])
      : assignment ? babyCategories.find((item) => item.type === assignment.type && item.audience === assignment.audiences[0]) : undefined);
    if (selected) return [
      { slug: selected.slug.startsWith("crianca-") ? "crianca" : "bebe", label: selected.slug.startsWith("crianca-") ? "Crianças" : "Bebês" },
      { slug: selected.parent, label: selectionSections.find((item) => item.slug === selected.parent)!.label },
      { slug: selected.slug, label: selected.label },
    ];
  }
  return [{ slug: product.category, label: categoryLabel(product.category) }, { slug: departmentCategories.find((item) => item.catalogCategory === product.catalogCategory && item.department === product.category)?.slug ?? product.catalogCategory, label: categoryLabel(product.catalogCategory) }];
}

// Keep one product while limiting the sizes offered in a department's listing and detail page.
export function productForCategory<T extends CategoryProduct & { sizes: string[]; sizesByDepartment?: Record<string, string[]> }>(product: T, slug?: string): T {
  const department = slug === "bebe" || slug?.startsWith("bebe-") || departmentCategories.some((item) => item.slug === slug && item.department === "bebe")
    ? "bebe" : slug === "crianca" || slug?.startsWith("crianca-") || departmentCategories.some((item) => item.slug === slug && item.department === "crianca") ? "crianca" : undefined;
  const scopedSizes = department && slug && matchesCatalogCategory(product, slug) ? product.sizesByDepartment?.[department] : undefined;
  return scopedSizes ? { ...product, sizes: product.sizes.filter((size) => scopedSizes.includes(size)) } : product;
}
