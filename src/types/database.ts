export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          brand: string;
          price: number;
          original_price: number | null;
          description: string;
          category: string;
          lot_number: string;
          stock: number;
          rating: number;
          reviews: number;
          is_new: boolean;
          is_featured: boolean;
          images: string[];
          colors: ProductColor[];
          sizes: ProductSize[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          brand: string;
          price: number;
          original_price?: number | null;
          description: string;
          category: string;
          lot_number: string;
          stock: number;
          rating?: number;
          reviews?: number;
          is_new?: boolean;
          is_featured?: boolean;
          images: string[];
          colors: ProductColor[];
          sizes: ProductSize[];
        };
        Update: {
          id?: string;
          name?: string;
          brand?: string;
          price?: number;
          original_price?: number | null;
          description?: string;
          category?: string;
          lot_number?: string;
          stock?: number;
          rating?: number;
          reviews?: number;
          is_new?: boolean;
          is_featured?: boolean;
          images?: string[];
          colors?: ProductColor[];
          sizes?: ProductSize[];
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          items: OrderItem[];
          total_amount: number;
          status: string;
          shipping_address: any;
          phone_number: string;
          phone_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          items: OrderItem[];
          total_amount: number;
          status?: string;
          shipping_address: any;
          phone_number: string;
          phone_verified?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          items?: OrderItem[];
          total_amount?: number;
          status?: string;
          shipping_address?: any;
          phone_number?: string;
          phone_verified?: boolean;
        };
      };
      admins: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          role?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          role?: string;
        };
      };
      phone_verifications: {
        Row: {
          id: string;
          phone_number: string;
          verification_code: string;
          verified: boolean;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone_number: string;
          verification_code: string;
          verified?: boolean;
          expires_at: string;
        };
        Update: {
          id?: string;
          phone_number?: string;
          verification_code?: string;
          verified?: boolean;
          expires_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_products: {
        Args: Record<PropertyKey, never>;
        Returns: Database['public']['Tables']['products']['Row'][];
      };
      get_product: {
        Args: { product_id: string };
        Returns: Database['public']['Tables']['products']['Row'];
      };
      create_order: {
        Args: {
          user_id: string;
          items: OrderItem[];
          total_amount: number;
          shipping_address: any;
          phone_number: string;
        };
        Returns: { order_id: string };
      };
      get_orders: {
        Args: { user_id?: string };
        Returns: Database['public']['Tables']['orders']['Row'][];
      };
      update_order_status: {
        Args: { order_id: string; new_status: string };
        Returns: void;
      };
      add_product: {
        Args: Database['public']['Tables']['products']['Insert'];
        Returns: { product_id: string };
      };
      update_product: {
        Args: { product_id: string; product_data: Database['public']['Tables']['products']['Update'] };
        Returns: void;
      };
      delete_product: {
        Args: { product_id: string };
        Returns: void;
      };
      send_phone_verification: {
        Args: { phone_number: string };
        Returns: { success: boolean };
      };
      verify_phone: {
        Args: { phone_number: string; verification_code: string };
        Returns: { success: boolean };
      };
      is_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
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

export interface OrderItem {
  product_id: string;
  product_name: string;
  color: ProductColor;
  size: ProductSize;
  quantity: number;
  price: number;
}