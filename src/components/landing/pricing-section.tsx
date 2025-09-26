import { PricingCard } from "@/components/ui/pricing-card";

export function PricingSection() {
  const plans = [
    {
      title: "Básico",
      price: "R$ 39,90",
      period: "mês",
      description: "Perfeito para barbearias com 1 profissional",
      features: [
        "1 Profissional cadastrado",
        "Agendamento online ilimitado",
        "Dashboard básico",
        "Controle financeiro simples",
        "Notificações WhatsApp",
        "Suporte via chat"
      ]
    },
    {
      title: "Profissional",
      price: "R$ 69,90",
      period: "mês",
      description: "Ideal para barbearias em crescimento",
      features: [
        "Até 3 Profissionais",
        "Agendamento online ilimitado",
        "Dashboard avançado",
        "Relatórios detalhados",
        "Notificações WhatsApp",
        "Gestão de serviços",
        "Suporte prioritário"
      ],
      highlighted: true
    },
    {
      title: "Premium",
      price: "R$ 99,90",
      period: "mês",
      description: "Para barbearias estabelecidas",
      features: [
        "Até 5 Profissionais",
        "Todas as funcionalidades",
        "Relatórios avançados",
        "API para integração",
        "Backup automático",
        "Suporte 24/7",
        "Treinamento incluso"
      ]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-secondary/20 via-secondary/30 to-secondary/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <span className="text-accent font-medium text-sm">💎 Planos Transparentes</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Planos que <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">Cabem no seu Bolso</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Escolha o plano ideal para sua barbearia. Todos incluem teste grátis de 30 dias e suporte completo.
          </p>
          <div className="inline-flex items-center bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30 rounded-full px-6 py-3 shadow-lg">
            <span className="text-accent font-semibold">🎉 Oferta de Lançamento: 50% OFF nos primeiros 3 meses</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <PricingCard
                title={plan.title}
                price={plan.price}
                period={plan.period}
                description={plan.description}
                features={plan.features}
                highlighted={plan.highlighted}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <p className="text-muted-foreground text-lg mb-4">
              Dúvidas sobre qual plano escolher?
            </p>
            <p className="text-accent font-semibold text-lg">
              📞 Entre em contato e nossa equipe te ajuda a escolher o melhor plano!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}