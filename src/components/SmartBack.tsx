import { useEffect, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

type Props = {
  fallbackTo: string;
  fallbackParams?: Record<string, string>;
  label?: string;
  className?: string;
  showIcon?: boolean;
};

/**
 * Back link that returns to the actual previous in-app page when available,
 * falling back to a provided route (e.g. /categories) otherwise.
 */
export function SmartBack({
  fallbackTo,
  fallbackParams,
  label = "Back",
  className = "",
  showIcon = true,
}: Props) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Same-origin referrer means the user navigated here from within the site.
    const ref = document.referrer;
    const sameOrigin = ref && ref.startsWith(window.location.origin) && ref !== window.location.href;
    // history.length > 1 also indicates prior entries in this tab session.
    setCanGoBack(Boolean(sameOrigin) || window.history.length > 1);
  }, []);

  const content = (
    <>
      {showIcon && <ArrowLeft className="w-4 h-4 mr-2" />} {label}
    </>
  );

  if (canGoBack) {
    return (
      <button
        type="button"
        onClick={() => router.history.back()}
        className={className}
      >
        {content}
      </button>
    );
  }

  return (
    <Link to={fallbackTo as never} params={fallbackParams as never} className={className}>
      {content}
    </Link>
  );
}
