import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FeaturesSection } from "@/components/landing/features-section-enhanced";

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Funcionalidades Completas para sua Barbearia
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tudo que você precisa para gerenciar sua barbearia em um único sistema
            </p>
          </div>
        </div>
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Features;
