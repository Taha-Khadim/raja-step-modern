import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Play } from "lucide-react";
import heroShoe from "@/assets/hero-shoe.png";

/**
 * Background remover (simple chroma key).
 * - Samples the 4 corners to detect the dominant background color.
 * - Removes pixels within `threshold` distance of that color.
 * - Softens edges with `feather` (alpha falloff).
 * Works well for mostly-uniform backdrops (white/grey/solid).
 */
function useChromaCutout(
  src: string,
  opts: { threshold?: number; feather?: number } = {}
) {
  const { threshold = 46, feather = 8 } = opts; // tuned for product photos
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    if (!src || processingRef.current) return;
    processingRef.current = true;

    const img = new Image();
    img.crossOrigin = "anonymous"; // safe for same-origin assets
    img.decoding = "async";
    img.loading = "eager";
    img.src = src;

    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h) { setOutUrl(src); return; }

      // Canvas
      const canvas =
        (typeof OffscreenCanvas !== "undefined")
          ? new OffscreenCanvas(w, h) as any
          : document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Helper: color distance
      const dist = (r:number,g:number,b:number, R:number,G:number,B:number) => {
        const dr=r-R, dg=g-G, db=b-B;
        // perceptual weights
        return Math.sqrt(0.3*dr*dr + 0.59*dg*dg + 0.11*db*db);
      };

      // Sample corners (expand a bit inward)
      const sampleSize = Math.max(4, Math.floor(Math.min(w,h) * 0.01));
      const samples:number[][] = [];

      const pushBlock = (x0:number,y0:number) => {
        for (let y=y0; y<y0+sampleSize; y++) {
          for (let x=x0; x<x0+sampleSize; x++) {
            const i = (y*w + x) * 4;
            samples.push([data[i], data[i+1], data[i+2]]);
          }
        }
      };
      pushBlock(0,0);
      pushBlock(w-sampleSize,0);
      pushBlock(0,h-sampleSize);
      pushBlock(w-sampleSize,h-sampleSize);

      // Dominant bg color from samples (median more robust than mean)
      const channelMedian = (arr:number[], k:number) => {
        const a = arr.map(s => s[k]).sort((a,b)=>a-b);
        const mid = Math.floor(a.length/2);
        return a.length%2 ? a[mid] : Math.round((a[mid-1]+a[mid])/2);
      };
      const R = channelMedian(samples,0);
      const G = channelMedian(samples,1);
      const B = channelMedian(samples,2);

      // Pass 1: compute mask & soft edge (feather)
      // We’ll store distance in a temp array to reuse in pass 2
      const dists = new Float32Array(w*h);
      let maxFeather = Math.max(1, feather);
      for (let p=0,i=0; p<w*h; p++, i+=4) {
        const r=data[i], g=data[i+1], b=data[i+2];
        const d = dist(r,g,b,R,G,B);
        dists[p] = d;
        if (d < threshold) {
          // within threshold → transparent (we’ll feather in pass 2)
          data[i+3] = 0;
        }
      }

      // Pass 2: feathering on the edge—simple distance ramp around threshold
      if (maxFeather > 0) {
        const bandStart = threshold;
        const bandEnd = threshold + maxFeather;
        for (let p=0,i=0; p<w*h; p++, i+=4) {
          const d = dists[p];
          if (d >= bandStart && d <= bandEnd) {
            // map to [0..1] alpha
            const t = (d - bandStart) / (bandEnd - bandStart);
            const a = Math.min(255, Math.max(0, Math.round(255 * t)));
            data[i+3] = Math.min(data[i+3], a);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      // Export PNG with alpha
      const exportUrl =
        (canvas as any).convertToBlob
          ? (canvas as any).convertToBlob({ type: "image/png" }).then((blob:Blob)=> URL.createObjectURL(blob))
          : Promise.resolve((canvas as HTMLCanvasElement).toDataURL("image/png"));

      Promise.resolve(exportUrl).then((url:string) => {
        setOutUrl(url);
      }).catch(() => setOutUrl(src));
    };

    img.onerror = () => setOutUrl(src);
  }, [src, threshold, feather]);

  return outUrl;
}

