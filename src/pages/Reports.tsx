import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, DollarSign, Calendar, User } from "lucide-react";

interface Professional {
  id: string;
  name: string;
}

interface ReportData {
  totalRevenue: number;
  serviceBreakdown: { name: string; total: number; count: number }[];
  professionalBreakdown: { name: string; total: number; count: number }[];
  paymentMethodBreakdown: { method: string; total: number; count: number }[];
}

const Reports = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    professionalId: "",
    paymentMethod: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadProfessionals();
      } else {
        window.location.href = "/auth";
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadProfessionals();
      } else {
        window.location.href = "/auth";
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfessionals = async () => {
    try {
      const { data } = await supabase
        .from("professionals")
        .select("id, name")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);
      
      setProfessionals(data || []);
    } catch (error) {
      console.error("Error loading professionals:", error);
    }
  };

  const generateReport = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from("payments")
        .select(`
          *,
          appointments!inner(
            *,
            services!inner(name),
            professionals!inner(name)
          )
        `)
        .eq("user_id", user.id);

      // Apply date filters
      if (filters.startDate) {
        query = query.gte("payment_date", filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte("payment_date", filters.endDate);
      }

      // Apply professional filter
      if (filters.professionalId) {
        query = query.eq("appointments.professional_id", filters.professionalId);
      }

      // Apply payment method filter
      if (filters.paymentMethod) {
        query = query.eq("payment_method", filters.paymentMethod);
      }

      const { data: payments, error } = await query;

      if (error) throw error;

      // Calculate totals and breakdowns
      const totalRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Service breakdown
      const serviceMap = new Map();
      payments?.forEach(payment => {
        const serviceName = payment.appointments?.services?.name || "Serviço não identificado";
        const amount = Number(payment.amount);
        if (serviceMap.has(serviceName)) {
          const existing = serviceMap.get(serviceName);
          serviceMap.set(serviceName, { 
            total: existing.total + amount, 
            count: existing.count + 1 
          });
        } else {
          serviceMap.set(serviceName, { total: amount, count: 1 });
        }
      });
      const serviceBreakdown = Array.from(serviceMap, ([name, data]) => ({ name, ...data }));

      // Professional breakdown
      const professionalMap = new Map();
      payments?.forEach(payment => {
        const professionalName = payment.appointments?.professionals?.name || "Profissional não identificado";
        const amount = Number(payment.amount);
        if (professionalMap.has(professionalName)) {
          const existing = professionalMap.get(professionalName);
          professionalMap.set(professionalName, { 
            total: existing.total + amount, 
            count: existing.count + 1 
          });
        } else {
          professionalMap.set(professionalName, { total: amount, count: 1 });
        }
      });
      const professionalBreakdown = Array.from(professionalMap, ([name, data]) => ({ name, ...data }));

      // Payment method breakdown
      const paymentMethodMap = new Map();
      payments?.forEach(payment => {
        const method = payment.payment_method;
        const amount = Number(payment.amount);
        if (paymentMethodMap.has(method)) {
          const existing = paymentMethodMap.get(method);
          paymentMethodMap.set(method, { 
            total: existing.total + amount, 
            count: existing.count + 1 
          });
        } else {
          paymentMethodMap.set(method, { total: amount, count: 1 });
        }
      });
      const paymentMethodBreakdown = Array.from(paymentMethodMap, ([method, data]) => ({ method, ...data }));

      setReportData({
        totalRevenue,
        serviceBreakdown,
        professionalBreakdown,
        paymentMethodBreakdown,
      });

      toast({
        title: "Relatório gerado",
        description: "Relatório financeiro gerado com sucesso!",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Relatório Financeiro
          </h1>
          <p className="text-muted-foreground">Análise detalhada das receitas</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros do Relatório</CardTitle>
            <CardDescription>Configure os filtros para gerar o relatório</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="professional">Profissional</Label>
                <Select
                  value={filters.professionalId}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, professionalId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os profissionais" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os profissionais</SelectItem>
                    {professionals.map((professional) => (
                      <SelectItem key={professional.id} value={professional.id}>
                        {professional.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                <Select
                  value={filters.paymentMethod}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as formas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as formas</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={generateReport} disabled={loading} className="mt-4">
              {loading ? "Gerando..." : "Gerar Relatório"}
            </Button>
          </CardContent>
        </Card>

        {/* Resultados */}
        {reportData && (
          <>
            {/* Total Geral */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Receita Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  R$ {reportData.totalRevenue.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Por Serviço */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Por Serviço
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.serviceBreakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.count} serviços</p>
                        </div>
                        <p className="font-bold">R$ {item.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Por Profissional */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Por Profissional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.professionalBreakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.count} atendimentos</p>
                        </div>
                        <p className="font-bold">R$ {item.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Por Forma de Pagamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Por Forma de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.paymentMethodBreakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium capitalize">{item.method}</p>
                          <p className="text-sm text-muted-foreground">{item.count} transações</p>
                        </div>
                        <p className="font-bold">R$ {item.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Reports;