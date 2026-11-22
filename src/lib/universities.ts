// Universities tenants search by. Shown on the home page and in the hero search suggestions.
// `logo` points at each university's own website (linked, not copied). Universities without
// one, or whose logo fails to load, show their short name instead.
export const universities = [
  { id: "unza", short: "UNZA", name: "University of Zambia", city: "Lusaka", logo: "https://www.unza.zm/sites/default/files/Unza%20Logo%20sm_0.png" },
  { id: "cbu", short: "CBU", name: "Copperbelt University", city: "Kitwe", logo: "https://www.cbu.ac.zm/images/cbu.webp" },
  { id: "unilus", short: "UNILUS", name: "University of Lusaka", city: "Lusaka", logo: null },
  { id: "mulungushi", short: "MU", name: "Mulungushi University", city: "Kabwe", logo: "https://www.mu.ac.zm/static/assets/images/logo.png" },
  { id: "cavendish", short: "CUZ", name: "Cavendish University Zambia", city: "Lusaka", logo: "https://www.cavendishza.org/wp-content/themes/CUU_wp_2024-child/img/logo.png" },
  { id: "zcas", short: "ZCAS", name: "ZCAS University", city: "Lusaka", logo: "https://zcasu.edu.zm/images/zcasu/logo-shield-transparent.png" },
  { id: "chreso", short: "CU", name: "Chreso University", city: "Lusaka", logo: "https://chresouniversity.edu.zm/wp-content/uploads/2020/08/CU-Logo.png" },
  { id: "northrise", short: "NU", name: "Northrise University", city: "Ndola", logo: "https://northrise.edu.zm/wp-content/uploads/2021/01/NR_Logo_Retina.png" },
  { id: "mukuba", short: "MKU", name: "Mukuba University", city: "Kitwe", logo: "https://mukuba.edu.zm/wp-content/uploads/2020/11/cropped-MukubaLogo.png" },
  { id: "kwame-nkrumah", short: "KNU", name: "Kwame Nkrumah University", city: "Kabwe", logo: "https://www.nkrumah.edu.zm/home/assets/img/logo.png" },
] as const;

export type University = (typeof universities)[number];

export const universityById = (id: string | null | undefined) => universities.find((uni) => uni.id === id) ?? null;

/** Matches on full name, short name or city, so "unza", "copperbelt" and "kitwe" all work. */
export function matchUniversities(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [...universities];
  return universities.filter((uni) => [uni.name, uni.short, uni.city].some((field) => field.toLowerCase().includes(q)));
}
