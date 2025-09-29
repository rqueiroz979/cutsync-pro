import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppointmentLimit } from "@/hooks/use-appointment-limit";
import { Calendar, CreditCard, Zap } from "lucide-react";

interface UsageOverviewProps {
  userId: string;
}

export function UsageOverview({ userId }: UsageOverviewProps) {
  const { limit, loading, error } = useAppointmentLimit(userId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error || !limit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro ao carregar informações</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const maxFree = 10;
  const remaining = maxFree - limit.appointments_used;
  const progressPercentage = (limit.appointments_used / maxFree) * 100;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">Uso do Sistema</CardTitle>
          <CardDescription>
            {limit.has_active_subscription ? 
              "Você tem um plano ativo - agendamentos ilimitados!" :
              "Acompanhe seu uso de agendamentos gratuitos"
            }
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          {limit.has_active_subscription ? (
            <Badge variant="default" className="bg-success text-success-foreground">
              <CreditCard className="h-4 w-4 mr-1" />
              Plano Ativo
            </Badge>
          ) : (
            <Badge variant="outline">
              <Zap className="h-4 w-4 mr-1" />
              Plano Gratuito
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!limit.has_active_subscription && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendamentos utilizados
                </span>
                <span className="font-semibold">
                  {limit.appointments_used} / {maxFree}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {remaining > 0 ? 
                  `Você ainda tem ${remaining} agendamento${remaining !== 1 ? 's' : ''} gratuito${remaining !== 1 ? 's' : ''} restante${remaining !== 1 ? 's' : ''}.` :
                  "Você atingiu o limite de agendamentos gratuitos."
                }
              </p>
            </div>

            {remaining <= 3 && (
              <div className="pt-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {remaining === 0 ? 
                    "Para continuar criando agendamentos, assine um de nossos planos." :
                    "Que tal assinar um plano para ter agendamentos ilimitados?"
                  }
                </p>
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => window.open('/pricing', '_blank')}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Ver Planos e Preços
                </Button>
              </div>
            )}
          </>
        )}

        {limit.has_active_subscription && (
          <div className="pt-2">
            <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/20 rounded-full">
                  <Calendar className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-success">Agendamentos Ilimitados</p>
                  <p className="text-xs text-success/80">Crie quantos agendamentos precisar</p>
                </div>
              </div>
              <Badge variant="default" className="bg-success text-success-foreground">
                ∞
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}