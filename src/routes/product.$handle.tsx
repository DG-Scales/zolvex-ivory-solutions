import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProductByHandle } from "@/lib/shopify";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, Share2, Headphones, Truck, ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useCartSync } from "@/hooks/useCartSync";
import { formatVariantTitle } from "@/lib/variantTitle";
import { parseDescription } from "@/lib/parseSpecs";
import { toast } from "sonner";
import { PromoBox } from "@/components/PromoBox";

export const Route = createFileRoute("/product/$handle")({
  component: ProductPage,
});

function ProductPage() {
  useCartSync();
  const { handle } = useParams({ from: "/product/$handle" });
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle),
  });

  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);
  const [variantIndex, setVariantIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const target = el.children[imageIndex] as HTMLElement | undefined;
    if (!target) return;
    el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  }, [imageIndex]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl px-6 py-10 w-full">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>

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
              const el = galleryRef.current;
              if (!el) return;
              const target = el.children[i] as HTMLElement;
              if (!target) return;
              el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
            };


            return (
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                <div>
                  <div
                    ref={galleryRef}
                    className="aspect-[4/5] bg-muted rounded-md overflow-hidden mb-4 relative flex snap-x snap-mandatory overflow-x-auto scrollbar-hide scroll-smooth"
                  >
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className="w-full h-full shrink-0 snap-center relative"
                      >
                        <img
                          src={img.node.url}
                          alt={img.node.altText || product.title}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      </div>
                    ))}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
                          aria-label="Previous image"
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow-sm z-10"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                          aria-label="Next image"
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow-sm z-10"
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
                          onClick={() => setImageIndex(i)}
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
                  <p className="text-2xl font-display mb-8 flex items-center gap-3 flex-wrap">
                    <span>{variant?.price.currencyCode} {currentAmt.toFixed(2)}</span>
                    <span className="text-foreground line-through opacity-70 text-lg">{variant?.price.currencyCode} {beforeAmt.toFixed(2)}</span>
                    <span className="inline-flex items-center justify-center bg-black text-white text-xs font-semibold px-2 py-1 rounded">-{discountPct}%</span>
                  </p>

                  <div className="prose prose-sm text-muted-foreground mb-10 whitespace-pre-line leading-relaxed">
                    {prose || "A considered solution. More details coming soon."}
                  </div>

                  {product.variants.edges.length > 1 && (
                    <div className="mb-8">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Variant</p>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.edges.map((v, i) => (
                          <button
                            key={v.node.id}
                            onClick={() => {
                              setVariantIndex(i);
                              // Try exact match on variant.image first
                              const target = v.node.image?.url;
                              if (target) {
                                const idx = images.findIndex((img) => img.node.url === target);
                                if (idx >= 0) {
                                  setImageIndex(idx);
                                  return;
                                }
                              }
                              // Fallback: match an image whose alt text contains an option value
                              const needles = (v.node.selectedOptions || [])
                                .map((o) => o.value?.toLowerCase())
                                .filter(Boolean) as string[];
                              if (needles.length) {
                                const idx = images.findIndex((img) => {
                                  const alt = (img.node.altText || "").toLowerCase();
                                  return needles.some((n) => alt.includes(n));
                                });
                                if (idx >= 0) setImageIndex(idx);
                              }
                            }}
                            className={`px-4 py-2 text-sm border rounded-full transition-colors ${i === variantIndex ? "bg-foreground text-background border-foreground" : "hover:border-foreground"}`}
                          >
                            {formatVariantTitle(v.node) || `Option ${i + 1}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    size="lg"
                    className="w-full rounded-full"
                    disabled={isAdding || !variant || !variant.availableForSale}
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
      </main>
      <SiteFooter />
    </div>
  );
}
