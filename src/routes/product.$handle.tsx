import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProductByHandle } from "@/lib/shopify";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useCartSync } from "@/hooks/useCartSync";

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
            return (
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                <div>
                  <div className="aspect-[4/5] bg-muted rounded-md overflow-hidden mb-4">
                    {mainImage && <img src={mainImage.url} alt={mainImage.altText || product.title} className="w-full h-full object-cover" />}
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
                  <h1 className="font-display text-4xl md:text-5xl mb-4">{product.title}</h1>
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
                            onClick={() => setVariantIndex(i)}
                            className={`px-4 py-2 text-sm border rounded-full transition-colors ${i === variantIndex ? "bg-foreground text-background border-foreground" : "hover:border-foreground"}`}
                          >
                            {v.node.title}
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
