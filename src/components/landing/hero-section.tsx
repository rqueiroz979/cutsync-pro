import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-barbershop.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Barbearia moderna profissional" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Transforme sua <span className="text-accent">Barbearia</span> em um Negócio Digital
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            Sistema completo de agendamento e gestão financeira especialmente desenvolvido para barbearias de Curitiba e região.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 text-lg"
            >
              Teste Grátis por 30 Dias
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8 py-4 text-lg"
            >
              Ver Demonstração
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center text-primary-foreground">
              <div className="text-3xl font-bold mb-2">+50</div>
              <div className="text-primary-foreground/80">Barbearias Atendidas</div>
            </div>
            <div className="text-center text-primary-foreground">
              <div className="text-3xl font-bold mb-2">15.000+</div>
              <div className="text-primary-foreground/80">Agendamentos/Mês</div>
            </div>
            <div className="text-center text-primary-foreground">
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-primary-foreground/80">Satisfação dos Clientes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}