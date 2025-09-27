import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { whatsappMessageSchema } from "@/lib/validation-schemas";

interface WhatsAppSenderProps {
  phoneNumber: string;
  message: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export const WhatsAppSender = ({ 
  phoneNumber, 
  message, 
  className, 
  children, 
  variant = "default" 
}: WhatsAppSenderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    setIsLoading(true);

    try {
      // Validate input data
      const validatedData = whatsappMessageSchema.parse({
        phoneNumber: phoneNumber.replace(/\D/g, ''), // Remove non-digits for validation
        message,
      });

      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: { 
          to: validatedData.phoneNumber, 
          message: validatedData.message
        }
      });

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "A mensagem foi enviada para o WhatsApp com sucesso",
      });
    } catch (error: any) {
      if (error.errors) {
        const validationError = error.errors[0];
        toast({
          title: "Erro de validação",
          description: validationError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível enviar a mensagem. Verifique os dados e tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSend}
      disabled={isLoading}
      className={className}
      variant={variant}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {isLoading ? "Enviando..." : (children || "Enviar WhatsApp")}
    </Button>
  );
};

export default WhatsAppSender;