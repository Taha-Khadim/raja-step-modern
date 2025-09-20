import { useState } from "react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/types/product";
import { 
  X,
  X,
  Award, 
  Users, 
  Globe, 
  Heart, 
  Truck, 
  Shield, 
  Star,
  CheckCircle,
  Target,
  Zap
} from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { useProducts } from "@/hooks/useProducts";
import { SearchBar } from "@/components/SearchBar";
import { useProducts } from "@/hooks/useProducts";

interface AboutProps {
  cartItems: CartItem[];
  onCartClick: () => void;
}

export const About = ({ cartItems, onCartClick }: AboutProps) => {
  const { products } = useProducts();
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchClick = () => setShowSearch(true);
  const { products } = useProducts();
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchClick = () => setShowSearch(true);
  const stats = [
    { icon: Users, label: "Happy Customers", value: "5,000+", color: "text-blue-600" },
    { icon: Award, label: "Years Experience", value: "5+", color: "text-green-600" },
    { icon: Globe, label: "Cities Served", value: "20+", color: "text-purple-600" },
    { icon: Star, label: "Average Rating", value: "4.9", color: "text-yellow-600" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Quality",
      description: "Every shoe is crafted with meticulous attention to detail and premium materials."
    },
    {
      icon: Shield,
      title: "Trust & Reliability",
      description: "We stand behind our products with comprehensive warranties and excellent service."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly evolving our designs with the latest technology and fashion trends."
    },
    {
      icon: Target,
      title: "Customer Focus",
      description: "Your satisfaction is our priority, from browsing to delivery and beyond."
    }
  ];

  const milestones = [
    { year: "2020", title: "Founded", description: "Raja's Shoes was established with a vision to provide premium footwear." },
    { year: "2021", title: "First Store", description: "Opened our flagship store in Lahore, serving local customers." },
    { year: "2022", title: "Online Launch", description: "Launched our e-commerce platform, reaching customers nationwide." },
    { year: "2023", title: "5000+ Customers", description: "Celebrated serving over 5,000 satisfied customers." },
    { year: "2024", title: "Premium Collection", description: "Introduced our premium line with international quality standards." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} onCartClick={onCartClick} />
      <Navbar 
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={onCartClick}
        onSearchClick={handleSearchClick}
      />
      <Navbar 
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={onCartClick}
        onSearchClick={handleSearchClick}
      />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-20">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4" variant="secondary">Our Story</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About Raja's Shoes</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Born from a passion for exceptional footwear, Raja's Shoes has been crafting premium shoes 
              that combine traditional Pakistani craftsmanship with modern design and comfort.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-md mb-4 ${stat.color}`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  To provide exceptional footwear that empowers people to step confidently into their daily adventures. 
                  We believe that the right pair of shoes can transform not just your outfit, but your entire day.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Premium quality materials and craftsmanship</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Affordable luxury for everyone</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Exceptional customer service experience</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <Award className="h-24 w-24 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Quality First</h3>
                    <p className="text-muted-foreground">Every shoe meets our rigorous quality standards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at Raja's Shoes
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                      <value.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From a small vision to serving thousands of customers across Pakistan
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <Card className="p-6">
                        <CardContent className="p-0">
                          <Badge className="mb-2">{milestone.year}</Badge>
                          <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                          <p className="text-muted-foreground">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Step Into Excellence?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who trust Raja's Shoes for their footwear needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Truck className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20 px-4">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Search Products</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <SearchBar
                products={products}
                onProductSelect={() => setShowSearch(false)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20 px-4">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Search Products</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <SearchBar
                products={products}
                onProductSelect={() => setShowSearch(false)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};