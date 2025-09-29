import { PricingSection } from "@/components/landing/pricing-section";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;