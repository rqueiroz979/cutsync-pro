import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    if (!phoneNumber || !message) {
      toast({
        title: "Erro",
        description: "Número de telefone e mensagem são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: { 
          to: phoneNumber, 
          message 
        }
      });

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "A mensagem foi enviada para o WhatsApp com sucesso",
      });
    } catch (error: any) {
      console.error("Error sending WhatsApp message:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Verifique o token da API.",
        variant: "destructive",
      });
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