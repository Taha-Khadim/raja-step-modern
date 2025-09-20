import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { Product } from '@/types/product';
import { useAuth } from './useAuth';

interface Order {
  id: string;
  user_id: string;
  items: any[];
  total_amount: number;
  status: string;
  shipping_address: any;
  phone_number: string;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
}

export const useAdmin = () => {
  const { isAdmin, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Product management
  const addProduct = async (productData: any) => {
    if (!isAdmin) throw new Error('Unauthorized');
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await db.addProduct(productData);
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, productData: any) => {
    if (!isAdmin) throw new Error('Unauthorized');
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await db.updateProduct(productId, productData);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!isAdmin) throw new Error('Unauthorized');
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await db.deleteProduct(productId);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Order management
  const getOrders = async (userId?: string) => {
    if (!isAdmin) throw new Error('Unauthorized');
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await db.getOrders(userId);
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (!isAdmin) throw new Error('Unauthorized');
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await db.updateOrderStatus(orderId, status);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Image upload
  const uploadImage = async (file: File) => {
    if (!isAdmin) throw new Error('Unauthorized');
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await db.uploadImage(file);
      const imageUrl = db.getImageUrl(data.path);
      return imageUrl;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    isAdmin,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getOrders,
    updateOrderStatus,
    uploadImage,
  };
};