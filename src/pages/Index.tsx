import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CartItem, Product, ProductColor, ProductSize } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProductsGrid } from "@/components/ProductsGrid";
import { QuickView } from "@/components/QuickView";
import { Cart } from "@/components/Cart";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { OrderFlow } from "@/components/OrderFlow";
import { SearchBar } from "@/components/SearchBar";
import { OrderFlow } from "@/components/OrderFlow";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PhoneVerification } from "@/components/PhoneVerification";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

const Index = () => {
  const { products, loading: productsLoading } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showOrderFlow, setShowOrderFlow] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showOrderFlow, setShowOrderFlow] = useState(false);

  const handleAddToCart = (product: Product, color: ProductColor, size: ProductSize) => {
    const existingItemIndex = cartItems.findIndex(
      item => 
        item.product.id === product.id && 
        item.selectedColor.name === color.name && 
        item.selectedSize.value === size.value
    );

    if (existingItemIndex > -1) {
      const newItems = [...cartItems];
      newItems[existingItemIndex].quantity += 1;
      setCartItems(newItems);
    } else {
      setCartItems([...cartItems, { product, selectedColor: color, selectedSize: size, quantity: 1 }]);
    }
    
    toast.success(`${product.name} added to cart!`);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(index);
      return;
    }
    
    const newItems = [...cartItems];
    newItems[index].quantity = quantity;
    setCartItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newItems);
    toast.success("Item removed from cart");
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please sign in to place an order", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/signin")
        }
      });
      return;
    }
    
    setIsCartOpen(false);
    setShowOrderFlow(true);
  };

  const handleOrderComplete = () => {
    setShowOrderFlow(false);
    setCartItems([]);
    toast.success("Thank you for your order!");
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
    setShowSearch(false);
  };

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handlePhoneVerified = (phoneNumber: string) => {
    setVerifiedPhone(phoneNumber);
    setShowPhoneVerification(false);
    toast.success("Phone verified! You can now place orders.");
    
    // Continue with checkout after phone verification
    if (cartItems.length > 0) {
      setShowOrderFlow(true);
    }
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onSearchClick={handleSearchClick}
      />
      
      <HeroSection />
      
      <ProductsGrid 
        products={products}
        onAddToCart={handleAddToCart}
        onQuickView={handleQuickView}
      />
      
      <Footer />
      
      <WhatsAppButton />
      
      <QuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        onAddToCart={handleAddToCart}
      />
      
      <Cart
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        onCheckout={handleCheckout}
      />
      
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
                onProductSelect={handleProductSelect}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Order Flow */}
      {showOrderFlow && (
        <OrderFlow
          items={cartItems}
          onClose={() => setShowOrderFlow(false)}
          onOrderComplete={handleOrderComplete}
        />
      )}

      {showPhoneVerification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <PhoneVerification
            onVerified={handlePhoneVerified}
            onCancel={() => setShowPhoneVerification(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
