import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export const WhatsAppButton = ({ 
  phoneNumber, 
  message, 
  className, 
  children, 
  variant = "default" 
}: WhatsAppButtonProps) => {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = phoneNumber 
      ? `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        variant === "default" && "bg-green-500 hover:bg-green-600 text-white",
        className
      )}
      variant={variant === "default" ? undefined : variant}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {children || "Enviar WhatsApp"}
    </Button>
  );
};

export default WhatsAppButton;