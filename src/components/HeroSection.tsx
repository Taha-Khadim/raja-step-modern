import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Play } from "lucide-react";
// If you later get a transparent PNG/WebP, just swap this import.
import heroShoe from "@/assets/hero-shoe.png";

export const HeroSection = () => {
  return (
    <section
      className="relative isolate overflow-hidden min-h-[92vh] bg-gradient-hero text-white"
      aria-labelledby="hero-heading"
    >
      {/* Decorative background grid + radial */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_-10%,rgba(110,170,255,0.22)_0%,rgba(17,24,39,0)_70%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.08]" />
      </div>

      {/* Soft orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-secondary/25 blur-3xl animate-float" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-accent/25 blur-3xl animate-float"
        style={{ animationDelay: "1.2s" }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[92vh] py-16 lg:py-24">
          {/* LEFT */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md ring-1 ring-white/10">
              <Star className="h-4 w-4 text-secondary fill-current" />
              <span className="text-sm font-medium tracking-wide">
                Premium Quality • Since 2020
              </span>
            </div>

            {/* Heading + copy */}
            <header className="space-y-4">
              <h1 id="hero-heading" className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05]">
                Step Into{" "}
                <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                  Excellence
                </span>
              </h1>
              <p className="text-base md:text-lg text-white/80 max-w-xl">
                Premium footwear engineered for comfort, style, and performance—crafted
                with pride in Pakistan.
              </p>
            </header>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-hero group h-12 px-6 text-base font-semibold">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                className="h-12 px-6 text-base font-semibold border-white/40 text-white hover:bg-white hover:text-primary-dark backdrop-blur-md"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Our Story
              </Button>
            </div>

            {/* Stats */}
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

            {/* Image wrapper — isolate blending so it doesn’t dull the whole hero */}
            <div className="relative mx-auto max-w-xl isolate">
              <img
                src={heroShoe}
                alt="Featured lightweight sneaker"
                decoding="async"
                loading="eager"
                className="w-full select-none transition-transform duration-700 will-change-transform hover:scale-[1.03]
                           [mix-blend-mode:multiply] md:[filter:brightness(1.18)_contrast(1.08)_saturate(1.12)_drop-shadow(0_28px_30px_rgba(0,0,0,0.25))]
                           dark:[mix-blend-mode:screen]"
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
