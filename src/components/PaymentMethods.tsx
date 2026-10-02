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

/**
 * Compact "We accept" payment row shown under the product-page trust row.
 * On mobile the product column uses flex ordering (trust row is order-12),
 * so this sits at order-[13] to always stay directly beneath it.
 */
export function PaymentMethods() {
  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 max-md:order-[13]">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        We accept
      </span>
      <ul
        aria-label="Accepted payment methods"
        className="flex flex-wrap items-center justify-center gap-1.5"
      >
        {paymentLogos.map((logo) => (
          <li
            key={logo.alt}
            className="h-6 w-9 bg-white rounded-[3px] flex items-center justify-center p-0.5 ring-1 ring-black/5"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
