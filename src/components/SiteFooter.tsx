import { Link } from "@tanstack/react-router";
import { ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { Logo } from "./Logo";
import visaLogo from "@/assets/visa.svg.asset.json";
import mastercardLogo from "@/assets/mastercard.svg.asset.json";
import amexLogo from "@/assets/amex.svg.asset.json";
import applePayLogo from "@/assets/applepay.svg.asset.json";
import googlePayLogo from "@/assets/googlepay.svg.asset.json";
import shopPayLogo from "@/assets/shoppay.svg.asset.json";

const paymentLogos = [
  { src: visaLogo.url, alt: "Visa" },
  { src: mastercardLogo.url, alt: "Mastercard" },
  { src: amexLogo.url, alt: "American Express" },
  { src: applePayLogo.url, alt: "Apple Pay" },
  { src: googlePayLogo.url, alt: "Google Pay" },
  { src: shopPayLogo.url, alt: "Shop Pay" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo size="md" showTagline />
          <p className="mt-8 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Zolvex — premium designer lighting for considered interiors and exteriors. Chandeliers, pendants, wall lights and more.
          </p>
          <div className="mt-6 max-w-xs">
            <p className="text-xs text-muted-foreground mb-3">We accept these payment methods</p>
            <div className="flex flex-wrap items-center gap-2">
              {paymentLogos.map((logo) => (
                <div
                  key={logo.alt}
                  className="h-7 w-11 bg-white rounded-[3px] flex items-center justify-center p-0.5 ring-1 ring-black/5"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Truck className="w-3.5 h-3.5" />
                <span>Fast shipping</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Easy returns</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-display text-lg mb-5 text-foreground">Shop</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
            <li><Link to="/shipping" className="hover:text-foreground transition-colors">Shipping</Link></li>
            <li><Link to="/returns" className="hover:text-foreground transition-colors">Returns</Link></li>
            <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-display text-lg mb-5 text-foreground">Company</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
            <li><Link to="/story" className="hover:text-foreground transition-colors">Our Story</Link></li>
            <li><Link to="/craftsmanship" className="hover:text-foreground transition-colors">Craftsmanship</Link></li>
            <li><Link to="/sustainability" className="hover:text-foreground transition-colors">Sustainability</Link></li>
            <li><Link to="/wholesale" className="hover:text-foreground transition-colors">Wholesale</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
          </ul>
        </div>


        <div className="md:col-span-3">
          <h4 className="font-display text-lg mb-5 text-foreground">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <a href="mailto:zolvex.business@gmail.com" className="hover:text-foreground transition-colors break-all">
                zolvex.business@gmail.com
              </a>
            </li>
            <li>
              <a href="https://instagram.com/zolvex.lighting" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                @zolvex.lighting
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row justify-between text-xs text-muted-foreground gap-2">
          <p>© 2026 Zolvex. All rights reserved.</p>
          <p>Crafted with intention.</p>
        </div>
      </div>
    </footer>
  );
}
