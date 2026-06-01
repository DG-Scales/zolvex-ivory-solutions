export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-32">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-3xl">Zolvex</div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm italic font-display text-lg">
            Where problems meet solutions.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/#shop" className="hover:opacity-60">All Products</a></li>
            <li><a href="/#shop" className="hover:opacity-60">New Arrivals</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/#about" className="hover:opacity-60">About</a></li>
            <li><a href="/#contact" className="hover:opacity-60">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row justify-between text-xs text-muted-foreground gap-2">
          <p>© {new Date().getFullYear()} Zolvex. All rights reserved.</p>
          <p>Crafted with intention.</p>
        </div>
      </div>
    </footer>
  );
}
