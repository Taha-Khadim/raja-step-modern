import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WhatsAppButton = () => {
  const phoneNumber = "+923001234567"; // Replace with actual number
  const message = "Hi! I'm interested in your shoes collection at Raja's Shoes.";

  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Button
      onClick={openWhatsApp}
      className="floating-btn bg-green-500 hover:bg-green-600 text-white shadow-xl animate-float"
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};