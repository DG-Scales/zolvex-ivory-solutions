import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CategoryGrid } from "@/components/CategoryGrid";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "Categories — Zolvex" },
      { name: "description", content: "Browse Zolvex lighting by type or by room — chandeliers, pendants, wall sconces, flush mounts, and exterior fixtures." },
      { property: "og:title", content: "Categories — Zolvex" },
      { property: "og:description", content: "Shop premium designer lighting by type or by room." },
    ],
  }),
  component: CategoriesIndex,
});

function CategoriesIndex() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl px-6 py-20 md:py-24 w-full">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Shop by collection</p>
          <h1 className="font-display text-5xl md:text-6xl">Collections</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Curated lighting collections — from sculptural interior chandeliers to architectural exterior fixtures.
          </p>
        </div>

        <section className="mb-20">
          <h2 className="font-display text-2xl mb-6">Featured</h2>
          <CategoryGrid group="Featured" columns={2} />
        </section>

        <section>
          <h2 className="font-display text-2xl mb-6">Collections</h2>
          <CategoryGrid group="Collection" columns={3} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
