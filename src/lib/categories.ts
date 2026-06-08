export type CategoryGroup = "Collection" | "Featured";

export interface Category {
  slug: string;
  name: string;
  description: string;
  group: CategoryGroup;
  /** Shopify collection handle to fetch products from. */
  collectionHandle?: string;
  /** Curated product handles (overrides collection). Used for Trending. */
  productHandles?: string[];
  /** Cover image (best product image from the collection). */
  cover: string;
  /** Optional short tagline shown under the name. */
  tagline?: string;
  /** Search keywords for the search dialog. */
  keywords: string[];
}

export const categories: Category[] = [
  {
    slug: "trending",
    name: "Trending Now",
    description: "The studio's most-coveted statement pieces — sculptural chandeliers, marble pendants and luxury fixtures defining the season.",
    tagline: "Editor's edit · Luxury fixtures",
    group: "Featured",
    cover:
      "https://cdn.shopify.com/s/files/1/0989/6987/8891/files/hf_20260607_151137_31852eb4-f3d8-4d71-bbd7-0044efd2a2f6.png?v=1780845271",
    productHandles: [
      "spanish-marble-restaurant-round-light-luxury-bar-aisle-light-designer-model-coffee-dining-table-chandelier",
      "led-full-spectrum-modern-dining-room-chandelier-with-a-light-luxury-design",
      "leafless-overhead-fan-light-square-intelligence",
      "4inch-modern-crystal-pendant-light-3-pack-adjustable-hanging-ceiling-lamp-with-crystal-prism-design-for-dining-room-kitchen-island-and-living-room-golden-finish",
      "modern-light-luxury-natural-marble-chandelier-for-villas",
      "29-nickel-finish-vintage-crystal-vanity-light-elegant-5-light-bathroom-mirror-fixture-with-clear-glass-shades-no-bulbs",
      "6-light-modern-farmhouse-black-chandelier-contemporary-dining-room-light-fixture-adjustable-height-hanging-industrial-pendant-lights-kitchen-island-clear-glass-shade",
      "gold-pendant-light-fixtures-3-pack-modern-pendant-lighting-with-clear-striped-glass-shade-hanging-pendant-lights-kitchen-island-farmhouse-pendant-lighting-for-dining-room-bedroom-bathroom",
    ],
    keywords: ["trending", "luxury", "designer", "marble", "crystal", "premium"],
  },
  {
    slug: "hanging-lights",
    name: "Hanging Lights",
    description: "Interior chandeliers, pendants and ceiling fixtures — sculptural pieces that anchor a room from above.",
    tagline: "Chandeliers · Pendants · Ceiling",
    group: "Collection",
    collectionHandle: "zolvex-hanging-light-products",
    cover:
      "https://cdn.shopify.com/s/files/1/0989/6987/8891/files/hf_20260607_161025_82861ac9-334c-4b42-8f06-dcfac81e5093.png?v=1780848728",
    keywords: ["hanging", "chandelier", "pendant", "ceiling", "interior", "indoor"],
  },
  {
    slug: "exterior-wall",
    name: "Exterior Wall Lights",
    description: "Architectural wall-mounted fixtures built for façades, entrances and outdoor walls — weather-built and sculptural.",
    tagline: "Façade · Entrance · Outdoor wall",
    group: "Collection",
    collectionHandle: "zolvex-exteroir-wall-lighting",
    cover:
      "https://cdn.shopify.com/s/files/1/0989/6987/8891/files/hf_20260606_160935_81bf3f86-74a0-4610-8f29-eed76b6784d3.png?v=1780762438",
    keywords: ["exterior", "outdoor", "wall", "facade", "entrance", "sconce"],
  },
  {
    slug: "walkway",
    name: "Walkway Lighting",
    description: "Path, garden and walkway fixtures — bollards, step lights and landscape pieces that guide the way home.",
    tagline: "Paths · Gardens · Landscape",
    group: "Collection",
    collectionHandle: "zolvex-walkway-lighting",
    cover:
      "https://cdn.shopify.com/s/files/1/0989/6987/8891/files/hf_20260606_162406_303088d7-7c33-49f5-86b5-410a39902255.jpg?v=1780763349",
    keywords: ["walkway", "path", "garden", "landscape", "bollard", "outdoor"],
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function categoriesByGroup(group: CategoryGroup) {
  return categories.filter((c) => c.group === group);
}

export function matchesCategory(category: Category, title: string, description = "") {
  const hay = (title + " " + description).toLowerCase();
  return category.keywords.some((k) => hay.includes(k.toLowerCase()));
}
