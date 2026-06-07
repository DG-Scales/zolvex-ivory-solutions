import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { categories, matchesCategory } from "@/lib/categories";
import { fetchProducts } from "@/lib/shopify";

export function CategoryGrid() {
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(120),
  });
  const products = data ?? [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {categories.map((cat) => {
        const cover = products.find((p) =>
          matchesCategory(cat, p.node.title, p.node.description) &&
          p.node.images.edges[0]?.node?.url
        );
        const image = cover?.node.images.edges[0]?.node.url;
        return (
          <Link
            key={cat.slug}
            to="/categories/$slug"
            params={{ slug: cat.slug }}
            className="group relative block overflow-hidden rounded-lg bg-muted aspect-[4/5]"
          >
            {image ? (
              <img
                src={image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-background">
              <h3 className="font-display text-2xl leading-tight">{cat.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] opacity-80">Shop {cat.name}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
