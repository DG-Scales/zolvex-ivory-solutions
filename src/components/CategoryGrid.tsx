import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/categories";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          to="/categories/$slug"
          params={{ slug: cat.slug }}
          className="group relative block overflow-hidden rounded-lg bg-muted aspect-[4/5]"
        >
          <img
            src={cat.image}
            alt={cat.name}
            loading="lazy"
            width={800}
            height={1000}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-background">
            <h3 className="font-display text-2xl leading-tight">{cat.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] opacity-80">Shop {cat.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
