export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  category: string;
  lotNumber: string;
  stock: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface ProductColor {
  name: string;
  value: string;
  image?: string;
}

export interface ProductSize {
  value: string;
  label: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  selectedColor: ProductColor;
  selectedSize: ProductSize;
  quantity: number;
}