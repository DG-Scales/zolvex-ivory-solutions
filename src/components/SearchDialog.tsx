import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { categories } from "@/lib/categories";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";

// Damerau-Levenshtein-ish distance for typo tolerance
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }
  return dp[m][n];
}

function fuzzyScore(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  if (t.includes(q)) return -1000 + t.indexOf(q); // best — substring
  const words = t.split(/[\s\-_/,.]+/).filter(Boolean);
  const qWords = q.split(/\s+/).filter(Boolean);
  let total = 0;
  let matched = 0;
  for (const qw of qWords) {
    let best = Infinity;
    for (const w of words) {
      if (!w) continue;
      if (w.includes(qw) || qw.includes(w)) { best = Math.min(best, 0); continue; }
      // prefix match — very lenient
      const pref = Math.min(qw.length, w.length, 3);
      if (qw.length >= 3 && w.startsWith(qw.slice(0, pref))) {
        best = Math.min(best, 1);
        continue;
      }
      const d = editDistance(qw, w);
      const tol = Math.max(2, Math.floor(qw.length / 2));
      if (d <= tol) best = Math.min(best, d);
    }
    if (best !== Infinity) {
      matched++;
      total += best;
    } else {
      total += qw.length; // partial-match penalty instead of hard reject
    }
  }
  // require at least one token to match somehow
  if (matched === 0) return Infinity;
  return total;
}


export function SearchDialog({ overlay = false }: { overlay?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const { data: products = [] } = useQuery({
    queryKey: ["products", "search"],
    queryFn: () => fetchProducts(250),
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });


  const filteredCategories = q
    ? categories
        .map((c) => ({
          c,
          score: fuzzyScore(c.name + " " + (c.keywords ?? []).join(" "), q),
        }))
        .filter((x) => x.score !== Infinity)
        .sort((a, b) => a.score - b.score)
        .map((x) => x.c)
    : categories;

  const productSuggestions = useMemo(() => {
    if (!q.trim()) return [] as ShopifyProduct[];
    return products
      .map((p) => {
        const titleScore = fuzzyScore(p.node.title, q);
        const handleScore = fuzzyScore(p.node.handle.replace(/-/g, " "), q);
        const descScore = fuzzyScore((p.node.description ?? "").slice(0, 200), q);
        const score = Math.min(
          titleScore,
          handleScore + 1,
          descScore === Infinity ? Infinity : descScore + 4,
        );
        return { p, score };
      })
      .filter((x) => x.score !== Infinity)
      .sort((a, b) => a.score - b.score)
      .slice(0, 12)
      .map((x) => x.p);
  }, [products, q]);


  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (productSuggestions[0]) {
      setOpen(false);
      setQ("");
      navigate({ to: "/product/$handle", params: { handle: productSuggestions[0].node.handle } });
      return;
    }
    if (filteredCategories[0]) {
      setOpen(false);
      setQ("");
      navigate({ to: "/categories/$slug", params: { slug: filteredCategories[0].slug } });
    }
  }

  const buttonClass = overlay
    ? "inline-flex h-9 w-9 items-center justify-center rounded-full text-background hover:bg-background/10 transition-colors"
    : "inline-flex h-9 w-9 items-center justify-center rounded-full text-background bg-foreground hover:bg-foreground/85 transition-colors";

  const trending = filteredCategories.find((c) => c.slug === "trending");
  const others = filteredCategories.filter((c) => c.slug !== "trending");
  const nothing = q && productSuggestions.length === 0 && filteredCategories.length === 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className={buttonClass}
      >
        <Search className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <form onSubmit={submit} className="border-b">
            <div className="flex items-center gap-3 px-5 py-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products & categories..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </form>
          <div className="max-h-[60vh] overflow-y-auto p-3">
            {productSuggestions.length > 0 && (
              <>
                <p className="px-2 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Products
                </p>
                <div className="mb-2 flex flex-col">
                  {productSuggestions.map((p) => {
                    const img = p.node.images.edges[0]?.node.url;
                    const price = Number(p.node.priceRange.minVariantPrice.amount).toFixed(2);
                    return (
                      <button
                        key={p.node.id}
                        onClick={() => {
                          setOpen(false);
                          setQ("");
                          navigate({ to: "/product/$handle", params: { handle: p.node.handle } });
                        }}
                        className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-muted transition-colors"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                          {img && (
                            <img src={img} alt={p.node.title} loading="lazy" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{p.node.title}</p>
                          <p className="text-xs text-muted-foreground">
                            ${price} {p.node.priceRange.minVariantPrice.currencyCode}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {trending && (
              <>
                <p className="px-2 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Trending
                </p>
                <button
                  onClick={() => {
                    setOpen(false);
                    setQ("");
                    navigate({ to: "/categories/$slug", params: { slug: trending.slug } });
                  }}
                  className="flex w-full items-center gap-3 rounded-md p-3 text-left hover:bg-muted transition-colors mb-2"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded bg-muted">
                    <img src={trending.cover} alt={trending.name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{trending.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{trending.description}</p>
                  </div>
                </button>
              </>
            )}

            {others.length > 0 && (
              <>
                <p className="px-2 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Collections
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {others.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setOpen(false);
                        setQ("");
                        navigate({ to: "/categories/$slug", params: { slug: cat.slug } });
                      }}
                      className="flex items-center gap-3 rounded-md p-3 text-left hover:bg-muted transition-colors"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                        <img src={cat.cover} alt={cat.name} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{cat.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{cat.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {nothing && (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">No matches.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
