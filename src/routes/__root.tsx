import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "../components/Sonner";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" },
      { title: "Zolvex – Where Design Comes to Light" },
      { name: "description", content: "Shop 150+ premium chandeliers, pendant lights, wall sconces & outdoor fixtures. Free shipping on all US orders." },
      { property: "og:title", content: "Zolvex – Where Design Comes to Light" },
      { property: "og:description", content: "Shop 150+ premium chandeliers, pendant lights, wall sconces & outdoor fixtures. Free shipping on all US orders." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://zolvex.org" },
      { property: "og:site_name", content: "Zolvex" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Zolvex – Where Design Comes to Light" },
      { name: "twitter:description", content: "Shop 150+ premium chandeliers, pendant lights, wall sconces & outdoor fixtures. Free shipping on all US orders." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});


function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
     <head>
  <HeadContent />
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-NJD4V4K981"></script>
  <script dangerouslySetInnerHTML={{__html: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    // send_page_view:false — SPA route changes fire page_view manually in RootComponent.
    gtag('config', 'G-NJD4V4K981', { send_page_view: false });
  `}} />
  <script type="text/javascript" src="https://onsite.optimonk.com/script.js?account=271410" async />
</head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Import lazily to avoid SSR touching window.
    let cancelled = false;
    void import("../lib/analytics").then(({ trackPageView, ensureShopifyVisitor, ensureShopifySession }) => {
      if (cancelled) return;
      ensureShopifyVisitor();
      ensureShopifySession();
      // Initial load page_view (gtag config has send_page_view:false).
      trackPageView(window.location.pathname + window.location.search);
      const unsub = router.subscribe("onResolved", () => {
        const loc = router.state.location;
        trackPageView(loc.pathname + loc.searchStr);
      });
      // Store unsubscribe on window so the cleanup below can call it.
      (window as unknown as { __zolvexRouterUnsub?: () => void }).__zolvexRouterUnsub = unsub;
    });
    return () => {
      cancelled = true;
      const w = window as unknown as { __zolvexRouterUnsub?: () => void };
      w.__zolvexRouterUnsub?.();
      w.__zolvexRouterUnsub = undefined;
    };
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}

