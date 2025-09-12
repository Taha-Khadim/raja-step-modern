import { useState } from "react";
import { Product, ProductColor, ProductSize } from "@/types/product";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (product: Product, color: ProductColor, size: ProductSize) => void;
}

export const QuickView = ({ product, isOpen, onOpenChange, onAddToCart }: QuickViewProps) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Reset selections when product changes
  if (product && (!selectedColor || !selectedSize)) {
    if (!selectedColor && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    if (!selectedSize && product.sizes.length > 0) {
      setSelectedSize(product.sizes.find(s => s.inStock) || product.sizes[0]);
    }
  }

  if (!product || !selectedColor || !selectedSize) return null;

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (selectedColor && selectedSize) {
      onAddToCart(product, selectedColor, selectedSize);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={selectedColor.image || product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage === index ? "border-primary" : "border-border hover:border-primary/50"
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.brand}</Badge>
                {product.isNew && <Badge className="bg-secondary">New</Badge>}
                {discount > 0 && <Badge variant="destructive">{discount}% OFF</Badge>}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(product.rating) 
                          ? "text-secondary fill-current" 
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold text-primary">
                  ₨{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ₨{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Color: {selectedColor.name}</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all",
                      selectedColor.name === color.name 
                        ? "border-primary scale-110" 
                        : "border-border hover:border-primary/50"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Size: {selectedSize.label}</h3>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size)}
                    disabled={!size.inStock}
                    className={cn(
                      "py-2 text-sm rounded border transition-all",
                      selectedSize.value === size.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : size.inStock
                        ? "border-border hover:border-primary"
                        : "border-border text-muted-foreground opacity-50 cursor-not-allowed"
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Info */}
            <div className="text-sm text-muted-foreground">
              <span>Stock: {product.stock} items available</span>
              <span className="mx-2">•</span>
              <span>Lot: {product.lotNumber}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!selectedSize.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart 
                  className={cn(
                    "h-4 w-4",
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  )} 
                />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Quality Guarantee</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};