import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

function VisaLogo() {
  return (
    <svg viewBox="0 0 48 16" fill="none" className="h-5 w-auto">
      <rect width="48" height="16" rx="2" fill="#1A1F71" />
      <path d="M20.2 12.1L22.6 3.9H24.7L22.3 12.1H20.2ZM32.3 3.9L30.2 9.5L29.8 7.8C29.1 6.2 27.7 4.7 26 3.9H28.5L29.9 8.3L32 3.9H32.3ZM17.3 12.1L15.2 4.1C15.1 3.6 14.7 3.3 14.2 3.2C13.4 3 12.5 2.9 11.6 2.9V4.1C12.2 4.1 12.7 4.2 13.1 4.4L15.5 12.1H17.3ZM9.8 3.9H6.5L6.4 4C3.8 4.6 2 6.1 2 8.1C2 10.4 4.5 11.2 6.1 11.7C7.2 12.1 7.9 12.4 7.9 13C7.9 13.8 6.8 14.2 5.8 14.2C4.4 14.2 3.6 13.9 3 13.6L2.7 13.5L2.3 15.4C2.9 15.7 4.2 16.1 5.7 16.1C9.1 16.1 11.3 14.4 11.3 12.2C11.3 10.7 10.1 9.8 8.1 9.2C6.7 8.8 5.9 8.4 5.9 7.8C5.9 7.3 6.5 6.8 7.8 6.6C8.6 6.5 9.4 6.6 10 6.8L10.3 6.9L10.7 5.1L10.5 5C10 4.8 9.3 4.7 8.5 4.7C8 4.7 7.4 4.7 6.9 4.9L6.9 4.9L9.8 3.9ZM41.4 3.9H39.3C38.7 3.9 38.3 4.1 38.1 4.6L34.3 12.1H36.6L37.1 10.7H40.6L41 12.1H43L41.4 3.9ZM37.8 9L39.3 5.4L40.1 9H37.8ZM25.4 3.9L23.3 12.1H25.4L27.5 3.9H25.4Z" fill="white" />
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 48 16" fill="none" className="h-5 w-auto">
      <rect width="48" height="16" rx="2" fill="white" />
      <circle cx="19" cy="8" r="5" fill="#EB001B" />
      <circle cx="25" cy="8" r="5" fill="#F79E1B" />
      <path d="M22 4.2C23.3 5.2 24 6.5 24 8C24 9.5 23.3 10.8 22 11.8C20.7 10.8 20 9.5 20 8C20 6.5 20.7 5.2 22 4.2Z" fill="#FF5F00" />
    </svg>
  );
}

function AmexLogo() {
  return (
    <svg viewBox="0 0 48 16" fill="none" className="h-5 w-auto">
      <rect width="48" height="16" rx="2" fill="#006FCF" />
      <path d="M6 4.5H12L14.5 8L12 11.5H6V4.5ZM8 6V10H9.5L11 8L9.5 6H8ZM12.5 6L11.5 7.2L12.5 8.3V6Z" fill="white" />
      <text x="16" y="10" fill="white" fontSize="6" fontWeight="bold" fontFamily="Arial, sans-serif">AMEX</text>
    </svg>
  );
}

function DiscoverLogo() {
  return (
    <svg viewBox="0 0 48 16" fill="none" className="h-5 w-auto">
      <rect width="48" height="16" rx="2" fill="#FF6000" />
      <text x="5" y="10.5" fill="white" fontSize="5.5" fontWeight="bold" fontFamily="Arial, sans-serif">DISCOVER</text>
      <circle cx="40" cy="8" r="4" fill="white" />
    </svg>
  );
}

