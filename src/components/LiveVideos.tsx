import { useState, useRef, useEffect } from "react";
import liveVideo1 from "@/assets/live-video-1.mp4.asset.json";
import liveVideo2 from "@/assets/live-video-2.mp4.asset.json";
import liveVideo3 from "@/assets/live-video-3.mp4.asset.json";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const videos = [
  { url: liveVideo1.url },
  { url: liveVideo2.url },
  { url: liveVideo3.url },
];

export function LiveVideos() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (openIndex !== null && modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => {});
    }
  }, [openIndex]);

  return (
    <section className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 w-full">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            In motion
          </p>
          <h2 className="font-display text-3xl md:text-4xl">
            Live videos of products
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
            See our fixtures alive — light, material and movement, captured in
            the room.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {videos.map((v, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpenIndex(i)}
              className="relative aspect-[9/16] overflow-hidden rounded-md bg-muted text-left cursor-pointer group"
            >
              <video
                src={v.url}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-foreground ml-0.5"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black border-none">
          <DialogTitle className="sr-only">
            {openIndex !== null ? `Live video ${openIndex + 1}` : "Live video"}
          </DialogTitle>
          {openIndex !== null && (
            <div className="relative aspect-[9/16] md:aspect-video w-full bg-black">
              <video
                ref={modalVideoRef}
                src={videos[openIndex].url}
                className="absolute inset-0 h-full w-full object-contain"
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
