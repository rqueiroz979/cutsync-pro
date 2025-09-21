import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText?: string;
  className?: string;
}

export function PricingCard({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  highlighted = false,
  buttonText = "Começar Teste Grátis",
  className 
}: PricingCardProps) {
  return (
    <div className={cn(
      "relative",
      "bg-gradient-card backdrop-blur-sm",
      "border border-border/50",
      "rounded-xl p-6",
      "shadow-soft hover:shadow-medium",
      "transition-all duration-300",
      highlighted && "border-accent shadow-medium scale-105",
      className
    )}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">
            Mais Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="font-bold text-xl text-foreground mb-2">{title}</h3>
        <div className="flex items-baseline justify-center mb-2">
          <span className="text-3xl font-bold text-primary">{price}</span>
          <span className="text-muted-foreground ml-1">/{period}</span>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <Check className="w-4 h-4 text-success mr-3 flex-shrink-0" />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        className="w-full" 
        variant={highlighted ? "default" : "outline"}
      >
        {buttonText}
      </Button>
    </div>
  );
}