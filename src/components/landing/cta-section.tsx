import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Pronto para Digitalizar sua Barbearia?
        </h2>
        
        <p className="text-xl mb-8 opacity-90">
          Junte-se a mais de 50 barbearias em Curitiba que já transformaram seus negócios
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 text-lg"
          >
            Começar Teste Grátis Agora
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8 py-4 text-lg"
          >
            Falar com Especialista
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold mb-1">✅</div>
            <div className="text-sm opacity-80">30 dias grátis</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">🚀</div>
            <div className="text-sm opacity-80">Setup em 10 min</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">💪</div>
            <div className="text-sm opacity-80">Suporte local</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">❌</div>
            <div className="text-sm opacity-80">Sem fidelidade</div>
          </div>
        </div>
      </div>
    </section>
  );
}