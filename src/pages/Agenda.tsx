import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar as CalendarIcon, MessageCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { generateConfirmationMessage, generateReminderMessage, formatPhoneNumber } from "@/lib/whatsapp-utils";

interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  services: { name: string; price: number };
  professionals: { name: string };
}

const Agenda = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadAppointments();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, selectedDate]);

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          services(name, price),
          professionals(name)
        `)
        .eq("appointment_date", selectedDate)
        .order("appointment_time");

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar agendamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", appointmentId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "Status do agendamento foi atualizado com sucesso",
      });

      loadAppointments();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="default">Agendado</Badge>;
      case "completed":
        return <Badge variant="secondary">Finalizado</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
          </div>
          <div className="flex items-center gap-4">
            <CalendarIcon className="h-4 w-4" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Agendamentos para {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
          </h2>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : appointments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Nenhum agendamento para esta data</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{appointment.client_name}</CardTitle>
                      <CardDescription>
                        {appointment.client_phone}
                      </CardDescription>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Horário</p>
                      <p className="font-medium">{appointment.appointment_time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Serviço</p>
                      <p className="font-medium">{appointment.services?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {appointment.services?.price?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Profissional</p>
                      <p className="font-medium">{appointment.professionals?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <WhatsAppButton
                      phoneNumber={formatPhoneNumber(appointment.client_phone)}
                      message={generateConfirmationMessage({
                        clientName: appointment.client_name,
                        serviceName: appointment.services?.name || 'Serviço',
                        professionalName: appointment.professionals?.name || 'Profissional',
                        date: appointment.appointment_date,
                        time: appointment.appointment_time,
                      })}
                      variant="outline"
                      className="text-xs h-8"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Confirmar
                    </WhatsAppButton>
                    
                    <WhatsAppButton
                      phoneNumber={formatPhoneNumber(appointment.client_phone)}
                      message={generateReminderMessage({
                        clientName: appointment.client_name,
                        serviceName: appointment.services?.name || 'Serviço',
                        date: appointment.appointment_date,
                        time: appointment.appointment_time,
                      })}
                      variant="outline"
                      className="text-xs h-8"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Lembrete
                    </WhatsAppButton>
                  </div>
                  
                  {appointment.status === "scheduled" && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(appointment.id, "completed")}
                      >
                        Finalizar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusChange(appointment.id, "cancelled")}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Agenda;