import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for authentication
export const auth = {
  signInWithGoogle: () => supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  }),
  
  signOut: () => supabase.auth.signOut(),
  
  getCurrentUser: () => supabase.auth.getUser(),
  
  onAuthStateChange: (callback: (event: string, session: any) => void) => 
    supabase.auth.onAuthStateChange(callback)
};

// Helper functions for database operations
export const db = {
  // Products
  getProducts: () => supabase.rpc('get_products'),
  getProduct: (id: string) => supabase.rpc('get_product', { product_id: id }),
  
  // Orders
  createOrder: (orderData: any) => supabase.rpc('create_order', orderData),
  getOrders: (userId?: string) => supabase.rpc('get_orders', { user_id: userId }),
  updateOrderStatus: (orderId: string, status: string) => 
    supabase.rpc('update_order_status', { order_id: orderId, new_status: status }),
  
  // Admin functions
  addProduct: (productData: any) => supabase.rpc('add_product', productData),
  updateProduct: (productId: string, productData: any) => 
    supabase.rpc('update_product', { product_id: productId, product_data: productData }),
  deleteProduct: (productId: string) => supabase.rpc('delete_product', { product_id: productId }),
  
  // Phone verification
  sendPhoneVerification: (phone: string) => supabase.rpc('send_phone_verification', { phone_number: phone }),
  verifyPhone: (phone: string, code: string) => 
    supabase.rpc('verify_phone', { phone_number: phone, verification_code: code }),
  
  // Image upload
  uploadImage: async (file: File, bucket: string = 'product-images') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;
    return data;
  },
  
  getImageUrl: (path: string, bucket: string = 'product-images') => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
};