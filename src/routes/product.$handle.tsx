import { createFileRoute, Link, useParams, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProductByHandle, fetchProducts } from "@/lib/shopify";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, Share2, Headphones, Truck, ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useCartSync } from "@/hooks/useCartSync";
import { formatVariantTitle, formatOptionValue } from "@/lib/variantTitle";
import { parseDescription } from "@/lib/parseSpecs";
import { toast } from "sonner";
import { PromoBox } from "@/components/PromoBox";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$handle")({
  component: ProductPage,
});

function ProductPage() {
  useCartSync();
  const { handle } = useParams({ from: "/product/$handle" });
  const location = useLocation();

  useEffect(() => {
    const existing = document.getElementById("jm") as HTMLScriptElement | null;
    if (existing) {
      existing.remove();
    }
    const script = document.createElement("script");
    script.id = "jm";
    script.src = "https://cdn.judge.me/assets/widget.js";
    script.async = true;
    script.onload = () => {
      if (window.jm) {
        window.jm("init", { shop: "zolvex-solutions-hub-pnf34.myshopify.com" });
      }
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [handle]);
  const fromCategory = new URLSearchParams(location.search).get("from");
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle),
  });
  const { data: allProducts } = useQuery({
    queryKey: ["products", "related"],
    queryFn: () => fetchProducts(24),
  });

  const [variantIndex, setVariantIndex] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const trackWidthRef = useRef<number>(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl px-6 py-10 w-full">
        {fromCategory ? (
          <Link to="/categories/$slug" params={{ slug: fromCategory }} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
        ) : (
          <Link to="/categories" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
        )}

        {isLoading ? (
          <div className="flex justify-center py-32"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : !product ? (
          <div className="text-center py-32">
            <p className="font-display text-3xl mb-2">Product not found</p>
            <Link to="/" className="text-sm underline">Return to shop</Link>
          </div>
        ) : (
          (() => {
            const images = product.images.edges;
            const variant = product.variants.edges[variantIndex]?.node;
            const { prose, specs } = parseDescription(product.description);

            let _h = 0;
            for (let i = 0; i < product.id.length; i++) _h = (_h * 31 + product.id.charCodeAt(i)) >>> 0;
            const discountPct = 10 + (_h % 16);
            const currentAmt = parseFloat(variant?.price.amount || "0");
            const beforeAmt = currentAmt / (1 - discountPct / 100);


            const scrollToIndex = (i: number) => {
              const next = (i + images.length) % images.length;
              setImageIndex(next);
            };

            const advanceGallery = (direction: -1 | 1) => {
              scrollToIndex(imageIndex + direction);
            };

            const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
              touchStartXRef.current = event.touches[0].clientX;
              touchStartYRef.current = event.touches[0].clientY;
              trackWidthRef.current = event.currentTarget.clientWidth;
              setIsDragging(true);
            };

            const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
              const startX = touchStartXRef.current;
              const startY = touchStartYRef.current;
              if (startX === null || startY === null) return;
              const dx = event.touches[0].clientX - startX;
              const dy = event.touches[0].clientY - startY;
              if (Math.abs(dy) > Math.abs(dx)) return;
              // Add resistance at the edges
              let next = dx;
              if ((imageIndex === 0 && dx > 0) || (imageIndex === images.length - 1 && dx < 0)) {
                next = dx * 0.35;
              }
              setDragOffset(next);
            };

            const handleTouchEnd = () => {
              const width = trackWidthRef.current || 1;
              const offset = dragOffset;
              touchStartXRef.current = null;
              touchStartYRef.current = null;
              setIsDragging(false);
              setDragOffset(0);
              const threshold = Math.min(80, width * 0.18);
              if (Math.abs(offset) > threshold) {
                advanceGallery(offset < 0 ? 1 : -1);
              }
            };

            return (
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                <div>
                  <div className="relative">
                    <div
                      className="aspect-[4/5] bg-muted rounded-md overflow-hidden mb-4 relative touch-pan-y select-none"
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onTouchCancel={handleTouchEnd}
                    >
                      <div
                        className="flex h-full will-change-transform"
                        style={{
                          width: `${images.length * 100}%`,
                          transform: `translate3d(calc(${-imageIndex * (100 / images.length)}% + ${dragOffset}px), 0, 0)`,
                          transition: isDragging
                            ? "none"
                            : "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      >
                        {images.map((img, i) => (
                          <div
                            key={img.node.url || i}
                            className="h-full shrink-0 overflow-hidden"
                            style={{ width: `${100 / images.length}%` }}
                          >
                            <img
                              src={img.node.url}
                              alt={img.node.altText || product.title}
                              className="w-full h-full object-cover"
                              draggable={false}
                              loading={i === 0 ? "eager" : "lazy"}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => advanceGallery(-1)}
                          aria-label="Previous image"
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow-sm z-20"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => advanceGallery(1)}
                          aria-label="Next image"
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow-sm z-20"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => scrollToIndex(i)}
                          className={`aspect-square overflow-hidden rounded transition-opacity duration-300 ${i === imageIndex ? "ring-2 ring-foreground opacity-100" : "opacity-60 hover:opacity-100"}`}
                        >
                          <img src={img.node.url} alt="" className="w-full h-full object-cover" draggable={false} />
                        </button>
                      ))}
                    </div>
                  )}

                  {specs.length > 0 && (
                    <div className="mt-8 border border-border rounded-md p-6 bg-muted/30">
                      <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Specifications</h2>
                      <ul className="space-y-2 text-sm">
                        {specs.map((s, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span><span className="font-medium text-foreground">{s.label}:</span> <span className="text-muted-foreground">{s.value}</span></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="md:py-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h1 className="font-display text-4xl md:text-5xl">{product.title}</h1>
                    <button
                      type="button"
                      onClick={() => {
                        const url = `${window.location.origin}/product/${handle}`;
                        navigator.clipboard.writeText(url).then(() => {
                          toast.success("Link copied to clipboard");
                        });
                      }}
                      aria-label="Share product"
                      className="shrink-0 h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors mt-1"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-2xl font-display mb-3 flex items-center gap-3 flex-wrap">
                    <span>{variant?.price.currencyCode} {currentAmt.toFixed(2)}</span>
                    <span className="text-foreground line-through opacity-70 text-lg">{variant?.price.currencyCode} {beforeAmt.toFixed(2)}</span>
                    <span className="inline-flex items-center justify-center bg-black text-white text-xs font-semibold px-2 py-1 rounded">-{discountPct}%</span>
                  </p>
                  <div
                    className="mb-8 flex items-center gap-0 text-[11px] overflow-hidden rounded-sm border border-border w-fit cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {
                      navigator.clipboard.writeText("SMRDLZ20").then(() => {
                        toast.success("Code copied to clipboard");
                      });
                    }}
                  >
                    <span className="px-2.5 py-1.5 bg-foreground text-background uppercase tracking-[0.18em] font-medium">
                      Code: SMRDLZ20
                    </span>
                    <span className="px-2.5 py-1.5 font-semibold tabular-nums">
                      {variant?.price.currencyCode} {(currentAmt * 0.8).toFixed(2)}
                    </span>
                  </div>

                  <div className="prose prose-sm text-muted-foreground mb-10 whitespace-pre-line leading-relaxed">
                    {prose || "A considered solution. More details coming soon."}
                  </div>

                  <div id="judgeme_product_reviews" data-handle={handle} className="mb-10" />

                  {(() => {
                    const allVariants = product.variants.edges.map((e) => e.node);
                    const rawOptions = (product.options || []).filter(
                      (o) => !(o.values.length === 1 && o.values[0]?.toLowerCase() === "default title"),
                    );
                    if (rawOptions.length === 0 || allVariants.length <= 1) return null;

                    const isTempName = (n: string) => /light|temp|kelvin|color\s*temp/i.test(n);
                    const isColorName = (n: string) => /color|colour|finish/i.test(n) && !isTempName(n);
                    const options = [...rawOptions].sort((a, b) => {
                      const score = (n: string) => (isTempName(n) ? 0 : isColorName(n) ? 2 : 1);
                      return score(a.name) - score(b.name);
                    });

                    const currentSel: Record<string, string> = {};
                    for (const o of variant?.selectedOptions || []) currentSel[o.name] = o.value;

                    const findExact = (sel: Record<string, string>) =>
                      allVariants.findIndex((v) =>
                        (v.selectedOptions || []).every((o) => sel[o.name] === o.value),
                      );

                    const pickVariant = (optName: string, value: string) => {
                      const desired = { ...currentSel, [optName]: value };
                      let idx = findExact(desired);
                      if (idx < 0) {
                        // Find variants that match the clicked option, then pick the one
                        // that overlaps most with the current selection.
                        const candidates = allVariants
                          .map((v, i) => {
                            const map: Record<string, string> = {};
                            for (const o of v.selectedOptions || []) map[o.name] = o.value;
                            if (map[optName] !== value) return null;
                            let score = 0;
                            for (const n of Object.keys(currentSel)) {
                              if (n !== optName && map[n] === currentSel[n]) score++;
                            }
                            return { i, score, available: v.availableForSale };
                          })
                          .filter(Boolean) as Array<{ i: number; score: number; available: boolean }>;
                        candidates.sort(
                          (a, b) => b.score - a.score || Number(b.available) - Number(a.available),
                        );
                        idx = candidates[0]?.i ?? -1;
                      }
                      if (idx < 0) return;
                      setVariantIndex(idx);
                      const v = allVariants[idx];
                      const target = v.image?.url;
                      if (target) {
                        const imgIdx = images.findIndex((img) => img.node.url === target);
                        if (imgIdx >= 0) {
                          scrollToIndex(imgIdx);
                          return;
                        }
                      }
                      const needles = (v.selectedOptions || [])
                        .map((o) => o.value?.toLowerCase())
                        .filter(Boolean) as string[];
                      if (needles.length) {
                        const imgIdx = images.findIndex((img) => {
                          const alt = (img.node.altText || "").toLowerCase();
                          return needles.some((n) => alt.includes(n));
                        });
                        if (imgIdx >= 0) scrollToIndex(imgIdx);
                      }
                    };

                    const labelFor = (name: string) => {
                      if (isTempName(name)) return "Light Color";
                      return formatOptionValue(name) || name;
                    };

                    return (
                      <div className="mb-8 space-y-5">
                        {options.map((opt) => {
                          const selected = currentSel[opt.name];
                          return (
                            <div key={opt.name}>
                              <p className="text-sm mb-2">
                                <span className="text-muted-foreground">{labelFor(opt.name)} : </span>
                                <span className="font-medium">{formatOptionValue(selected || "") || selected}</span>
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {[...opt.values]
                                  .sort((a, b) =>
                                    (formatOptionValue(a) || a).localeCompare(
                                      formatOptionValue(b) || b,
                                      undefined,
                                      { numeric: true, sensitivity: "base" },
                                    ),
                                  )
                                  .map((val) => {
                                  const isSelected = val === selected;
                                  return (
                                    <button
                                      key={val}
                                      type="button"
                                      onClick={() => pickVariant(opt.name, val)}
                                      className={`px-4 py-2 text-sm border rounded-md transition-colors ${isSelected ? "bg-foreground text-background border-foreground" : "hover:border-foreground"}`}
                                    >
                                      {formatOptionValue(val) || val}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  <Button
                    size="lg"
                    className="w-full rounded-full"
                    disabled={!variant || !variant.availableForSale || isAdding}
                    onClick={async () => {
                      if (!variant) return;
                      await addItem({
                        product: { node: product },
                        variantId: variant.id,
                        variantTitle: variant.title,
                        price: variant.price,
                        quantity: 1,
                        selectedOptions: variant.selectedOptions || [],
                      });
                      toast.success("Added to bag", { description: product.title });
                    }}
                  >
                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : variant?.availableForSale ? "Add to bag" : "Sold out"}
                  </Button>
                  <div className="mt-4">
                    <PromoBox />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Headphones className="w-3.5 h-3.5" /> 24/7 Customer Support</span>
                    <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Free Shipping</span>
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Secure Payment</span>
                  </div>
                </div>
              </div>
            );
          })()
        )}

        {product && allProducts && allProducts.length > 1 && (
          <section className="mt-20 border-t border-border pt-10">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-display text-2xl md:text-3xl tracking-tight">You may also like</h2>
              <Link to="/categories" className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground">
                Shop all
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(() => {
                const pool = allProducts.filter((p) => p.node.handle !== product.handle);
                let seed = 0;
                for (let i = 0; i < product.id.length; i++) seed = (seed * 31 + product.id.charCodeAt(i)) >>> 0;
                const scored = pool
                  .map((p, i) => {
                    let h = seed ^ i;
                    for (let j = 0; j < p.node.id.length; j++) h = (h * 131 + p.node.id.charCodeAt(j)) >>> 0;
                    return { p, h };
                  })
                  .sort((a, b) => a.h - b.h)
                  .slice(0, 4);
                return scored.map(({ p }) => <ProductCard key={p.node.id} product={p} />);
              })()}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
