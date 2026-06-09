import exteriorWallCover from "@/assets/exterior-wall-cover.png.asset.json";

export type CategoryGroup = "Collection" | "Featured";

export interface Category {
  slug: string;
  name: string;
  description: string;
  group: CategoryGroup;
  /** Curated product handles (Trending). */
  productHandles?: string[];
  /** Shopify collection handle (overrides keywords). */
  collectionHandle?: string;
  /** Title/description keyword filter (used when no collection/handles). */
  keywords?: string[];
  /** Keywords that disqualify a product even if it matches keywords. */
  exclude?: string[];
  /** Product handles to force-include in this category. */
  includeHandles?: string[];
  /** Product handles to force-exclude from this category. */
  excludeHandles?: string[];
  cover: string;
  tagline?: string;
}

const TRENDING_HANDLES = [
  "spanish-marble-restaurant-round-light-luxury-bar-aisle-light-designer-model-coffee-dining-table-chandelier",
  "led-full-spectrum-modern-dining-room-chandelier-with-a-light-luxury-design",
  "4inch-modern-crystal-pendant-light-3-pack-adjustable-hanging-ceiling-lamp-with-crystal-prism-design-for-dining-room-kitchen-island-and-living-room-golden-finish",
  "modern-light-luxury-natural-marble-chandelier-for-villas",
  "29-nickel-finish-vintage-crystal-vanity-light-elegant-5-light-bathroom-mirror-fixture-with-clear-glass-shades-no-bulbs",
  "6-light-modern-farmhouse-black-chandelier-contemporary-dining-room-light-fixture-adjustable-height-hanging-industrial-pendant-lights-kitchen-island-clear-glass-shade",
  "gold-pendant-light-fixtures-3-pack-modern-pendant-lighting-with-clear-striped-glass-shade-hanging-pendant-lights-kitchen-island-farmhouse-pendant-lighting-for-dining-room-bedroom-bathroom",
  "leafless-overhead-fan-light-square-intelligence",
];

