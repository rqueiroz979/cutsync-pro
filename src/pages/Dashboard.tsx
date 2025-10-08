import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Calendar, DollarSign, Users, Clock, LogOut, Scissors, Building2, BarChart3 } from "lucide-react";
import { ShareBookingLink } from "@/components/booking/share-booking-link";
import CompanyForm from "@/components/company/company-form";
import { UsageOverview } from "@/components/dashboard/usage-overview";

interface DashboardStats {
  todayRevenue: number;
  todayAppointments: number;
  nextAppointments: any[];
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    todayRevenue: 0,
    todayAppointments: 0,
    nextAppointments: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      setProfile(profileData);

      // Load today's stats
      const today = new Date().toISOString().split('T')[0];
      
      // Today's revenue
      const { data: paymentsData } = await supabase
        .from("payments")
        .select("amount")
        .eq("user_id", userId)
        .eq("payment_date", today);

      const todayRevenue = paymentsData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Today's appointments
      const { data: appointmentsData } = await supabase
        .from("appointments")
        .select("*, services(name), professionals(name)")
        .eq("user_id", userId)
        .eq("appointment_date", today);

      // Next appointments (next 3)
      const { data: nextAppointmentsData } = await supabase
        .from("appointments")
        .select("*, services(name), professionals(name)")
        .eq("user_id", userId)
        .eq("status", "scheduled")
        .gte("appointment_date", today)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true })
        .limit(3);

      setStats({
        todayRevenue,
        todayAppointments: appointmentsData?.length || 0,
        nextAppointments: nextAppointmentsData || [],
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p>Carregando...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">{profile?.barbershop_name}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Dados da Empresa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Usage Overview */}
            {user && (
              <UsageOverview userId={user.id} />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => navigate("/reports")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {stats.todayRevenue.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => navigate("/agenda")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.todayAppointments}</div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => navigate("/agenda")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Próximos</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.nextAppointments.length}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Agendamentos</CardTitle>
                    <CardDescription>Seus próximos clientes</CardDescription>
                  </CardHeader>
                <CardContent>
                  {stats.nextAppointments.length === 0 ? (
                    <p className="text-muted-foreground">Nenhum agendamento próximo</p>
                  ) : (
                    <div className="space-y-4">
                      {stats.nextAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{appointment.client_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.services?.name} - {appointment.professionals?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {new Date(appointment.appointment_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.appointment_time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                </Card>

                {user && (
                  <ShareBookingLink 
                    barbershopId={user.id} 
                    barbershopName={profile?.barbershop_name}
                  />
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>Gerenciar sua barbearia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => navigate("/agenda")} 
                    className="w-full justify-start"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Agenda
                  </Button>
                  <Button 
                    onClick={() => navigate("/services")} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Scissors className="h-4 w-4 mr-2" />
                    Gerenciar Serviços
                  </Button>
                  <Button 
                    onClick={() => navigate("/professionals")} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Gerenciar Profissionais
                  </Button>
                  <Button 
                    onClick={() => navigate("/payments")} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pagamentos
                  </Button>
                  <Button 
                    onClick={() => navigate("/reports")} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Relatório Financeiro
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="company">
            {user && <CompanyForm userId={user.id} />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;