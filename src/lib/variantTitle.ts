// Utilities for turning raw Shopify variant titles / option values into
// clean, human-readable labels (e.g. "8headed gold" -> "8 Heads, Gold").

// Common Chinese -> English term map seen on this catalog
const CN_MAP: Record<string, string> = {
  "暖光": "Warm Light",
  "白光": "White Light",
  "中性光": "Neutral Light",
  "自然光": "Natural Light",
  "三色光": "Tri-Color Light",
  "黑色": "Black",
  "白色": "White",
  "金色": "Gold",
  "银色": "Silver",
  "灰色": "Gray",
  "红色": "Red",
  "蓝色": "Blue",
  "绿色": "Green",
  "粉色": "Pink",
  "棕色": "Brown",
  "米色": "Beige",
  "头": "Heads",
  "个头": "Heads",
  "盏": "Lights",
  "默认": "Default",
  "默认标题": "Default",
};

const CJK = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;

function translateCJK(input: string): string {
  let out = input;
  for (const [cn, en] of Object.entries(CN_MAP)) {
    if (out.includes(cn)) out = out.split(cn).join(` ${en} `);
  }
  // Drop any remaining CJK chars
  out = out.replace(CJK, " ");
  return out;
}

const TITLE_WORDS = new Set(["and", "or", "of", "the", "a", "an", "in", "on", "with"]);

function toTitleCase(input: string): string {
  return input
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) =>
      i > 0 && TITLE_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");
}

export function formatOptionValue(raw: string): string {
  if (!raw) return "";
  let v = translateCJK(raw).trim();
  // Insert space between number and letters: "8head" -> "8 head", "12HEAD" -> "12 HEAD"
  v = v.replace(/(\d+)\s*([a-zA-Z])/g, "$1 $2");
  v = v.replace(/([a-zA-Z])(\d+)/g, "$1 $2");
  // Normalize "headed" / "head" -> "Heads" when paired with number
  v = v.replace(/\b(\d+)\s*head(ed)?s?\b/gi, "$1 Heads");
  v = v.replace(/\b(\d+)\s*(light|lights|lamp|lamps|bulb|bulbs)\b/gi, "$1 Lights");
  // Collapse whitespace
  v = v.replace(/\s+/g, " ").trim();
  if (!v) return "";
  return toTitleCase(v);
}

export interface VariantLike {
  title?: string;
  selectedOptions?: Array<{ name: string; value: string }>;
}

export function formatVariantTitle(variant: VariantLike | null | undefined): string {
  if (!variant) return "";
  const opts = variant.selectedOptions ?? [];
  const meaningful = opts.filter(
    (o) => o.value && o.value.toLowerCase() !== "default title",
  );
  if (meaningful.length > 0) {
    return meaningful.map((o) => formatOptionValue(o.value)).filter(Boolean).join(" · ");
  }
  const t = (variant.title ?? "").trim();
  if (!t || t.toLowerCase() === "default title") return "";
  return t
    .split("/")
    .map((p) => formatOptionValue(p))
    .filter(Boolean)
    .join(" · ");
}
