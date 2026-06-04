import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryGrid } from "@/components/CategoryGrid";
import { useCartSync } from "@/hooks/useCartSync";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Lighting — Zolvex" },
      { name: "description", content: "Browse the full Zolvex lighting collection — chandeliers, pendants, wall sconces, floor lamps, and exterior fixtures." },
      { property: "og:title", content: "Shop Lighting — Zolvex" },
      { property: "og:description", content: "Premium designer lighting for interior and exterior spaces." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  useCartSync();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl px-6 py-20 md:py-24 w-full">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">The collection</p>
          <h1 className="font-display text-5xl md:text-6xl">Shop the lighting</h1>
        </div>

        <div className="mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Browse by category</p>
          <CategoryGrid />
        </div>

        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">All pieces</p>
          <h2 className="font-display text-3xl md:text-4xl">Every fixture</h2>
        </div>
        <ProductGrid />
      </main>
      <SiteFooter />
    </div>
  );
}
