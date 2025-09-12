import { Product } from "@/types/product";
import shoe1 from "@/assets/shoe-1.png";
import shoe2 from "@/assets/shoe-2.png";
import shoe3 from "@/assets/shoe-3.png";
import heroShoe from "@/assets/hero-shoe.png";

export const products: Product[] = [
  {
    id: "1",
    name: "Air Runner Pro Max",
    brand: "Raja's Athletic",
    price: 4999,
    originalPrice: 6499,
    description: "Premium running shoes with advanced cushioning technology and breathable mesh upper. Perfect for daily runs and athletic activities.",
    images: [heroShoe, shoe1],
    colors: [
      { name: "White/Green", value: "#ffffff", image: heroShoe },
      { name: "Black/Gold", value: "#000000", image: shoe2 },
      { name: "Navy Blue", value: "#1e40af" },
      { name: "Red", value: "#dc2626" }
    ],
    sizes: [
      { value: "7", label: "7", inStock: true },
      { value: "8", label: "8", inStock: true },
      { value: "9", label: "9", inStock: true },
      { value: "10", label: "10", inStock: false },
      { value: "11", label: "11", inStock: true }
    ],
    category: "Running",
    lotNumber: "RJ-AR-2024-001",
    stock: 25,
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isFeatured: true
  },
  {
    id: "2",
    name: "Classic Court Sneaker",
    brand: "Raja's Lifestyle",
    price: 3999,
    originalPrice: 4999,
    description: "Timeless court-inspired sneakers with premium leather construction. A versatile style that complements any casual outfit.",
    images: [shoe1, heroShoe],
    colors: [
      { name: "White/Green", value: "#ffffff", image: shoe1 },
      { name: "All White", value: "#f8f9fa" },
      { name: "Black", value: "#000000" },
      { name: "Brown", value: "#8b4513" }
    ],
    sizes: [
      { value: "6", label: "6", inStock: true },
      { value: "7", label: "7", inStock: true },
      { value: "8", label: "8", inStock: true },
      { value: "9", label: "9", inStock: true },
      { value: "10", label: "10", inStock: true },
      { value: "11", label: "11", inStock: false }
    ],
    category: "Casual",
    lotNumber: "RJ-CC-2024-002",
    stock: 18,
    rating: 4.6,
    reviews: 89,
    isNew: false,
    isFeatured: true
  },
  {
    id: "3",
    name: "Elite Basketball High",
    brand: "Raja's Sports",
    price: 5999,
    description: "Professional-grade basketball shoes with superior ankle support and responsive cushioning for peak performance on the court.",
    images: [shoe2, shoe1],
    colors: [
      { name: "Black/Gold", value: "#000000", image: shoe2 },
      { name: "White/Black", value: "#ffffff" },
      { name: "Red/White", value: "#dc2626" },
      { name: "Blue/Silver", value: "#1e40af" }
    ],
    sizes: [
      { value: "7", label: "7", inStock: false },
      { value: "8", label: "8", inStock: true },
      { value: "9", label: "9", inStock: true },
      { value: "10", label: "10", inStock: true },
      { value: "11", label: "11", inStock: true },
      { value: "12", label: "12", inStock: true }
    ],
    category: "Basketball",
    lotNumber: "RJ-EB-2024-003",
    stock: 12,
    rating: 4.9,
    reviews: 67,
    isNew: true,
    isFeatured: false
  },
  {
    id: "4",
    name: "Executive Oxford Formal",
    brand: "Raja's Formal",
    price: 7999,
    originalPrice: 9999,
    description: "Handcrafted leather Oxford shoes for the modern professional. Premium materials and traditional craftsmanship meet contemporary design.",
    images: [shoe3, shoe1],
    colors: [
      { name: "Brown Leather", value: "#8b4513", image: shoe3 },
      { name: "Black Leather", value: "#000000" },
      { name: "Tan", value: "#d2691e" },
      { name: "Dark Brown", value: "#654321" }
    ],
    sizes: [
      { value: "7", label: "7", inStock: true },
      { value: "8", label: "8", inStock: true },
      { value: "9", label: "9", inStock: false },
      { value: "10", label: "10", inStock: true },
      { value: "11", label: "11", inStock: true }
    ],
    category: "Formal",
    lotNumber: "RJ-EO-2024-004",
    stock: 8,
    rating: 4.7,
    reviews: 34,
    isNew: false,
    isFeatured: true
  },
  {
    id: "5",
    name: "Urban Street Walker",
    brand: "Raja's Street",
    price: 3499,
    description: "Contemporary streetwear-inspired sneakers with bold design elements and all-day comfort for urban adventures.",
    images: [shoe1, shoe2],
    colors: [
      { name: "Triple White", value: "#ffffff", image: shoe1 },
      { name: "Core Black", value: "#000000" },
      { name: "Grey/White", value: "#6b7280" },
      { name: "Navy", value: "#1e3a8a" }
    ],
    sizes: [
      { value: "6", label: "6", inStock: true },
      { value: "7", label: "7", inStock: true },
      { value: "8", label: "8", inStock: true },
      { value: "9", label: "9", inStock: true },
      { value: "10", label: "10", inStock: false },
      { value: "11", label: "11", inStock: true }
    ],
    category: "Streetwear",
    lotNumber: "RJ-US-2024-005",
    stock: 22,
    rating: 4.5,
    reviews: 156,
    isNew: false,
    isFeatured: false
  },
  {
    id: "6",
    name: "Trail Adventure Boot",
    brand: "Raja's Outdoor",
    price: 6499,
    description: "Rugged outdoor boots designed for hiking and trail adventures. Waterproof construction with exceptional grip and durability.",
    images: [shoe2, shoe3],
    colors: [
      { name: "Hiking Brown", value: "#8b4513", image: shoe3 },
      { name: "Forest Green", value: "#228b22" },
      { name: "Charcoal", value: "#36454f" },
      { name: "Sand", value: "#f4a460" }
    ],
    sizes: [
      { value: "7", label: "7", inStock: true },
      { value: "8", label: "8", inStock: true },
      { value: "9", label: "9", inStock: true },
      { value: "10", label: "10", inStock: true },
      { value: "11", label: "11", inStock: false },
      { value: "12", label: "12", inStock: true }
    ],
    category: "Outdoor",
    lotNumber: "RJ-TA-2024-006",
    stock: 15,
    rating: 4.8,
    reviews: 43,
    isNew: true,
    isFeatured: false
  }
];