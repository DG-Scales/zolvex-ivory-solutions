import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Zolvex" },
      { name: "description", content: "Get in touch with the Zolvex lighting team. We answer every message personally." },
      { property: "og:title", content: "Contact — Zolvex" },
      { property: "og:description", content: "Specification help, custom finishes, or trade enquiries." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl px-6 py-20 md:py-28 w-full">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Contact</p>
        <h1 className="font-display text-5xl md:text-6xl mb-6">Get in touch.</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Specification questions, custom finishes, bespoke chandeliers, or a fixture you wish existed — we read every message.
          Email us at <a href="mailto:zolvex.business@gmail.com" target="_top" className="text-foreground underline underline-offset-4">zolvex.business@gmail.com</a>.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const data = new FormData(form);
            const name = String(data.get("name") || "");
            const email = String(data.get("email") || "");
            const subject = String(data.get("subject") || "Message from Zolvex contact form");
            const message = String(data.get("message") || "");
            const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
            (window.top ?? window).location.href = `mailto:zolvex.business@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            toast.success("Opening your email app to send the message.");
          }}
          className="space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <input name="name" required placeholder="Name" className="w-full px-5 py-3 rounded-full bg-transparent border border-border focus:outline-none focus:border-foreground" />
            <input name="email" required type="email" placeholder="Email" className="w-full px-5 py-3 rounded-full bg-transparent border border-border focus:outline-none focus:border-foreground" />
          </div>
          <input name="subject" placeholder="Subject" className="w-full px-5 py-3 rounded-full bg-transparent border border-border focus:outline-none focus:border-foreground" />
          <textarea name="message" required placeholder="Your message" rows={6} className="w-full px-5 py-4 rounded-3xl bg-transparent border border-border focus:outline-none focus:border-foreground resize-none" />
          <Button type="submit" size="lg" className="rounded-full px-8">Send message</Button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
