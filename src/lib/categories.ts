import chandeliers from "@/assets/cat-chandeliers.jpg";
import pendants from "@/assets/cat-pendants.jpg";
import wall from "@/assets/cat-wall.jpg";
import floor from "@/assets/cat-floor.jpg";
import table from "@/assets/cat-table.jpg";
import interior from "@/assets/cat-interior.jpg";
import exterior from "@/assets/cat-exterior.jpg";

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
  keywords: string[];
}

export const categories: Category[] = [
  {
    slug: "chandeliers",
    name: "Chandeliers",
    description: "Statement pieces for grand interiors.",
    image: chandeliers,
    keywords: ["chandelier", "crystal"],
  },
  {
    slug: "pendants",
    name: "Pendants",
    description: "Hanging lights for dining and kitchen.",
    image: pendants,
    keywords: ["pendant", "hanging"],
  },
  {
    slug: "wall-sconces",
    name: "Wall Sconces",
    description: "Wall-mounted ambient lighting.",
    image: wall,
    keywords: ["wall", "sconce"],
  },
  {
    slug: "floor-lamps",
    name: "Floor Lamps",
    description: "Sculptural floor-standing light.",
    image: floor,
    keywords: ["floor", "lamp"],
  },
  {
    slug: "table-lamps",
    name: "Table Lamps",
    description: "Soft light for tables and desks.",
    image: table,
    keywords: ["table", "desk", "lamp"],
  },
  {
    slug: "interior",
    name: "Interior",
    description: "Lighting for every room inside.",
    image: interior,
    keywords: ["interior", "indoor", "ceiling"],
  },
  {
    slug: "exterior",
    name: "Exterior",
    description: "Outdoor and architectural fixtures.",
    image: exterior,
    keywords: ["exterior", "outdoor", "garden"],
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
