import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { Product } from '@/types/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await db.getProducts();
      
      if (error) throw error;
      
      // Transform database format to frontend format
      const transformedProducts = data?.map((product: any) => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.original_price,
        description: product.description,
        images: product.images || [],
        colors: product.colors || [],
        sizes: product.sizes || [],
        category: product.category,
        lotNumber: product.lot_number,
        stock: product.stock,
        rating: product.rating,
        reviews: product.reviews,
        isNew: product.is_new,
        isFeatured: product.is_featured,
      })) || [];
      
      setProducts(transformedProducts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};