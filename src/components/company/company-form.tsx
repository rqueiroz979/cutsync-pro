import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Building2, Phone, MapPin, Mail } from "lucide-react";

interface CompanyFormProps {
  userId: string;
}

const CompanyForm = ({ userId }: CompanyFormProps) => {
  const [formData, setFormData] = useState({
    barbershop_name: "",
    full_name: "",
    phone: "",
    address: "",
    email: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCompanyData();
  }, [userId]);

  const loadCompanyData = async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profile) {
        setFormData({
          barbershop_name: profile.barbershop_name || "",
          full_name: profile.full_name || "",
          phone: profile.phone || "",
          address: (profile as any).address || "",
          email: (profile as any).email || "",
          description: (profile as any).description || "",
        });
      }
    } catch (error) {
      console.error("Error loading company data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          barbershop_name: formData.barbershop_name,
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          email: formData.email,
          description: formData.description,
        } as any)
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Dados atualizados",
        description: "Os dados da empresa foram salvos com sucesso!",
      });
    } catch (error) {
      console.error("Error updating company data:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar os dados da empresa.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Dados da Empresa
        </CardTitle>
        <CardDescription>
          Configure as informações da sua barbearia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="barbershop_name">Nome da Barbearia</Label>
              <Input
                id="barbershop_name"
                name="barbershop_name"
                value={formData.barbershop_name}
                onChange={handleChange}
                placeholder="Ex: Barbearia do João"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nome do Proprietário</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Telefone/WhatsApp
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                E-mail
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contato@barbearia.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Endereço
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Rua, número, bairro, cidade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição da Barbearia</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Conte um pouco sobre sua barbearia, especialidades, diferenciais..."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Salvando..." : "Salvar Dados"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyForm;