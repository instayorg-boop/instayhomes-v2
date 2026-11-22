// The text and links at the bottom of search results, written for the university being searched.
// Guide links point at blog articles (/blog/<slug>); until the blog exists, that route shows a
// "coming soon" page. University links are real searches.
import { universities, type University } from "@/lib/universities";

export type GuideLink = { kind: "guide"; label: string; slug: string } | { kind: "university"; label: string; universityId: string };
export type LinkColumn = { heading: string; links: GuideLink[] };
export type SearchStory = { heading: string; intro: string[]; columns: LinkColumn[] };

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const guide = (label: string): GuideLink => ({ kind: "guide", label, slug: slugify(label) });

const rentingSafely: LinkColumn = {
  heading: "Renting safely",
  links: [guide("What to check before you rent"), guide("How to spot a rental scam"), guide("Questions to ask a landlord on WhatsApp")],
};

function otherUniversities(current: University | null): LinkColumn {
  const sameCity = current ? universities.filter((uni) => uni.city === current.city && uni.id !== current.id) : [];
  const pool = sameCity.length > 0 ? sameCity : universities.filter((uni) => uni.id !== current?.id);
  return {
    heading: current && sameCity.length > 0 ? `Other universities in ${current.city}` : current ? "More universities" : "Search by university",
    links: pool.slice(0, 4).map((uni) => ({ kind: "university", label: uni.name, universityId: uni.id })),
  };
}

export function searchStory(university: University | null): SearchStory {
  if (!university) {
    return {
      heading: "Student accommodation in Zambia",
      intro: [
        "Instayhomes lists furnished rooms, studios and shared houses near universities across Zambia, with photos, prices and move-in dates shown up front.",
        "Browsing is free. One Instayhomes Plus payment lets you message any landlord on WhatsApp to arrange a viewing and agree your move-in date.",
      ],
      columns: [
        otherUniversities(null),
        { heading: "Student guides", links: [guide("Moving to university in Zambia"), guide("Budgeting for your first year away from home"), guide("Shared housing: what to agree with housemates")] },
        rentingSafely,
        { heading: "Using Instayhomes", links: [guide("How Instayhomes Plus works"), guide("Messaging landlords on WhatsApp")] },
      ],
    };
  }

  const { name, short, city } = university;
  return {
    heading: `Student accommodation near ${name}`,
    intro: [
      `Looking for a room near ${name}? Instayhomes lists furnished rooms, studios and shared houses around ${short} in ${city}, with photos, prices and move-in dates shown up front.`,
      "Browsing is free. One Instayhomes Plus payment lets you message any landlord on WhatsApp to arrange a viewing and agree your move-in date.",
    ],
    columns: [
      {
        heading: `Living near ${short}`,
        links: [guide(`Best areas to live near ${short}`), guide(`How much does rent cost near ${short}?`), guide(`Getting to campus at ${short}`)],
      },
      {
        heading: `Student life in ${city}`,
        links: [guide(`Moving to ${city} as a student`), guide(`Budgeting for your first year in ${city}`), guide(`Shared housing in ${city}: what to agree with housemates`)],
      },
      rentingSafely,
      otherUniversities(university),
    ],
  };
}

/** Every guide title we link to, so the blog page can show the right title for a slug. */
export function guideTitle(slug: string): string | null {
  for (const uni of [null, ...universities]) {
    for (const column of searchStory(uni).columns) {
      for (const link of column.links) {
        if (link.kind === "guide" && link.slug === slug) return link.label;
      }
    }
  }
  return null;
}
