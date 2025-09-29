import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Scissors, Clock, User, Phone, MessageCircle, Calendar } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { WhatsAppSender } from "@/components/whatsapp/whatsapp-sender";
import { generateConfirmationMessage } from "@/lib/whatsapp-utils";
import { CalendarBooking } from "@/components/booking/calendar-booking";
import { clientDataSchema, appointmentSchema } from "@/lib/validation-schemas";
import { useAppointmentLimit } from "@/hooks/use-appointment-limit";
import { AppointmentLimitWarning } from "@/components/ui/appointment-limit-warning";

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

interface Professional {
  id: string;
  name: string;
  work_days: string[];
  start_time: string;
  end_time: string;
}

interface Barbershop {
  id: string;
  barbershop_name: string;
  address?: string;
  whatsapp?: string;
}

const PublicBooking = () => {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [selectedBarbershop, setSelectedBarbershop] = useState<Barbershop | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [clientData, setClientData] = useState({
    name: "",
    phone: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { limit: appointmentLimit, loading: limitLoading } = useAppointmentLimit(selectedBarbershop?.id || null);
  const { toast } = useToast();

  useEffect(() => {
    loadBarbershops();
  }, []);

  useEffect(() => {
    if (selectedBarbershop) {
      loadBarbershopData();
    }
  }, [selectedBarbershop]);

  useEffect(() => {
    if (selectedProfessional && selectedDate) {
      loadAvailableTimes();
    }
  }, [selectedProfessional, selectedDate]);

  const loadBarbershops = async () => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, barbershop_name, address, whatsapp")
        .not("barbershop_name", "is", null);

      const barbershopsData = data?.map(profile => ({
        id: profile.user_id,
        barbershop_name: profile.barbershop_name,
        address: profile.address,
        whatsapp: profile.whatsapp,
      })) || [];

      setBarbershops(barbershopsData);
    } catch (error) {
      console.error("Error loading barbershops:", error);
    }
  };

  const loadBarbershopData = async () => {
    if (!selectedBarbershop) return;

    try {
      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("user_id", selectedBarbershop.id);

      const { data: professionalsData } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", selectedBarbershop.id);

      setServices(servicesData || []);
      setProfessionals(professionalsData || []);
    } catch (error) {
      console.error("Error loading barbershop data:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da barbearia",
        variant: "destructive",
      });
    }
  };

  const loadAvailableTimes = async () => {
    if (!selectedProfessional || !selectedDate) return;

    try {
      const startTime = selectedProfessional.start_time;
      const endTime = selectedProfessional.end_time;
      const serviceDuration = selectedService?.duration_minutes || 30;

      const times: string[] = [];
      let currentTime = new Date(`2000-01-01T${startTime}`);
      const endTimeDate = new Date(`2000-01-01T${endTime}`);

      while (currentTime < endTimeDate) {
        times.push(currentTime.toTimeString().slice(0, 5));
        currentTime.setMinutes(currentTime.getMinutes() + serviceDuration);
      }

      const dateString = selectedDate?.toISOString().split('T')[0];
      
      const { data: existingAppointments } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("professional_id", selectedProfessional.id)
        .eq("appointment_date", dateString)
        .eq("status", "scheduled");

      const bookedTimes = existingAppointments?.map(apt => apt.appointment_time) || [];
      const availableTimes = times.filter(time => !bookedTimes.includes(time));

      setAvailableTimes(availableTimes);
    } catch (error) {
      console.error("Error loading available times:", error);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check appointment limit before creating
      if (!appointmentLimit?.can_create_appointment) {
        toast({
          variant: "destructive",
          title: "Limite atingido",
          description: "Limite de agendamentos gratuitos atingido. O proprietário da barbearia precisa assinar um plano para aceitar novos agendamentos.",
        });
        return;
      }

      // Validate client data
      const validatedClientData = clientDataSchema.parse(clientData);
      
      // Validate appointment data
      const appointmentData = {
        clientName: validatedClientData.name,
        clientPhone: validatedClientData.phone,
        appointmentDate: selectedDate?.toISOString().split('T')[0] || "",
        appointmentTime: selectedTime,
        serviceId: selectedService?.id || "",
        professionalId: selectedProfessional?.id || "",
        userId: selectedBarbershop?.id || "",
      };
      
      const validatedAppointment = appointmentSchema.parse(appointmentData);

      const { error } = await supabase
        .from("appointments")
        .insert([{
          user_id: validatedAppointment.userId,
          service_id: validatedAppointment.serviceId,
          professional_id: validatedAppointment.professionalId,
          client_name: validatedAppointment.clientName,
          client_phone: validatedAppointment.clientPhone,
          appointment_date: validatedAppointment.appointmentDate,
          appointment_time: validatedAppointment.appointmentTime,
        }]);

      if (error) throw error;

      toast({
        title: "Agendamento confirmado!",
        description: "Seu agendamento foi realizado com sucesso.",
      });

      setCurrentStep(6);
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      
      // Handle validation errors
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
          description: "Erro ao criar agendamento. Verifique os dados e tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const generateWhatsAppMessage = () => {
    if (!selectedService || !selectedProfessional || !selectedBarbershop) return "";
    
    return generateConfirmationMessage({
      clientName: clientData.name,
      serviceName: selectedService.name,
      professionalName: selectedProfessional.name,
      date: selectedDate?.toISOString().split('T')[0] || "",
      time: selectedTime,
      barbershopName: selectedBarbershop.barbershop_name,
      address: selectedBarbershop.address,
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedBarbershop(null);
    setSelectedService(null);
    setSelectedProfessional(null);
    setSelectedDate(undefined);
    setSelectedTime("");
    setClientData({ name: "", phone: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Scissors className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">AgendaFácil</h1>
          <p className="text-muted-foreground">Agende seu horário online</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Appointment Limit Warning */}
        {selectedBarbershop && appointmentLimit && (
          <div className="mb-6">
            <AppointmentLimitWarning
              appointmentsUsed={appointmentLimit.appointments_used}
              maxFreeAppointments={10}
              onUpgrade={() => window.open('/pricing', '_blank')}
            />
          </div>
        )}
        {/* Step 1: Select Barbershop */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Escolha a Barbearia</CardTitle>
              <CardDescription>Selecione a barbearia que deseja agendar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {barbershops.map((barbershop) => (
                <Button
                  key={barbershop.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => {
                    setSelectedBarbershop(barbershop);
                    setCurrentStep(2);
                  }}
                >
                  <div className="text-left">
                    <p className="font-medium">{barbershop.barbershop_name}</p>
                    {barbershop.address && (
                      <p className="text-sm text-muted-foreground">{barbershop.address}</p>
                    )}
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Service */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Escolha o Serviço</CardTitle>
              <CardDescription>
                Barbearia: {selectedBarbershop?.barbershop_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((service) => (
                <Button
                  key={service.id}
                  variant="outline"
                  className="w-full justify-between h-auto p-4"
                  onClick={() => {
                    setSelectedService(service);
                    setCurrentStep(3);
                  }}
                >
                  <div className="text-left">
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.duration_minutes} minutos
                    </p>
                  </div>
                  <p className="font-bold">R$ {service.price.toFixed(2)}</p>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Professional */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Escolha o Profissional</CardTitle>
              <CardDescription>
                Serviço: {selectedService?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {professionals.map((professional) => (
                <Button
                  key={professional.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => {
                    setSelectedProfessional(professional);
                    setCurrentStep(4);
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  {professional.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Calendar and Time Selection */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <CalendarBooking
              availableTimes={availableTimes}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={(date) => setSelectedDate(date)}
              onTimeSelect={(time) => {
                setSelectedTime(time);
                setCurrentStep(5);
              }}
              professionalName={selectedProfessional?.name}
              serviceDuration={selectedService?.duration_minutes}
            />
          </div>
        )}

        {/* Step 5: Client Information */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Seus Dados</CardTitle>
              <CardDescription>
                {selectedDate?.toLocaleDateString('pt-BR')} às {selectedTime}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    required
                  />
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Resumo do Agendamento</h3>
                  <p><strong>Barbearia:</strong> {selectedBarbershop?.barbershop_name}</p>
                  <p><strong>Serviço:</strong> {selectedService?.name}</p>
                  <p><strong>Profissional:</strong> {selectedProfessional?.name}</p>
                  <p><strong>Data:</strong> {selectedDate?.toLocaleDateString('pt-BR')}</p>
                  <p><strong>Horário:</strong> {selectedTime}</p>
                  <p><strong>Valor:</strong> R$ {selectedService?.price.toFixed(2)}</p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Confirmando..." : "Confirmar Agendamento"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Confirmation */}
        {currentStep === 6 && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-green-600">Agendamento Confirmado!</CardTitle>
              <CardDescription>
                Seu horário foi reservado com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Detalhes do Agendamento</h3>
                <p><strong>Barbearia:</strong> {selectedBarbershop?.barbershop_name}</p>
                <p><strong>Cliente:</strong> {clientData.name}</p>
                <p><strong>Serviço:</strong> {selectedService?.name}</p>
                <p><strong>Profissional:</strong> {selectedProfessional?.name}</p>
                <p><strong>Data:</strong> {selectedDate?.toLocaleDateString('pt-BR')}</p>
                <p><strong>Horário:</strong> {selectedTime}</p>
                <p><strong>Valor:</strong> R$ {selectedService?.price.toFixed(2)}</p>
              </div>

              <div className="space-y-3">
                <WhatsAppSender 
                  phoneNumber={clientData.phone}
                  message={generateWhatsAppMessage()}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  Enviar confirmação no WhatsApp
                </WhatsAppSender>
                
                <WhatsAppButton 
                  phoneNumber={selectedBarbershop?.whatsapp}
                  message={generateWhatsAppMessage()}
                  className="w-full"
                >
                  Compartilhar no WhatsApp da barbearia
                </WhatsAppButton>
                
                <Button 
                  variant="outline"
                  onClick={resetForm}
                  className="w-full"
                >
                  Fazer Novo Agendamento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PublicBooking;