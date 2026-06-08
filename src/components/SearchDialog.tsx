import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { categories } from "@/lib/categories";

export function SearchDialog({ overlay = false }: { overlay?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const filtered = q
    ? categories.filter((c) =>
        (c.name + " " + (c.keywords ?? []).join(" ")).toLowerCase().includes(q.toLowerCase()),
      )
    : categories;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (filtered[0]) {
      setOpen(false);
      setQ("");
      navigate({ to: "/categories/$slug", params: { slug: filtered[0].slug } });
    }
  }

  const buttonClass = overlay
    ? "inline-flex h-9 w-9 items-center justify-center rounded-full text-background hover:bg-background/10 transition-colors"
    : "inline-flex h-9 w-9 items-center justify-center rounded-full text-background bg-foreground hover:bg-foreground/85 transition-colors";

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
                placeholder="Search lighting & categories..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </form>
          <div className="max-h-[50vh] overflow-y-auto p-3">
            {(() => {
              const trending = filtered.find((c) => c.slug === "trending");
              const others = filtered.filter((c) => c.slug !== "trending");
              return (
                <>
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
                          <img
                            src={trending.cover}
                            alt={trending.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{trending.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {trending.description}
                          </p>
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
                              <img
                                src={cat.cover}
                                alt={cat.name}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{cat.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {cat.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {filtered.length === 0 && (
                    <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                      No matches.
                    </p>
                  )}
                </>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
