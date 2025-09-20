import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Categories } from "./pages/Categories";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { SignIn } from "./pages/SignIn";
import { Admin } from "./pages/Admin";
import { Profile } from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/AuthProvider";
import { useState } from "react";
import { CartItem } from "./types/product";

const queryClient = new QueryClient();

const App = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleCartClick = () => {
    // This will be handled by individual pages
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/categories" element={<Categories cartItems={cartItems} onAddToCart={() => {}} onCartClick={handleCartClick} />} />
              <Route path="/about" element={<About cartItems={cartItems} onCartClick={handleCartClick} />} />
              <Route path="/contact" element={<Contact cartItems={cartItems} onCartClick={handleCartClick} />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/admin" element={<Admin cartItems={cartItems} onCartClick={handleCartClick} />} />
              <Route path="/profile" element={<Profile cartItems={cartItems} onCartClick={handleCartClick} />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;