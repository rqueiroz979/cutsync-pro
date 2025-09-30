import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Carlos Eduardo Silva",
      role: "Proprietário",
      barbershop: "Barbearia Premium - São Paulo, SP",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      rating: 5,
      text: "Desde que implementamos o CutSync Pro, nossos agendamentos aumentaram 40%. O sistema é intuitivo e meus clientes adoram poder agendar pelo celular a qualquer hora."
    },
    {
      name: "Roberto Ferreira",
      role: "Barbeiro",
      barbershop: "Cortes & Estilo - Rio de Janeiro, RJ",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
      rating: 5,
      text: "A integração com WhatsApp reduziu drasticamente as faltas. As confirmações automáticas fazem toda a diferença no nosso dia a dia. Recomendo muito!"
    },
    {
      name: "André Oliveira",
      role: "Proprietário",
      barbershop: "Barbershop Elite - Curitiba, PR",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andre",
      rating: 5,
      text: "O controle financeiro e os relatórios detalhados me deram uma visão clara do meu negócio. Consegui identificar horários de pico e otimizar a equipe. Excelente investimento!"
    },
    {
      name: "Marcelo Santos",
      role: "Gestor",
      barbershop: "The Barber House - Belo Horizonte, MG",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcelo",
      rating: 5,
      text: "Sistema completo que realmente entende as necessidades de uma barbearia. A agenda visual facilita muito o trabalho e o suporte é sempre rápido e eficiente."
    },
    {
      name: "Felipe Costa",
      role: "Proprietário",
      barbershop: "Barbearia Moderna - Porto Alegre, RS",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe",
      rating: 5,
      text: "Com 3 unidades, precisava de algo profissional e escalável. O CutSync Pro atendeu perfeitamente. Gerencio tudo de forma centralizada e tenho controle total do faturamento."
    },
    {
      name: "Lucas Mendes",
      role: "Barbeiro",
      barbershop: "Classic Cuts - Brasília, DF",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
      rating: 5,
      text: "Nunca foi tão fácil gerenciar meus horários. Os clientes conseguem escolher o profissional e o horário que preferem. Isso aumentou muito minha produtividade e satisfação."
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <span className="text-accent font-medium text-sm">⭐ Histórias de Sucesso</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            O que dizem nossos <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">Clientes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Barbearias de todo o Brasil já transformaram seus negócios com o CutSync Pro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-border/50 hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full bg-accent/10"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm font-medium text-accent">{testimonial.barbershop}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}