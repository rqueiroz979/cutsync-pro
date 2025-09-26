import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-primary text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/10 rounded-full blur-xl"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="animate-fade-in">
          <div className="inline-flex items-center bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-4 py-2 mb-6">
            <span className="text-primary-foreground font-medium text-sm">🚀 Comece Hoje Mesmo</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Pronto para <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">Digitalizar</span> sua Barbearia?
          </h2>
          
          <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Junte-se a mais de 50 barbearias em Curitiba que já transformaram seus negócios e aumentaram o faturamento
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-10 py-5 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              onClick={() => window.location.href = "/auth"}
            >
              🎯 Começar Teste Grátis Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 px-10 py-5 text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
            >
              💬 Falar com Especialista
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20 hover:border-primary-foreground/30 transition-all duration-300">
            <div className="text-3xl font-bold mb-2">✅</div>
            <div className="text-sm font-medium opacity-90">30 dias grátis</div>
          </div>
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20 hover:border-primary-foreground/30 transition-all duration-300">
            <div className="text-3xl font-bold mb-2">🚀</div>
            <div className="text-sm font-medium opacity-90">Setup em 10 min</div>
          </div>
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20 hover:border-primary-foreground/30 transition-all duration-300">
            <div className="text-3xl font-bold mb-2">💪</div>
            <div className="text-sm font-medium opacity-90">Suporte local</div>
          </div>
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20 hover:border-primary-foreground/30 transition-all duration-300">
            <div className="text-3xl font-bold mb-2">❌</div>
            <div className="text-sm font-medium opacity-90">Sem fidelidade</div>
          </div>
        </div>
      </div>
    </section>
  );
}