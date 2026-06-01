import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-tight">Zolvex</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="/#shop" className="hover:opacity-60 transition-opacity">Shop</a>
          <a href="/#about" className="hover:opacity-60 transition-opacity">About</a>
          <a href="/#contact" className="hover:opacity-60 transition-opacity">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
