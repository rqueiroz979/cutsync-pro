import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CreditCard } from "lucide-react";

interface AppointmentLimitWarningProps {
  appointmentsUsed: number;
  maxFreeAppointments?: number;
  onUpgrade?: () => void;
}

export function AppointmentLimitWarning({ 
  appointmentsUsed, 
  maxFreeAppointments = 10, 
  onUpgrade 
}: AppointmentLimitWarningProps) {
  const remaining = maxFreeAppointments - appointmentsUsed;
  
  if (appointmentsUsed >= maxFreeAppointments) {
    return (
      <Alert className="border-destructive bg-destructive/10">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertTitle className="text-destructive">Limite de agendamentos atingido</AlertTitle>
        <AlertDescription className="text-destructive/80">
          Você já utilizou seus {maxFreeAppointments} agendamentos gratuitos. Para continuar criando agendamentos, é necessário assinar um plano.
          {onUpgrade && (
            <Button 
              onClick={onUpgrade}
              className="mt-3 bg-accent hover:bg-accent/90 text-accent-foreground"
              size="sm"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Assinar Plano Agora
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (remaining <= 3) {
    return (
      <Alert className="border-warning bg-warning/10">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <AlertTitle className="text-warning">Atenção: Poucos agendamentos restantes</AlertTitle>
        <AlertDescription className="text-warning/80">
          Você tem apenas {remaining} agendamento{remaining !== 1 ? 's' : ''} gratuito{remaining !== 1 ? 's' : ''} restante{remaining !== 1 ? 's' : ''}. 
          Considere assinar um plano para continuar utilizando o sistema sem limites.
          {onUpgrade && (
            <Button 
              onClick={onUpgrade}
              variant="outline"
              className="mt-3 border-warning text-warning hover:bg-warning/10"
              size="sm"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Ver Planos
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}