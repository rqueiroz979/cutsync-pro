import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Plus, ArrowLeft, DollarSign } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  appointments?: { client_name: string; services: { name: string } };
}

interface PaymentStats {
  total: number;
  cash: number;
  credit_card: number;
  debit_card: number;
  pix: number;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    total: 0,
    cash: 0,
    credit_card: 0,
    debit_card: 0,
    pix: 0,
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    payment_method: "cash",
    payment_date: new Date().toISOString().split('T')[0],
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadPayments();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, selectedDate]);

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          appointments(
            client_name,
            services(name)
          )
        `)
        .eq("payment_date", selectedDate)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPayments(data || []);

      // Calculate stats
      const newStats = {
        total: 0,
        cash: 0,
        credit_card: 0,
        debit_card: 0,
        pix: 0,
      };

      data?.forEach((payment) => {
        const amount = Number(payment.amount);
        newStats.total += amount;
        newStats[payment.payment_method as keyof PaymentStats] += amount;
      });

      setStats(newStats);
    } catch (error) {
      console.error("Error loading payments:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar pagamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("payments")
        .insert([{
          amount: parseFloat(formData.amount),
          payment_method: formData.payment_method,
          payment_date: formData.payment_date,
          user_id: user.id,
        }]);

      if (error) throw error;

      toast({ title: "Pagamento registrado com sucesso!" });
      setDialogOpen(false);
      setFormData({
        amount: "",
        payment_method: "cash",
        payment_date: new Date().toISOString().split('T')[0],
      });
      loadPayments();
    } catch (error) {
      console.error("Error saving payment:", error);
      toast({
        title: "Erro",
        description: "Erro ao registrar pagamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      cash: "Dinheiro",
      credit_card: "Cartão de Crédito",
      debit_card: "Cartão de Débito",
      pix: "PIX",
    };
    return labels[method as keyof typeof labels] || method;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Pagamento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Pagamento</DialogTitle>
                  <DialogDescription>
                    Registre um novo pagamento recebido
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor (R$)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Forma de Pagamento</Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                        <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                        <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment_date">Data do Pagamento</Label>
                    <Input
                      id="payment_date"
                      type="date"
                      value={formData.payment_date}
                      onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Registrando..." : "Registrar"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Relatório de {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {stats.total.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Dinheiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">R$ {stats.cash.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cartão Crédito</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">R$ {stats.credit_card.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cartão Débito</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">R$ {stats.debit_card.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">PIX</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">R$ {stats.pix.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : payments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Nenhum pagamento registrado para esta data</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pagamentos Registrados</h3>
            {payments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="flex justify-between items-center py-4">
                  <div>
                    <p className="font-medium">R$ {payment.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {getPaymentMethodLabel(payment.payment_method)}
                    </p>
                    {payment.appointments && (
                      <p className="text-sm text-muted-foreground">
                        {payment.appointments.client_name} - {payment.appointments.services?.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.payment_date + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Payments;