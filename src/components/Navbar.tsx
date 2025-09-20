import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthButton } from "@/components/AuthButton";

interface NavbarProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onSearchClick?: () => void;
  onSearchClick?: () => void;
}

export const Navbar = ({ cartItemsCount, onCartClick, onSearchClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-foreground">Raja's Shoes</span>
            </Link>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === "/" ? "text-primary font-medium" : ""
              }`}
            >
              Home
            </Link>
            <Link 
              to="/categories" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === "/categories" ? "text-primary font-medium" : ""
              }`}
            >
              Categories
            </Link>
            <Link 
              to="/about" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === "/about" ? "text-primary font-medium" : ""
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === "/contact" ? "text-primary font-medium" : ""
              }`}
            >
              Contact
            </Link>
            >
              Home
            </Link>
            <Link 
              to="/categories" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === "/categories" ? "text-primary font-medium" : ""
              }`}
            >
              Categories
            </Link>
            <Link 
              to="/about" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === "/about" ? "text-primary font-medium" : ""
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === "/contact" ? "text-primary font-medium" : ""
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={onSearchClick}
            >
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={onSearchClick}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <div className="hidden md:flex">
              <AuthButton />
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className={`block px-3 py-2 text-foreground hover:text-primary ${
                  location.pathname === "/" ? "text-primary font-medium" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/categories" 
                className={`block px-3 py-2 text-foreground hover:text-primary ${
                  location.pathname === "/categories" ? "text-primary font-medium" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                to="/" 
                className={`block px-3 py-2 text-foreground hover:text-primary ${
                  location.pathname === "/" ? "text-primary font-medium" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/categories" 
                className={`block px-3 py-2 text-foreground hover:text-primary ${
                  location.pathname === "/categories" ? "text-primary font-medium" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link to="/about" className="block px-3 py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="block px-3 py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <div className="px-3 py-2">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};