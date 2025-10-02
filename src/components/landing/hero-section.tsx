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
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <div className="inline-flex items-center bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
              <span className="text-accent font-medium text-sm">🚀 Novo: Integração WhatsApp Automática</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-8 leading-tight">
              Transforme sua Barbearia com o <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">AgendaFácil</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 leading-relaxed max-w-3xl mx-auto">
              Sistema completo de agendamento e gestão financeira especialmente desenvolvido para barbearias de todo o Brasil.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-10 py-5 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                onClick={() => window.location.href = "/auth"}
              >
                🎯 10 Agendamentos Grátis
              </Button>
              <Button 
                size="lg" 
                className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary font-semibold px-10 py-5 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border-2 border-primary-foreground"
                onClick={() => window.open('https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO', '_blank')}
              >
                📹 Ver Demonstração
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center text-primary-foreground animate-fade-in group">
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20 hover:border-primary-foreground/30 transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">+50</div>
                <div className="text-primary-foreground/90 font-medium">Barbearias Atendidas</div>
              </div>
            </div>
            <div className="text-center text-primary-foreground animate-fade-in group">
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20 hover:border-primary-foreground/30 transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">15.000+</div>
                <div className="text-primary-foreground/90 font-medium">Agendamentos/Mês</div>
              </div>
            </div>
            <div className="text-center text-primary-foreground animate-fade-in group">
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20 hover:border-primary-foreground/30 transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">98%</div>
                <div className="text-primary-foreground/90 font-medium">Satisfação dos Clientes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}