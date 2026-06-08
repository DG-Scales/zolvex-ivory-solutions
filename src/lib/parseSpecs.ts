// Splits a Shopify product description into prose and a list of spec key/value pairs.
// Shopify descriptions often run together as one string with a "Product Information"
// (or similar) heading followed by concatenated "Key: Value" pairs.

const SECTION_MARKERS = [
  "Product Information",
  "Product Details",
  "Specifications",
  "Specification",
  "Tech Specs",
  "Technical Specifications",
];

export interface ParsedDescription {
  prose: string;
  specs: Array<{ label: string; value: string }>;
}

export function parseDescription(description: string | null | undefined): ParsedDescription {
  const text = (description || "").trim();
  if (!text) return { prose: "", specs: [] };

  // Find earliest marker
  let splitIdx = -1;
  let markerLen = 0;
  for (const m of SECTION_MARKERS) {
    const idx = text.toLowerCase().indexOf(m.toLowerCase());
    if (idx >= 0 && (splitIdx === -1 || idx < splitIdx)) {
      splitIdx = idx;
      markerLen = m.length;
    }
  }

  if (splitIdx === -1) return { prose: text, specs: [] };

  const prose = text.slice(0, splitIdx).trim();
  const specsBlock = text.slice(splitIdx + markerLen).trim();

  // Split into "Key: Value" pairs. Keys start with a capital letter, may contain
  // additional lowercase words, and are followed by ": ".
  const pairs: Array<{ label: string; value: string }> = [];
  const regex = /([A-Z][A-Za-z]*(?:\s+[a-z]+){0,4})\s*:\s*/g;
  const matches: Array<{ label: string; start: number; end: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(specsBlock)) !== null) {
    matches.push({ label: m[1].trim(), start: m.index, end: m.index + m[0].length });
  }
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const next = matches[i + 1];
    const value = specsBlock.slice(cur.end, next ? next.start : specsBlock.length).trim();
    if (value) pairs.push({ label: cur.label, value });
  }

  if (pairs.length === 0) return { prose: text, specs: [] };
  return { prose, specs: pairs };
}
