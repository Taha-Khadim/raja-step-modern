import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import heroShoe from "@/assets/hero-shoe.png";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-white/5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
              <Star className="h-4 w-4 text-secondary fill-current" />
              <span className="text-white text-sm font-medium">Premium Quality Since 2020</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Step Into
                <span className="block bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                  Excellence
                </span>
              </h1>
              <p className="text-xl text-white/90 max-w-lg leading-relaxed">
                Discover our exclusive collection of premium footwear crafted for comfort, style, and performance. Made with love in Pakistan.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-hero group">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary-dark backdrop-blur-sm"
              >
                Watch Our Story
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5000+</div>
                <div className="text-white/80 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-white/80 text-sm">Shoe Models</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4.9★</div>
                <div className="text-white/80 text-sm">Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Shoe Image */}
          <div className="relative animate-slide-up">
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
            
            {/* Main Shoe Image */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-accent/30 rounded-full blur-3xl transform scale-150"></div>
                <img 
                  src={heroShoe} 
                  alt="Featured Shoe" 
                  className="relative z-10 w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Price Badge */}
            <div className="absolute top-0 right-0 bg-white rounded-2xl p-4 shadow-strong">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Starting from</div>
                <div className="text-2xl font-bold text-primary">₨3,999</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};