import { useEffect, useRef } from "react";
import { Globe } from "lucide-react";

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages?: string; layout?: number },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

export function GoogleTranslateWidget() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
      return;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="relative flex items-center">
      <div id="google_translate_element" className="gt-widget" />
      <Globe className="w-4 h-4 pointer-events-none absolute left-2 text-muted-foreground" />
    </div>
  );
}
