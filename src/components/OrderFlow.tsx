import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { CartItem } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PhoneVerification } from "@/components/PhoneVerification";
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Truck,
  CheckCircle,
  ArrowLeft,
  Package
} from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/supabase";

interface OrderFlowProps {
  items: CartItem[];
  onClose: () => void;
  onOrderComplete: () => void;
}

type OrderStep = "shipping" | "phone" | "payment" | "confirmation";

export const OrderFlow = ({ items, onClose, onOrderComplete }: OrderFlowProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<OrderStep>("shipping");
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
    notes: ""
  });

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + shipping;

  const steps = [
    { id: "shipping", title: "Shipping Info", icon: MapPin },
    { id: "phone", title: "Phone Verification", icon: Phone },
    { id: "payment", title: "Payment", icon: CreditCard },
    { id: "confirmation", title: "Confirmation", icon: CheckCircle }
  ];

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city) {
      toast.error("Please fill in all required fields");
      return;
    }
    setCurrentStep("phone");
  };

  const handlePhoneVerified = (phoneNumber: string) => {
    setVerifiedPhone(phoneNumber);
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = async () => {
    if (!verifiedPhone) {
      toast.error("Phone verification required");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        user_id: user!.id,
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          color: item.selectedColor,
          size: item.selectedSize,
          quantity: item.quantity,
          price: item.product.price
        })),
        total_amount: total,
        shipping_address: shippingInfo,
        phone_number: verifiedPhone
      };

      const { data, error } = await db.createOrder(orderData);
      
      if (error) throw error;

      setCurrentStep("confirmation");
      toast.success("Order placed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "shipping":
        return (
          <form onSubmit={handleShippingSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Address *</label>
              <Textarea
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Street address, apartment, suite, etc."
                required
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <Input
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Postal Code</label>
                <Input
                  value={shippingInfo.postalCode}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
              <Textarea
                value={shippingInfo.notes}
                onChange={(e) => setShippingInfo(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special instructions for delivery..."
              />
            </div>
            
            <Button type="submit" className="w-full" size="lg">
              Continue to Phone Verification
            </Button>
          </form>
        );

      case "phone":
        return (
          <PhoneVerification
            onVerified={handlePhoneVerified}
            onCancel={() => setCurrentStep("shipping")}
          />
        );

      case "payment":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Package className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cash on Delivery</h3>
              <p className="text-muted-foreground">
                Pay when your order is delivered to your doorstep
              </p>
            </div>
            
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Secure & Convenient</p>
                    <p className="text-muted-foreground">No advance payment required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Inspect your order before payment</p>
              <p>• Pay in cash to our delivery partner</p>
              <p>• 100% secure and hassle-free</p>
            </div>
            
            <Button 
              onClick={handlePaymentSubmit} 
              disabled={isProcessing}
              className="w-full" 
              size="lg"
            >
              {isProcessing ? "Processing Order..." : "Place Order"}
            </Button>
          </div>
        );

      case "confirmation":
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2">Order Confirmed!</h3>
              <p className="text-muted-foreground">
                Thank you for your order. We'll contact you shortly to confirm delivery details.
              </p>
            </div>
            
            <Card>
              <CardContent className="p-4 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Order Total:</span>
                    <span className="font-semibold">₨{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>Cash on Delivery</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Phone:</span>
                    <span>{verifiedPhone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button onClick={onOrderComplete} className="w-full" size="lg">
              Continue Shopping
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold">Complete Your Order</h2>
            </div>
            <Badge variant="secondary">
              Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
            </Badge>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : isActive 
                      ? 'border-primary text-primary' 
                      : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {renderStepContent()}
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                        <img
                          src={item.selectedColor.image || item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.selectedColor.name} • Size {item.selectedSize.label} • Qty {item.quantity}
                        </p>
                        <p className="text-sm font-semibold">₨{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₨{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : `₨${shipping}`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>₨{total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};