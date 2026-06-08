import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProductByHandle } from "@/lib/shopify";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useCartSync } from "@/hooks/useCartSync";
import { formatVariantTitle } from "@/lib/variantTitle";
import { parseDescription } from "@/lib/parseSpecs";
import { toast } from "sonner";

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
  const [imageIndex, setImageIndex] = useState(0);

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
            const mainImage = images[imageIndex]?.node;
            const variant = product.variants.edges[variantIndex]?.node;
            const { prose, specs } = parseDescription(product.description);
            return (
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                <div>
                  <div
                  <div
                    className="aspect-[4/5] bg-muted rounded-md overflow-hidden mb-4 relative"
                    onTouchStart={(e) => {
                      (e.currentTarget as HTMLDivElement).dataset.x = String(e.touches[0].clientX);
                    }}
                    onTouchEnd={(e) => {
                      const start = Number((e.currentTarget as HTMLDivElement).dataset.x || 0);
                      const dx = e.changedTouches[0].clientX - start;
                      if (Math.abs(dx) > 40 && images.length > 1) {
                        setImageIndex((i) =>
                          dx < 0 ? (i + 1) % images.length : (i - 1 + images.length) % images.length,
                        );
                      }
                    }}
                  >
                    {mainImage && <img src={mainImage.url} alt={mainImage.altText || product.title} className="w-full h-full object-cover" />}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
                          aria-label="Previous image"
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow-sm"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                          aria-label="Next image"
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow-sm"
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
                          className={`aspect-square overflow-hidden rounded ${i === imageIndex ? "ring-2 ring-foreground" : "opacity-60"}`}
                        >
                          <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
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
                  <p className="text-2xl font-display mb-8 flex items-baseline gap-3">
                    <span className="text-foreground line-through opacity-70">{variant?.price.currencyCode} {(parseFloat(variant?.price.amount || "0") * 1.1).toFixed(2)}</span>
                    <span>{variant?.price.currencyCode} {parseFloat(variant?.price.amount || "0").toFixed(2)}</span>
                  </p>
                  <div className="prose prose-sm text-muted-foreground mb-10 whitespace-pre-line leading-relaxed">
                    {product.description || "A considered solution. More details coming soon."}
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
