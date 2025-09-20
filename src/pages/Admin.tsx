import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useProducts } from "@/hooks/useProducts";
import { Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Upload,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  X
} from "lucide-react";
import { toast } from "sonner";

interface AdminProps {
  cartItems: any[];
  onCartClick: () => void;
}

export const Admin = ({ cartItems, onCartClick }: AdminProps) => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getOrders, 
    updateOrderStatus, 
    uploadImage,
    loading: adminLoading 
  } = useAdmin();
  const { products, refetch: refetchProducts } = useProducts();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    description: '',
    category: '',
    lotNumber: '',
    stock: '',
    colors: [{ name: 'White', value: '#ffffff' }],
    sizes: [{ value: '8', label: '8', inStock: true }],
    images: [] as string[],
    isNew: false,
    isFeatured: false
  });

  useEffect(() => {
    if (isAdmin) {
      loadOrders();
    }
  }, [isAdmin]);

  const loadOrders = async () => {
    try {
      const ordersData = await getOrders();
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: productForm.name,
        brand: productForm.brand,
        price: parseInt(productForm.price),
        original_price: productForm.originalPrice ? parseInt(productForm.originalPrice) : null,
        description: productForm.description,
        category: productForm.category,
        lot_number: productForm.lotNumber,
        stock: parseInt(productForm.stock),
        colors: productForm.colors,
        sizes: productForm.sizes,
        images: productForm.images,
        is_new: productForm.isNew,
        is_featured: productForm.isFeatured
      };

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully!');
      }

      setIsProductDialogOpen(false);
      resetProductForm();
      refetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProduct(productId);
      toast.success('Product deleted successfully!');
      refetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      originalPrice: product.original_price?.toString() || '',
      description: product.description,
      category: product.category,
      lotNumber: product.lot_number,
      stock: product.stock.toString(),
      colors: product.colors || [{ name: 'White', value: '#ffffff' }],
      sizes: product.sizes || [{ value: '8', label: '8', inStock: true }],
      images: product.images || [],
      isNew: product.is_new || false,
      isFeatured: product.is_featured || false
    });
    setIsProductDialogOpen(true);
  };

  const resetProductForm = () => {
    setSelectedProduct(null);
    setProductForm({
      name: '',
      brand: '',
      price: '',
      originalPrice: '',
      description: '',
      category: '',
      lotNumber: '',
      stock: '',
      colors: [{ name: 'White', value: '#ffffff' }],
      sizes: [{ value: '8', label: '8', inStock: true }],
      images: [],
      isNew: false,
      isFeatured: false
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated!');
      loadOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/signin" replace />;
  }

  const stats = [
    { title: 'Total Products', value: products.length, icon: Package, color: 'text-blue-600' },
    { title: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-green-600' },
    { title: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'text-yellow-600' },
    { title: 'Revenue', value: `₨${orders.reduce((sum, o) => sum + o.total_amount, 0).toLocaleString()}`, icon: TrendingUp, color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        cartItemsCount={cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)}
        onCartClick={onCartClick}
      />
      
      <div className="pt-16">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your store products and orders</p>
              </div>
              <Badge variant="secondary" className="text-sm">
                Admin Panel
              </Badge>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Products Management</h2>
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetProductForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedProduct ? 'Edit Product' : 'Add New Product'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Product Name *</Label>
                          <Input
                            id="name"
                            value={productForm.name}
                            onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="brand">Brand *</Label>
                          <Input
                            id="brand"
                            value={productForm.brand}
                            onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price (₨) *</Label>
                          <Input
                            id="price"
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="originalPrice">Original Price (₨)</Label>
                          <Input
                            id="originalPrice"
                            type="number"
                            value={productForm.originalPrice}
                            onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={productForm.description}
                          onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select
                            value={productForm.category}
                            onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Running">Running</SelectItem>
                              <SelectItem value="Casual">Casual</SelectItem>
                              <SelectItem value="Formal">Formal</SelectItem>
                              <SelectItem value="Basketball">Basketball</SelectItem>
                              <SelectItem value="Outdoor">Outdoor</SelectItem>
                              <SelectItem value="Streetwear">Streetwear</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="stock">Stock *</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={productForm.stock}
                            onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="lotNumber">Lot Number *</Label>
                        <Input
                          id="lotNumber"
                          value={productForm.lotNumber}
                          onChange={(e) => setProductForm(prev => ({ ...prev, lotNumber: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="images">Product Images</Label>
                        <Input
                          id="images"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        {productForm.images.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {productForm.images.map((image, index) => (
                              <div key={index} className="relative">
                                <img src={image} alt={`Product ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6"
                                  onClick={() => setProductForm(prev => ({
                                    ...prev,
                                    images: prev.images.filter((_, i) => i !== index)
                                  }))}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={productForm.isNew}
                            onChange={(e) => setProductForm(prev => ({ ...prev, isNew: e.target.checked }))}
                          />
                          <span>New Product</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={productForm.isFeatured}
                            onChange={(e) => setProductForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                          />
                          <span>Featured Product</span>
                        </label>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={adminLoading}>
                          {adminLoading ? 'Saving...' : (selectedProduct ? 'Update Product' : 'Add Product')}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images[0] || '/placeholder.svg'}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.brand}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>₨{product.price.toLocaleString()}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {product.isNew && <Badge variant="secondary">New</Badge>}
                              {product.isFeatured && <Badge>Featured</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <h2 className="text-2xl font-bold">Orders Management</h2>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            {order.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.shipping_address?.fullName}</p>
                              <p className="text-sm text-muted-foreground">{order.phone_number}</p>
                            </div>
                          </TableCell>
                          <TableCell>{order.items?.length || 0} items</TableCell>
                          <TableCell>₨{order.total_amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleOrderStatusUpdate(order.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};