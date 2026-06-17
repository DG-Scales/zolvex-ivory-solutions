import pendantCover from "@/assets/collection-pendant.png";
import chandelierCover from "@/assets/collection-chandelier.png";
import ceilingCover from "@/assets/collection-ceiling.png";

import exteriorCover from "@/assets/collection-exterior.png";
import aisleCover from "@/assets/collection-aisle.png";

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
  "13-8in-natural-marble-wall-sconce-black-sconces-set-of-two-indoor-modern-bathroom-sconces-wall-lighting-for-living-room-bedroom-hallway-stairs",
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
    slug: "pendant-hanging-lights",
    name: "Pendant & Hanging Lights",
    description: "Pendants and hanging fixtures — sculptural lighting that frames dining tables, kitchen islands and entryways from above.",
    tagline: "Pendants · Hanging · Droplights",
    group: "Collection",
    collectionHandle: "pendant-hanging-lights",
    cover: pendantCover,
  },
  {
    slug: "chandeliers-statement-lights",
    name: "Chandeliers & Statement Lights",
    description: "Statement chandeliers — crystal, marble and modern sculptural pieces designed to anchor a room.",
    tagline: "Chandeliers · Statement · Luxury",
    group: "Collection",
    collectionHandle: "chandeliers-statement-lights",
    cover: chandelierCover,
  },
  {
    slug: "ceiling-lights",
    name: "Ceiling Lights",
    description: "Flush-mount, semi-flush and linear ceiling fixtures — clean architectural lighting for hallways, bedrooms and living spaces.",
    tagline: "Flush · Semi-flush · Linear",
    group: "Collection",
    collectionHandle: "ceiling-lights",
    cover: ceilingCover,
  },
  {
    slug: "wall-lights-sconces",
    name: "Wall Lights & Sconces",
    description: "Interior wall lights and sconces — reading lamps, feature-wall fixtures and crystal sconces for bedrooms, hallways and stairwells.",
    tagline: "Sconces · Reading · Staircase",
    group: "Collection",
    collectionHandle: "wall-lights-sconces",
    cover: "https://cdn.shopify.com/s/files/1/0989/6987/8891/files/9119cb4a-d848-4f29-9a4d-f917477d7478.png?v=1781625586",
  },
  {
    slug: "exterior-outdoor-lighting",
    name: "Exterior & Outdoor Lighting",
    description: "Architectural exterior fixtures — weather-built sconces and outdoor lighting for façades, entrances, balconies and patios.",
    tagline: "Façade · Entrance · Outdoor",
    group: "Collection",
    collectionHandle: "exterior-outdoor-lighting",
    cover: exteriorCover,
  },
  {
    slug: "walkway-aisle-lighting",
    name: "Aisle Lighting",
    description: "Aisle, walkway and path lighting — step lights, bollards and landscape fixtures that guide the way home.",
    tagline: "Aisle · Walkway · Landscape",
    group: "Collection",
    collectionHandle: "walkway-aisle-lighting",
    cover: aisleCover,
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
