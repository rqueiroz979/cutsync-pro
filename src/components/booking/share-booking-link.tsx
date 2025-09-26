import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Share2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { supabase } from "@/integrations/supabase/client";

interface ShareBookingLinkProps {
  barbershopId: string;
  barbershopName?: string;
}

export const ShareBookingLink = ({ barbershopId, barbershopName = "Sua Barbearia" }: ShareBookingLinkProps) => {
  const [copied, setCopied] = useState(false);
  const [barbershopData, setBarbershopData] = useState<any>(null);
  const { toast } = useToast();
  
  const bookingUrl = `${window.location.origin}/book/${barbershopId}`;

  useEffect(() => {
    loadBarbershopData();
  }, [barbershopId]);

  const loadBarbershopData = async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("whatsapp")
        .eq("user_id", barbershopId)
        .single();
      
      setBarbershopData(profile);
    } catch (error) {
      console.error("Error loading barbershop data:", error);
    }
  };

  const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: { to: phoneNumber, message }
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
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link",
        variant: "destructive",
      });
    }
  };

  const shareMessage = `📋 *AGENDE SEU HORÁRIO ONLINE* 

${barbershopName} agora tem agendamento online! 

✂️ Escolha seu serviço
👨‍💼 Selecione o profissional  
📅 Marque data e horário
✅ Confirme seus dados

É rápido, fácil e seguro!

🔗 Agende agora: ${bookingUrl}

💈 ${barbershopName}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Compartilhar Link de Agendamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            value={bookingUrl} 
            readOnly 
            className="flex-1" 
          />
          <Button onClick={handleCopyLink} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copiado!" : "Copiar"}
          </Button>
        </div>
        
        <div className="flex gap-2">
          <WhatsAppButton
            message={shareMessage}
            className="flex-1"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Compartilhar no WhatsApp
          </WhatsAppButton>
          
          {barbershopData?.whatsapp && (
            <Button
              onClick={() => sendWhatsAppMessage(
                barbershopData.whatsapp, 
                `Olá, agende seu horário na ${barbershopName} neste link: ${bookingUrl}`
              )}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Enviar via API WhatsApp
            </Button>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>💡 <strong>Dica:</strong> Compartilhe este link com seus clientes para que eles possam agendar diretamente online!</p>
        </div>
      </CardContent>
    </Card>
  );
};