export const categories: Category[] = [
  {
    slug: "trending",
    name: "Trending Now",
    description: "The studio's most-coveted statement pieces — sculptural chandeliers, marble pendants and luxury fixtures defining the season.",
    tagline: "Editor's edit · Luxury fixtures",
    group: "Featured",
    cover:
      "https://cdn.shopify.com/s/files/1/0989/6987/8891/files/hf_20260607_151137_31852eb4-f3d8-4d71-bbd7-0044efd2a2f6.png?v=1780845271",
    productHandles: TRENDING_HANDLES,
  },
  {
    slug: "interior-hanging",
    name: "Interior Chandeliers & Pendants",
    description: "Indoor chandeliers, pendants and droplights — sculptural pieces that anchor dining rooms, bedrooms and living spaces from above.",
    tagline: "Chandeliers · Pendants · Droplights",
    group: "Collection",
    cover:
      "https://cdn.shopify.com/s/files/1/0989/6987/8891/files/hf_20260607_151648_436d7c08-fe63-41ed-8cb9-bf61e85f70fc.png?v=1780845496",
    keywords: ["chandelier", "pendant", "droplight", "hanging"],
    exclude: ["outdoor", "exterior", "waterproof", "wall light", "wall lamp", "sconce", "vanity", "mirror front", "step light", "solar"],
  },
  {
    slug: "interior-wall",
    name: "Interior Wall Sconces",
    description: "Indoor wall lights and sconces — reading lamps, feature-wall fixtures and crystal sconces for bedrooms, hallways and staircases.",
    tagline: "Sconces · Reading · Staircase",
    group: "Collection",
    cover:
      "https://cdn.shopify.com/s/files/1/0989/6987/8891/files/hf_20260606_155657_a296dce2-5a56-405f-85cc-177c94f26a60.png?v=1780761618",
    keywords: ["wall light", "wall lamp", "sconce", "wall sconce", "wall-light"],
    exclude: ["outdoor", "exterior", "waterproof", "courtyard", "garden", "ip65", "ip55", "vanity", "mirror front", "solar"],
    includeHandles: ["led-vanity-mirror-wall-light-7-sizes-from-40-120cm"],
  },
  {
    slug: "ceiling-flush",
    name: "Ceiling & Flush Mounts",
    description: "Flush-mount, linear and aisle ceiling fixtures — clean, architectural lighting for hallways, corridors and modern living spaces.",
    tagline: "Flush · Linear · Aisle",
    group: "Collection",
    cover:
      "https://cdn.shopify.com/s/files/1/0989/6987/8891/files/5c3204d5-1342-4933-931e-09fe33f0fc65.jpg?v=1780527142",
    keywords: ["ceiling light", "ceiling lamp", "flush mount", "aisle ceiling", "ceiling spotlight", "track light"],
    exclude: ["pendant", "chandelier", "outdoor", "exterior", "wall", "vanity", "mirror"],
  },
  {
    slug: "bathroom-vanity",
    name: "Bathroom & Kitchen",
    description: "Vanity bars, mirror front lights and bathroom sconces in matte black, brushed nickel and copper finishes.",
    tagline: "Mirror · Vanity · Bathroom",
    group: "Collection",
    cover:
      "https://cdn.shopify.com/s/files/1/0989/6987/8891/files/hf_20260607_183408_19c3ac73-46ef-40a8-92d0-1e8d57594df2.png?v=1780857305",
    keywords: ["vanity", "mirror front", "mirror cabinet", "mirror wall light", "bathroom mirror", "bathroom"],
    excludeHandles: ["led-vanity-mirror-wall-light-7-sizes-from-40-120cm"],
  },
  {
    slug: "exterior-wall",
    name: "Exterior Wall Lights",
    description: "Architectural exterior wall fixtures — weather-built sconces for façades, entrances, balconies and patios.",
    tagline: "Façade · Entrance · Outdoor wall",
    group: "Collection",
    cover: exteriorWallCover.url,
    includeHandles: [
      "outdoor-waterproof-patio-light-led-outdoor-wall-light",
      "outdoor-patio-waterproof-solar-wall-light",
      "outdoor-stairwayaisles-waterproof-acrylic-courtyardbalcony-wall-light",
      "modern-minimalist-waterproof-outdoor-wall-light",
      "retro-outdoor-wall-light-for-exterior-balconies-and-facades",
      "long-wall-sconce-outdoor-courtyard-light",
      "outdoor-wall-light-outdoor-villa-balcony-light",
      "european-style-exterior-wall-light-outdoor-light-waterproof-courtyard-light",
      "modern-creative-aluminum-aisle-light",
      "retro-outdoor-waterproof-led-wall-light",
      "outdoor-light-villa-aluminum-exterior-wall-light-door-front-light",
      "k-shaped-led-outdoor-wall-light-outdoor-waterproof-double-headed-aisle-light-modern-corridor-wall-light",
      "led-wall-light-curved-moon-induction-wall-light",
      "household-waterproof-super-bright-lighting-led-induction-wall-lamp",
    ],
  },
  {
    slug: "walkway-garden",
    name: "Walkway & Garden",
    description: "Path, garden and walkway fixtures — bollards, step lights, solar lamps and landscape pieces that guide the way home.",
    tagline: "Paths · Solar · Landscape",
    group: "Collection",
    cover:
      "https://cdn.shopify.com/s/files/1/0989/6987/8891/files/hf_20260606_162406_303088d7-7c33-49f5-86b5-410a39902255.jpg?v=1780763349",
    includeHandles: [
      "outdoor-solar-hexagonal-wall-light-wall-light-garden-light",
      "led-underground-light-1w-outdoor-waterproof-rgb-lawn-light-villa-garden-light",
      "12led-solar-underground-light-solar-lawn-light",
      "12led-solar-light-led-combination-sink-light",
      "solar-outdoor-light-waterproof-lawn",
      "honeycomb-shaped-hexagonal-garage-light",
    ],
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function categoriesByGroup(group: CategoryGroup) {
  return categories.filter((c) => c.group === group);
}

export function matchesCategory(category: Category, title: string, description = "", handle = "") {
  if (handle && category.excludeHandles?.includes(handle)) return false;
  if (handle && category.includeHandles?.includes(handle)) return true;
  const hay = (title + " " + description).toLowerCase();
  if (category.exclude?.some((k) => hay.includes(k.toLowerCase()))) return false;
  return (category.keywords ?? []).some((k) => hay.includes(k.toLowerCase()));
}
