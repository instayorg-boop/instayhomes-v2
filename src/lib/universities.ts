// Universities tenants search by. Shown on the home page and in the hero search suggestions.
export const universities = [
  { id: "unza", short: "UNZA", name: "University of Zambia", city: "Lusaka" },
  { id: "cbu", short: "CBU", name: "Copperbelt University", city: "Kitwe" },
  { id: "unilus", short: "UNILUS", name: "University of Lusaka", city: "Lusaka" },
  { id: "mulungushi", short: "MU", name: "Mulungushi University", city: "Kabwe" },
  { id: "cavendish", short: "CUZ", name: "Cavendish University Zambia", city: "Lusaka" },
  { id: "zcas", short: "ZCAS", name: "ZCAS University", city: "Lusaka" },
  { id: "chreso", short: "CU", name: "Chreso University", city: "Lusaka" },
  { id: "northrise", short: "NU", name: "Northrise University", city: "Ndola" },
  { id: "mukuba", short: "MKU", name: "Mukuba University", city: "Kitwe" },
  { id: "kwame-nkrumah", short: "KNU", name: "Kwame Nkrumah University", city: "Kabwe" },
] as const;

export type University = (typeof universities)[number];

export const universityById = (id: string | null | undefined) => universities.find((uni) => uni.id === id) ?? null;

/** Matches on full name, short name or city, so "unza", "copperbelt" and "kitwe" all work. */
export function matchUniversities(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [...universities];
  return universities.filter((uni) => [uni.name, uni.short, uni.city].some((field) => field.toLowerCase().includes(q)));
}
