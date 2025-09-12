/*
  # Initial Schema for Raja's Shoes E-commerce

  1. New Tables
    - `products` - Store product information with images, colors, and sizes
    - `orders` - Store customer orders with items and shipping details
    - `admins` - Store admin user information for management access
    - `phone_verifications` - Store phone verification codes and status

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admins
    - Create functions for business logic

  3. Storage
    - Create bucket for product images
    - Set up policies for image upload and access
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'moderator');

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  price integer NOT NULL,
  original_price integer,
  description text NOT NULL,
  category text NOT NULL,
  lot_number text NOT NULL UNIQUE,
  stock integer NOT NULL DEFAULT 0,
  rating decimal(2,1) DEFAULT 0,
  reviews integer DEFAULT 0,
  is_new boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  images text[] DEFAULT '{}',
  colors jsonb DEFAULT '[]',
  sizes jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  items jsonb NOT NULL,
  total_amount integer NOT NULL,
  status order_status DEFAULT 'pending',
  shipping_address jsonb NOT NULL,
  phone_number text NOT NULL,
  phone_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email text NOT NULL,
  role admin_role DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Phone verifications table
CREATE TABLE IF NOT EXISTS phone_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  verification_code text NOT NULL,
  verified boolean DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_verifications ENABLE ROW LEVEL SECURITY;

-- Products policies (public read, admin write)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- Admins policies
CREATE POLICY "Admins can view admin table"
  ON admins FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE POLICY "Super admins can manage admins"
  ON admins FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND role = 'super_admin'));

-- Phone verifications policies
CREATE POLICY "Users can manage their phone verifications"
  ON phone_verifications FOR ALL
  TO authenticated
  USING (true);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND 
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images' AND 
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images' AND 
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

-- Functions for business logic
CREATE OR REPLACE FUNCTION get_products()
RETURNS SETOF products
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM products ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION get_product(product_id uuid)
RETURNS products
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM products WHERE id = product_id;
$$;

CREATE OR REPLACE FUNCTION create_order(
  user_id uuid,
  items jsonb,
  total_amount integer,
  shipping_address jsonb,
  phone_number text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_order_id uuid;
BEGIN
  INSERT INTO orders (user_id, items, total_amount, shipping_address, phone_number)
  VALUES (user_id, items, total_amount, shipping_address, phone_number)
  RETURNING id INTO new_order_id;
  
  RETURN json_build_object('order_id', new_order_id);
END;
$$;

CREATE OR REPLACE FUNCTION get_orders(user_id uuid DEFAULT NULL)
RETURNS SETOF orders
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM orders 
  WHERE (user_id IS NULL OR orders.user_id = get_orders.user_id)
  ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION update_order_status(order_id uuid, new_status text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE orders SET status = new_status::order_status, updated_at = now()
  WHERE id = order_id;
$$;

CREATE OR REPLACE FUNCTION add_product(
  name text,
  brand text,
  price integer,
  original_price integer DEFAULT NULL,
  description text,
  category text,
  lot_number text,
  stock integer DEFAULT 0,
  rating decimal DEFAULT 0,
  reviews integer DEFAULT 0,
  is_new boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  images text[] DEFAULT '{}',
  colors jsonb DEFAULT '[]',
  sizes jsonb DEFAULT '[]'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_product_id uuid;
BEGIN
  INSERT INTO products (
    name, brand, price, original_price, description, category, lot_number,
    stock, rating, reviews, is_new, is_featured, images, colors, sizes
  )
  VALUES (
    name, brand, price, original_price, description, category, lot_number,
    stock, rating, reviews, is_new, is_featured, images, colors, sizes
  )
  RETURNING id INTO new_product_id;
  
  RETURN json_build_object('product_id', new_product_id);
END;
$$;

CREATE OR REPLACE FUNCTION update_product(product_id uuid, product_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products SET
    name = COALESCE((product_data->>'name')::text, name),
    brand = COALESCE((product_data->>'brand')::text, brand),
    price = COALESCE((product_data->>'price')::integer, price),
    original_price = COALESCE((product_data->>'original_price')::integer, original_price),
    description = COALESCE((product_data->>'description')::text, description),
    category = COALESCE((product_data->>'category')::text, category),
    lot_number = COALESCE((product_data->>'lot_number')::text, lot_number),
    stock = COALESCE((product_data->>'stock')::integer, stock),
    rating = COALESCE((product_data->>'rating')::decimal, rating),
    reviews = COALESCE((product_data->>'reviews')::integer, reviews),
    is_new = COALESCE((product_data->>'is_new')::boolean, is_new),
    is_featured = COALESCE((product_data->>'is_featured')::boolean, is_featured),
    images = COALESCE((product_data->>'images')::text[], images),
    colors = COALESCE(product_data->'colors', colors),
    sizes = COALESCE(product_data->'sizes', sizes),
    updated_at = now()
  WHERE id = product_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_product(product_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM products WHERE id = product_id;
$$;

CREATE OR REPLACE FUNCTION send_phone_verification(phone_number text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  verification_code text;
BEGIN
  -- Generate 6-digit code
  verification_code := LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');
  
  -- Delete existing verifications for this phone
  DELETE FROM phone_verifications WHERE phone_verifications.phone_number = send_phone_verification.phone_number;
  
  -- Insert new verification
  INSERT INTO phone_verifications (phone_number, verification_code, expires_at)
  VALUES (phone_number, verification_code, now() + interval '10 minutes');
  
  -- In a real app, you would send SMS here
  -- For now, we'll return the code for testing
  RETURN json_build_object('success', true, 'code', verification_code);
END;
$$;

CREATE OR REPLACE FUNCTION verify_phone(phone_number text, verification_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  verification_record phone_verifications;
BEGIN
  SELECT * INTO verification_record
  FROM phone_verifications
  WHERE phone_verifications.phone_number = verify_phone.phone_number
    AND phone_verifications.verification_code = verify_phone.verification_code
    AND expires_at > now()
    AND verified = false;
  
  IF verification_record IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid or expired code');
  END IF;
  
  UPDATE phone_verifications
  SET verified = true
  WHERE id = verification_record.id;
  
  RETURN json_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE admins.user_id = is_admin.user_id);
$$;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();