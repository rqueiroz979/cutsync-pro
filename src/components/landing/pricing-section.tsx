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
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Planos que Cabem no seu Bolso
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Escolha o plano ideal para sua barbearia. Todos incluem teste grátis de 30 dias.
          </p>
          <div className="inline-flex items-center bg-accent/10 border border-accent/20 rounded-full px-4 py-2">
            <span className="text-accent font-medium">🎉 Oferta de Lançamento: 50% OFF nos primeiros 3 meses</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              highlighted={plan.highlighted}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Dúvidas sobre qual plano escolher? <span className="text-accent font-medium">Entre em contato</span> e te ajudamos!
          </p>
        </div>
      </div>
    </section>
  );
}