export const HeroSection = () => {
  // Try to auto-cut out the shoe client-side.
  const cutoutUrl = useChromaCutout(heroShoe, { threshold: 48, feather: 10 });

  return (
    <section
      className="relative isolate overflow-hidden min-h-[92vh] bg-gradient-hero text-white"
      aria-labelledby="hero-heading"
    >
      {/* Background grid + radial */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_-10%,rgba(110,170,255,0.22)_0%,rgba(17,24,39,0)_70%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.08]" />
      </div>

      {/* Soft orbs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-secondary/25 blur-3xl animate-float" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-accent/25 blur-3xl animate-float" style={{ animationDelay: "1.2s" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[92vh] py-16 lg:py-24">
          {/* LEFT */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md ring-1 ring-white/10">
              <Star className="h-4 w-4 text-secondary fill-current" />
              <span className="text-sm font-medium tracking-wide">Premium Quality • Since 2020</span>
            </div>

            <header className="space-y-4">
              <h1 id="hero-heading" className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05]">
                Step Into{" "}
                <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                  Excellence
                </span>
              </h1>
              <p className="text-base md:text-lg text-white/80 max-w-xl">
                Premium footwear engineered for comfort, style, and performance—crafted with pride in Pakistan.
              </p>
            </header>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-hero group h-12 px-6 text-base font-semibold">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" className="h-12 px-6 text-base font-semibold border-white/40 text-white hover:bg-white hover:text-primary-dark backdrop-blur-md">
                <Play className="mr-2 h-5 w-5" />
                Watch Our Story
              </Button>
            </div>

            <dl className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center">
                <dt className="text-[11px] uppercase tracking-wider text-white/60">Happy Customers</dt>
                <dd className="text-2xl md:text-3xl font-bold">5,000+</dd>
              </div>
              <div className="text-center">
                <dt className="text-[11px] uppercase tracking-wider text-white/60">Shoe Models</dt>
                <dd className="text-2xl md:text-3xl font-bold">50+</dd>
              </div>
              <div className="text-center">
                <dt className="text-[11px] uppercase tracking-wider text-white/60">Avg. Rating</dt>
                <dd className="text-2xl md:text-3xl font-bold">4.9★</dd>
              </div>
            </dl>

            <div className="flex items-center gap-6 pt-2 opacity-80">
              <span className="text-xs text-white/60">Trusted by athletes & creators</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          </div>

          {/* RIGHT — Visual */}
          <div className="relative animate-slide-up">
            {/* Backlight glow */}
            <div aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center">
              <div className="size-[36rem] max-w-full rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.35),transparent_70%)] blur-2xl" />
            </div>

            {/* Price badge */}
            <div className="absolute top-0 right-0 rounded-2xl bg-white/95 p-4 shadow-strong ring-1 ring-black/5">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Starting from</div>
                <div className="text-2xl font-extrabold text-primary">₨3,999</div>
              </div>
            </div>

            {/* Cutout Image (transparent PNG generated on the fly) */}
            <div className="relative mx-auto max-w-xl">
              <img
                src={cutoutUrl ?? heroShoe}
                alt="Featured lightweight sneaker"
                decoding="async"
                loading="eager"
                className="w-full select-none transition-transform duration-700 will-change-transform hover:scale-[1.03] drop-shadow-xl"
                style={{ filter: "drop-shadow(0 28px 30px rgba(0,0,0,0.25))" }}
              />

              {/* Ground “pod” shadow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-[999px] opacity-70
                           bg-[radial-gradient(50%_100%_at_50%_0%,rgba(0,0,0,0.35),transparent_70%)]
                           ring-1 ring-white/5"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
