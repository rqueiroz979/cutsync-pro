import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Scissors, Clock, User, Phone, MessageCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { generateBookingMessage } from "@/lib/whatsapp-utils";

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

const BookingPublic = () => {
  const { barbershopId } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [clientData, setClientData] = useState({
    name: "",
    phone: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [barbershopName, setBarbershopName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (barbershopId) {
      loadBarbershopData();
    }
  }, [barbershopId]);

  useEffect(() => {
    if (selectedProfessional && selectedDate) {
      loadAvailableTimes();
    }
  }, [selectedProfessional, selectedDate]);

  const loadBarbershopData = async () => {
    try {
      // Load barbershop info
      const { data: barbershopData } = await supabase
        .from("profiles")
        .select("barbershop_name")
        .eq("user_id", barbershopId)
        .single();
      
      if (barbershopData) {
        setBarbershopName(barbershopData.barbershop_name);
      }

      // Load services and professionals for this barbershop - NO AUTH REQUIRED
      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("user_id", barbershopId);

      const { data: professionalsData } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", barbershopId);

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
      // Generate time slots based on professional's working hours
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

      // Check for existing appointments
      const { data: existingAppointments } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("professional_id", selectedProfessional.id)
        .eq("appointment_date", selectedDate)
        .eq("status", "scheduled");

      const bookedTimes = existingAppointments?.map(apt => apt.appointment_time) || [];
      const availableTimes = times.filter(time => !bookedTimes.includes(time));

      setAvailableTimes(availableTimes);
    } catch (error) {
      console.error("Error loading available times:", error);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  const handleProfessionalSelect = (professional: Professional) => {
    setSelectedProfessional(professional);
    setCurrentStep(3);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setCurrentStep(4);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep(5);
  };

  const generateWhatsAppMessage = () => {
    if (!selectedService || !selectedProfessional) return "";
    
    return generateBookingMessage({
      clientName: clientData.name,
      serviceName: selectedService.name,
      professionalName: selectedProfessional.name,
      date: selectedDate,
      time: selectedTime,
      price: selectedService.price,
      phone: clientData.phone,
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("appointments")
        .insert([{
          user_id: barbershopId,
          service_id: selectedService?.id,
          professional_id: selectedProfessional?.id,
          client_name: clientData.name,
          client_phone: clientData.phone,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
        }]);

      if (error) throw error;

      toast({
        title: "Agendamento confirmado!",
        description: "Seu agendamento foi realizado com sucesso.",
      });

      // Show WhatsApp options
      setCurrentStep(6);
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar agendamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppShare = () => {
    // Reset form after sharing
    setTimeout(() => {
      setCurrentStep(1);
      setSelectedService(null);
      setSelectedProfessional(null);
      setSelectedDate("");
      setSelectedTime("");
      setClientData({ name: "", phone: "" });
    }, 2000);
  };

  const handleNewBooking = () => {
    setCurrentStep(1);
    setSelectedService(null);
    setSelectedProfessional(null);
    setSelectedDate("");
    setSelectedTime("");
    setClientData({ name: "", phone: "" });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Scissors className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {barbershopName || "AgendaFácil"}
          </h1>
          <p className="text-muted-foreground">Agende seu horário online</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Step 1: Select Service */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Escolha o Serviço</CardTitle>
              <CardDescription>Selecione o serviço que deseja</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((service) => (
                <Button
                  key={service.id}
                  variant="outline"
                  className="w-full justify-between h-auto p-4"
                  onClick={() => handleServiceSelect(service)}
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

        {/* Step 2: Select Professional */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Escolha o Profissional</CardTitle>
              <CardDescription>
                Serviço selecionado: {selectedService?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => {
                  setSelectedProfessional(professionals[0]);
                  setCurrentStep(3);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Qualquer profissional disponível
              </Button>
              {professionals.map((professional) => (
                <Button
                  key={professional.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => handleProfessionalSelect(professional)}
                >
                  <User className="h-4 w-4 mr-2" />
                  {professional.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Date */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Escolha a Data</CardTitle>
              <CardDescription>
                Profissional: {selectedProfessional?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="date"
                min={getMinDate()}
                onChange={(e) => handleDateSelect(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>
        )}

        {/* Step 4: Select Time */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Escolha o Horário</CardTitle>
              <CardDescription>
                Data: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableTimes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum horário disponível para esta data
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      onClick={() => handleTimeSelect(time)}
                      className="h-12"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {time}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 5: Client Information */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Seus Dados</CardTitle>
              <CardDescription>
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')} às {selectedTime}
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
                  <p><strong>Serviço:</strong> {selectedService?.name}</p>
                  <p><strong>Profissional:</strong> {selectedProfessional?.name}</p>
                  <p><strong>Data:</strong> {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
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

        {/* Step 6: WhatsApp Confirmation */}
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
                <p><strong>Cliente:</strong> {clientData.name}</p>
                <p><strong>Serviço:</strong> {selectedService?.name}</p>
                <p><strong>Profissional:</strong> {selectedProfessional?.name}</p>
                <p><strong>Data:</strong> {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                <p><strong>Horário:</strong> {selectedTime}</p>
                <p><strong>Valor:</strong> R$ {selectedService?.price.toFixed(2)}</p>
              </div>

              <div className="space-y-3">
                <div onClick={handleWhatsAppShare}>
                  <WhatsAppButton 
                    message={generateWhatsAppMessage()}
                    className="w-full"
                  >
                    Compartilhar no WhatsApp
                  </WhatsAppButton>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={handleNewBooking}
                  className="w-full"
                >
                  Fazer Novo Agendamento
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>💡 Dica: Compartilhe no WhatsApp para ter uma cópia do agendamento e facilitar o contato com a barbearia!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default BookingPublic;