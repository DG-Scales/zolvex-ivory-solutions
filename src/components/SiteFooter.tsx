import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-32">
      <div className="mx-auto max-w-7xl px-6 py-20 flex flex-col items-center text-center">
        <Logo size="lg" showTagline />
        <p className="mt-8 text-sm text-muted-foreground max-w-md italic font-display text-lg">
          Where problems meet solutions.
        </p>
        <nav className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <a href="/#shop" className="hover:text-foreground">Shop</a>
          <a href="/#about" className="hover:text-foreground">About</a>
          <a href="/#contact" className="hover:text-foreground">Contact</a>
          <a href="/privacy" className="hover:text-foreground">Privacy</a>
        </nav>
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
