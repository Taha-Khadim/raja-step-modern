import { useState } from "react";
import { CartItem, Product, ProductColor, ProductSize } from "@/types/product";
import { products } from "@/data/products";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProductsGrid } from "@/components/ProductsGrid";
import { QuickView } from "@/components/QuickView";
import { Cart } from "@/components/Cart";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { toast } from "sonner";

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
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
      />
    </div>
  );
};

export default Index;
