export interface Category {
  slug: string;
  name: string;
  description: string;
  /** Keywords matched against product title + description (case-insensitive). */
  keywords: string[];
  /** Keywords that disqualify a product even if it matches the include list. */
  exclude?: string[];
}

export const categories: Category[] = [
  {
    slug: "chandeliers",
    name: "Chandeliers",
    description: "Statement chandeliers — crystal, glass, rattan and sculpted metal pieces for dining rooms, foyers and living rooms.",
    keywords: ["chandelier"],
  },
  {
    slug: "pendants",
    name: "Pendant Lights",
    description: "Pendants and droplights for kitchen islands, dining tables, bedsides and stairwells.",
    keywords: ["pendant", "droplight"],
    exclude: ["chandelier"],
  },
  {
    slug: "ceiling",
    name: "Ceiling Lights",
    description: "Flush-mount, linear and aisle ceiling fixtures for hallways, corridors and living spaces.",
    keywords: ["ceiling", "flush mount", "aisle", "hallway", "corridor"],
    exclude: ["pendant", "chandelier", "outdoor", "exterior", "vanity", "mirror"],
  },
  {
    slug: "wall-sconces",
    name: "Wall Sconces",
    description: "Wall-mounted sconces and reading lights — minimalist, sculptural and crystal pieces for bedrooms, hallways and stairs.",
    keywords: ["wall light", "wall lamp", "sconce", "wall sconce"],
    exclude: ["outdoor", "exterior", "vanity", "mirror", "bathroom"],
  },
  {
    slug: "bathroom-vanity",
    name: "Bathroom & Vanity",
    description: "Vanity bars, mirror front lights and bathroom sconces in matte black, brushed nickel and copper finishes.",
    keywords: ["vanity", "mirror front", "mirror wall light", "bathroom"],
  },
  {
    slug: "outdoor",
    name: "Outdoor & Exterior",
    description: "Waterproof outdoor wall lights, courtyard sconces and garden lamps engineered for facades, patios and entrances.",
    keywords: ["outdoor", "exterior", "courtyard", "garden", "waterproof", "ip65", "ip55", "patio"],
  },
  {
    slug: "fans-and-specialty",
    name: "Fans & Specialty",
    description: "Bladeless ceiling fan lights, track spotlights, step lights and sensor-activated fixtures.",
    keywords: ["fan light", "track light", "step light", "sensor", "garage", "honeycomb"],
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

/** Tests whether a product (title + description) belongs in a category. */
export function matchesCategory(category: Category, title: string, description = "") {
  const hay = (title + " " + description).toLowerCase();
  if (category.exclude?.some((k) => hay.includes(k.toLowerCase()))) return false;
  return category.keywords.some((k) => hay.includes(k.toLowerCase()));
}
