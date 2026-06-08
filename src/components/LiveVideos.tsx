import liveVideo1 from "@/assets/live-video-1.mp4.asset.json";
import liveVideo2 from "@/assets/live-video-2.mp4.asset.json";
import liveVideo3 from "@/assets/live-video-3.mp4.asset.json";

const videos = [
  { url: liveVideo1.url },
  { url: liveVideo2.url },
  { url: liveVideo3.url },
];

export function LiveVideos() {
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
            <div
              key={i}
              className="relative aspect-[9/16] overflow-hidden rounded-md bg-muted"
            >
              <video
                src={v.url}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
