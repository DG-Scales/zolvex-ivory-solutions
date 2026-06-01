import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { useCartSync } from "@/hooks/useCartSync";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Zolvex" },
      { name: "description", content: "Browse the full Zolvex collection — curated solutions for everyday problems." },
      { property: "og:title", content: "Shop — Zolvex" },
      { property: "og:description", content: "Browse the full Zolvex collection." },
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
          <h1 className="font-display text-5xl md:text-6xl">Shop everything</h1>
        </div>
        <ProductGrid />
      </main>
      <SiteFooter />
    </div>
  );
}
