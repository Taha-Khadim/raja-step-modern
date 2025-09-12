import { useState } from "react";
import { Product, ProductColor, ProductSize } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, color: ProductColor, size: ProductSize) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart, onQuickView }: ProductCardProps) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes.find(s => s.inStock) || product.sizes[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card group">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl mb-4 bg-muted/50">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-secondary text-secondary-foreground">New</Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive">{discount}% OFF</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-colors",
              isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )} 
          />
        </Button>

        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden">
          <img
            src={selectedColor.image || product.images[0]}
            alt={product.name}
            className={cn(
              "w-full h-full object-contain transition-all duration-700 group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse rounded-xl"></div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onQuickView(product)}
              className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        {/* Rating & Brand */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{product.brand}</span>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-secondary text-secondary" />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Color Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Colors:</span>
          <div className="flex space-x-1">
            {product.colors.slice(0, 4).map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "w-5 h-5 rounded-full border-2 transition-all",
                  selectedColor.name === color.name 
                    ? "border-primary scale-110" 
                    : "border-border hover:border-primary/50"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Size Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Size:</span>
          <div className="flex space-x-1">
            {product.sizes.slice(0, 5).map((size) => (
              <button
                key={size.value}
                onClick={() => setSelectedSize(size)}
                disabled={!size.inStock}
                className={cn(
                  "px-2 py-1 text-xs rounded border transition-all",
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

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">
            ₨{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₨{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button 
          className="w-full"
          onClick={() => onAddToCart(product, selectedColor, selectedSize)}
          disabled={!selectedSize.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {selectedSize.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
};