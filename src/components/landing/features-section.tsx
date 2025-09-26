import { FeatureCard } from "@/components/ui/feature-card";
import { Calendar, Users, CreditCard, BarChart3, Clock, Smartphone } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Agendamento Online",
      description: "Seus clientes agendam direto pelo celular, 24 horas por dia, sem precisar ligar."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Gestão de Profissionais",
      description: "Controle horários, serviços e disponibilidade de todos os barbeiros em um só lugar."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Controle Financeiro",
      description: "Acompanhe faturamento, formas de pagamento e tenha relatórios detalhados."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Dashboard Completo",
      description: "Veja tudo que importa: agendamentos do dia, faturamento e próximos clientes."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Agenda Visual",
      description: "Visualize todos os horários em tempo real e faça agendamentos manuais rapidamente."
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Notificações WhatsApp",
      description: "Confirmações automáticas via WhatsApp para reduzir faltas e melhorar comunicação."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <span className="text-accent font-medium text-sm">✨ Funcionalidades Completas</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Tudo que sua Barbearia <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">Precisa</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Sistema completo que simplifica sua gestão, automatiza processos e melhora a experiência dos seus clientes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}