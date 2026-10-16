export const departments = [
  { slug: "bebe", label: "Bebês", title: "Para os primeiros dias", links: ["vestidos-bebe", "bodys-e-conjuntos", "macacoes-e-jardineiras", "tricos-e-casacos"] },
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

export const categoryLabel = (slug: string) => catalogSubcategories.find((category) => category.slug === slug)?.title ?? departmentCategories.find((category) => category.slug === slug)?.title ?? productCategories.find((category) => category.slug === slug)?.label ?? departments.find((department) => department.slug === slug)?.label ?? "A coleção";
export const isCatalogCategory = (slug: string) => catalogSubcategories.some((category) => category.slug === slug) || departmentCategories.some((category) => category.slug === slug) || productCategories.some((category) => category.slug === slug) || departments.some((department) => department.slug === slug);

export function matchesCatalogCategory(product: { category: string; catalogCategory: string; additionalDepartments?: readonly string[] }, slug: string) {
  const inDepartment = (department: string) => product.category === department || product.additionalDepartments?.includes(department) === true;
  const subcategory = catalogSubcategories.find((category) => category.slug === slug);
  if (subcategory) return inDepartment(subcategory.department) && product.catalogCategory === subcategory.slug;
  const scoped = departmentCategories.find((category) => category.slug === slug);
  if (scoped) return inDepartment(scoped.department) && (product.catalogCategory === scoped.catalogCategory || catalogSubcategories.some((category) => category.parent === slug && category.slug === product.catalogCategory));
  return slug === "todos" || inDepartment(slug) || product.catalogCategory === slug;
}

export const categoryHref = (slug: string, department?: string) => `/catalogo/categoria/${departmentCategories.find((category) => category.catalogCategory === slug && category.department === department)?.slug ?? slug}`;
export const productHref = (handle: string) => `/catalogo/${handle}`;
