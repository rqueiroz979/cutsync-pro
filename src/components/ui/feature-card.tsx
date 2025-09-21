import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={cn(
      "relative group",
      "bg-gradient-card backdrop-blur-sm",
      "border border-border/50",
      "rounded-xl p-6",
      "shadow-soft hover:shadow-medium",
      "transition-all duration-300",
      "hover:-translate-y-1",
      className
    )}>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}