function ApplePayLogo() {
  return (
    <svg viewBox="0 0 48 16" fill="none" className="h-5 w-auto">
      <rect width="48" height="16" rx="2" fill="black" />
      <text x="4" y="10.5" fill="white" fontSize="5.5" fontWeight="600" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">Pay</text>
      <path d="M12.5 6.5C12.5 5.8 13 5.2 13.7 5.2C14 5.2 14.3 5.3 14.5 5.5C14.3 5.8 14.1 6.1 14.1 6.4C14.1 7.1 14.6 7.6 15.2 7.6C15.2 7.6 15.2 7.6 15.3 7.6C15.2 8.3 14.7 9.1 14 9.1C13.7 9.1 13.5 9 13.3 8.8C13.1 9 12.8 9.1 12.5 9.1C11.8 9.1 11.3 8.3 11.3 7.4C11.3 6 12.4 5.2 12.5 6.5Z" fill="white" />
      <path d="M13.1 4.5C13.4 4.2 13.5 3.8 13.5 3.5C13.2 3.5 12.8 3.7 12.5 4C12.3 4.2 12.1 4.6 12.1 5C12.4 5 12.8 4.8 13.1 4.5Z" fill="white" />
    </svg>
  );
}

function GooglePayLogo() {
  return (
    <svg viewBox="0 0 48 16" fill="none" className="h-5 w-auto">
      <rect width="48" height="16" rx="2" fill="white" />
      <path d="M18 6.5C18 6.1 18.3 5.8 18.7 5.8C19.1 5.8 19.4 6.1 19.4 6.5V7.2H18V6.5ZM16.2 6.5C16.2 6.1 16.5 5.8 16.9 5.8C17.3 5.8 17.6 6.1 17.6 6.5V7.2H16.2V6.5Z" fill="#EA4335" />
      <path d="M16.9 4.5C16.3 4.5 15.8 4.7 15.4 5.1L15.9 5.6C16.2 5.3 16.5 5.2 16.9 5.2C17.7 5.2 18.3 5.8 18.3 6.6V7.2H18.9V6.6C18.9 5.5 18 4.5 16.9 4.5Z" fill="#4285F4" />
      <path d="M15.4 5.1C15 5.5 14.8 6 14.8 6.5V7.2H15.4V6.5C15.4 6.1 15.7 5.8 16.1 5.8L15.4 5.1Z" fill="#34A853" />
      <path d="M14.8 6.5C14.8 7 15 7.5 15.4 7.9L15.9 7.4C15.6 7.1 15.4 6.8 15.4 6.5H14.8Z" fill="#FBBC04" />
      <text x="22" y="10.5" fill="#5F6368" fontSize="6" fontWeight="500" fontFamily="Arial, sans-serif">G Pay</text>
    </svg>
  );
}

function ShopPayLogo() {
  return (
    <svg viewBox="0 0 48 16" fill="none" className="h-5 w-auto">
      <rect width="48" height="16" rx="2" fill="#5A31F4" />
      <path d="M8 5.5C8 4.7 8.6 4.2 9.4 4.2C10.1 4.2 10.5 4.6 10.7 5.1L10.1 5.4C10 5.1 9.7 4.8 9.4 4.8C9 4.8 8.7 5.1 8.7 5.5V6.5C8.7 6.9 9 7.2 9.4 7.2C9.7 7.2 10 7 10.1 6.6L10.7 6.9C10.5 7.4 10.1 7.8 9.4 7.8C8.6 7.8 8 7.3 8 6.5V5.5Z" fill="white" />
      <path d="M11.3 4.3H12V7.7H11.3V4.3Z" fill="white" />
      <path d="M13.5 6.2C13.5 5.8 13.8 5.5 14.2 5.5C14.6 5.5 14.9 5.8 14.9 6.2V7.7H14.2V6.2C14.2 5.8 14 5.5 13.6 5.5C13.2 5.5 13 5.8 13 6.2V7.7H12.3V5.6H13V6C13.1 5.7 13.3 5.5 13.6 5.5C13.9 5.5 14.1 5.6 14.2 5.8V5.6H14.9V7.7H14.2V6.2H13.5Z" fill="white" />
      <text x="17" y="10.5" fill="white" fontSize="6" fontWeight="600" fontFamily="Arial, sans-serif">Pay</text>
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo size="md" showTagline />
          <p className="mt-8 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Zolvex — premium designer lighting for considered interiors and exteriors. Chandeliers, pendants, wall lights and more.
          </p>
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
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground text-center">We accept these payment methods</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <VisaLogo />
            <MastercardLogo />
            <AmexLogo />
            <DiscoverLogo />
            <ApplePayLogo />
            <GooglePayLogo />
            <ShopPayLogo />
          </div>
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
