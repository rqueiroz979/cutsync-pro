import { FeatureCard } from "@/components/ui/feature-card";
import { Calendar, Users, CreditCard, BarChart3, Clock, Smartphone } from "lucide-react";
import bookingImage from "@/assets/feature-booking.jpg";
import professionalsImage from "@/assets/feature-professionals.jpg";
import financialImage from "@/assets/feature-financial.jpg";
import dashboardImage from "@/assets/feature-dashboard.jpg";
import calendarImage from "@/assets/feature-calendar.jpg";
import whatsappImage from "@/assets/feature-whatsapp.jpg";

export function FeaturesSection() {
  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Agendamento Online",
      description: "Seus clientes agendam direto pelo celular, 24 horas por dia, sem precisar ligar.",
      image: bookingImage
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Gestão de Profissionais",
      description: "Controle horários, serviços e disponibilidade de todos os barbeiros em um só lugar.",
      image: professionalsImage
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Controle Financeiro",
      description: "Acompanhe faturamento, formas de pagamento e tenha relatórios detalhados.",
      image: financialImage
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Dashboard Completo",
      description: "Veja tudo que importa: agendamentos do dia, faturamento e próximos clientes.",
      image: dashboardImage
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Agenda Visual",
      description: "Visualize todos os horários em tempo real e faça agendamentos manuais rapidamente.",
      image: calendarImage
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Notificações WhatsApp",
      description: "Confirmações automáticas via WhatsApp para reduzir faltas e melhorar comunicação.",
      image: whatsappImage
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <span className="text-accent font-medium text-sm">✨ Funcionalidades Completas</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Funcionalidades <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">Completas</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Sistema completo que simplifica sua gestão, automatiza processos e melhora a experiência dos seus clientes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="animate-fade-in group" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                {/* Feature Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 p-3 bg-accent/90 rounded-lg">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Feature Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}