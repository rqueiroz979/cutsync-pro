import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import featureBooking from "@/assets/feature-booking.jpg";
import featureCalendar from "@/assets/feature-calendar.jpg";
import featureDashboard from "@/assets/feature-dashboard.jpg";
import featureFinancial from "@/assets/feature-financial.jpg";
import featureProfessionals from "@/assets/feature-professionals.jpg";
import featureWhatsapp from "@/assets/feature-whatsapp.jpg";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const features = [
  {
    image: featureDashboard,
    title: "Dashboard Completo",
    description: "Visualize todos os dados importantes em um só lugar: faturamento do dia, agendamentos e próximos clientes.",
    badge: "Visão Geral"
  },
  {
    image: featureCalendar,
    title: "Agenda Inteligente",
    description: "Gerencie todos os agendamentos com facilidade, visualize por data e acompanhe o status de cada atendimento.",
    badge: "Organização"
  },
  {
    image: featureBooking,
    title: "Agendamento Online",
    description: "Seus clientes podem agendar diretamente pelo link compartilhado, sem precisar criar conta ou baixar app.",
    badge: "Praticidade"
  },
  {
    image: featureWhatsapp,
    title: "WhatsApp Automático",
    description: "Envie confirmações e lembretes automaticamente para seus clientes via WhatsApp com um clique.",
    badge: "Automação"
  },
  {
    image: featureProfessionals,
    title: "Gestão de Profissionais",
    description: "Cadastre profissionais, defina horários de trabalho e organize a escala da sua equipe.",
    badge: "Equipe"
  },
  {
    image: featureFinancial,
    title: "Relatório Financeiro",
    description: "Acompanhe faturamento, pagamentos e tenha controle total das finanças da sua barbearia.",
    badge: "Financeiro"
  }
];

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Demonstração do Sistema
          </DialogTitle>
          <DialogDescription className="text-base">
            Conheça as principais funcionalidades do AgendaFácil
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 pb-6 flex-1 overflow-hidden">
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
              {features.map((feature, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="h-full flex flex-col gap-6 animate-fade-in">
                    <div className="relative rounded-xl overflow-hidden border-2 border-border shadow-2xl flex-1">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="text-sm font-semibold">
                          {feature.badge}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-center">
                      <h3 className="text-2xl font-bold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                        {feature.description}
                      </p>
                      <div className="pt-2">
                        <Badge variant="outline" className="text-sm">
                          {index + 1} de {features.length}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute bottom-1/2 left-4 transform translate-y-1/2">
              <CarouselPrevious className="relative left-0 translate-x-0" />
            </div>
            <div className="absolute bottom-1/2 right-4 transform translate-y-1/2">
              <CarouselNext className="relative right-0 translate-x-0" />
            </div>
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
