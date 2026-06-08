export type CategoryGroup = "Type" | "Room" | "Style";

export interface Category {
  slug: string;
  name: string;
  description: string;
  group: CategoryGroup;
  /** Keywords matched against product title + description (case-insensitive). */
  keywords: string[];
  /** Keywords that disqualify a product even if it matches the include list. */
  exclude?: string[];
}

export const categories: Category[] = [
  // ---------- By Type ----------
  {
    slug: "chandeliers",
    name: "Chandeliers",
    description: "Statement chandeliers — crystal, glass, rattan and sculpted metal pieces for dining rooms, foyers and living rooms.",
    group: "Type",
    keywords: ["chandelier"],
  },
  {
    slug: "pendants",
    name: "Pendant Lights",
    description: "Pendants and droplights for kitchen islands, dining tables, bedsides and stairwells.",
    group: "Type",
    keywords: ["pendant", "droplight"],
    exclude: ["chandelier"],
  },
  {
    slug: "ceiling",
    name: "Flush Mount & Ceiling",
    description: "Flush-mount, linear and aisle ceiling fixtures for hallways, corridors and living spaces.",
    group: "Type",
    keywords: ["ceiling", "flush mount", "aisle", "hallway", "corridor"],
    exclude: ["pendant", "chandelier", "outdoor", "exterior", "vanity", "mirror"],
  },
  {
    slug: "wall-sconces",
    name: "Wall Sconces",
    description: "Wall-mounted sconces and reading lights — minimalist, sculptural and crystal pieces for bedrooms, hallways and stairs.",
    group: "Type",
    keywords: ["wall light", "wall lamp", "sconce", "wall sconce"],
    exclude: ["outdoor", "exterior", "vanity", "mirror", "bathroom"],
  },
  {
    slug: "bathroom-vanity",
    name: "Bathroom & Vanity",
    description: "Vanity bars, mirror front lights and bathroom sconces in matte black, brushed nickel and copper finishes.",
    group: "Type",
    keywords: ["vanity", "mirror front", "mirror wall light", "bathroom"],
  },
  {
    slug: "outdoor",
    name: "Outdoor & Exterior",
    description: "Waterproof outdoor wall lights, courtyard sconces and garden lamps engineered for facades, patios and entrances.",
    group: "Type",
    keywords: ["outdoor", "exterior", "courtyard", "garden", "waterproof", "ip65", "ip55", "patio"],
  },
  {
    slug: "fans-and-specialty",
    name: "Fans & Specialty",
    description: "Bladeless ceiling fan lights, track spotlights, step lights and sensor-activated fixtures.",
    group: "Type",
    keywords: ["fan light", "track light", "step light", "sensor", "garage", "honeycomb"],
  },
  // ---------- By Room ----------
  {
    slug: "living-room",
    name: "Living Room",
    description: "Lighting to anchor your living room — chandeliers, sculptural pendants and ambient ceiling fixtures.",
    group: "Room",
    keywords: ["living room", "living-room", "lounge"],
  },
  {
    slug: "dining-room",
    name: "Dining Room",
    description: "Pieces that frame the table — linear chandeliers, droplights and statement pendants for dining spaces.",
    group: "Room",
    keywords: ["dining", "dining room", "kitchen island", "island"],
  },
  {
    slug: "bedroom",
    name: "Bedroom",
    description: "Calmer light for the bedroom — flush mounts, bedside sconces and softer pendants.",
    group: "Room",
    keywords: ["bedroom", "bedside"],
  },
  {
    slug: "entryway",
    name: "Entryway & Foyer",
    description: "Tall, sculptural lighting to greet the room — foyer chandeliers and stairwell pendants.",
    group: "Room",
    keywords: ["foyer", "entryway", "stairwell", "staircase"],
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function categoriesByGroup(group: CategoryGroup) {
  return categories.filter((c) => c.group === group);
}

/** Tests whether a product (title + description) belongs in a category. */
export function matchesCategory(category: Category, title: string, description = "") {
  const hay = (title + " " + description).toLowerCase();
  if (category.exclude?.some((k) => hay.includes(k.toLowerCase()))) return false;
  return category.keywords.some((k) => hay.includes(k.toLowerCase()));
}
