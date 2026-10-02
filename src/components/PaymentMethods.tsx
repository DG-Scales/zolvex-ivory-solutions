import visaLogo from "@/assets/hosted/visa.svg";
import mastercardLogo from "@/assets/hosted/mastercard.svg";
import amexLogo from "@/assets/hosted/amex.svg";
import applePayLogo from "@/assets/hosted/applepay.svg";
import googlePayLogo from "@/assets/hosted/googlepay.svg";
import shopPayLogo from "@/assets/hosted/shoppay.svg";

const paymentLogos = [
  { src: visaLogo, alt: "Visa" },
  { src: mastercardLogo, alt: "Mastercard" },
  { src: amexLogo, alt: "American Express" },
  { src: applePayLogo, alt: "Apple Pay" },
  { src: googlePayLogo, alt: "Google Pay" },
  { src: shopPayLogo, alt: "Shop Pay" },
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
