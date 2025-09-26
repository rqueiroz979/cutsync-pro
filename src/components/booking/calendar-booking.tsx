import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isSameDay, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface CalendarBookingProps {
  availableTimes: string[];
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  professionalName?: string;
  serviceDuration?: number;
}

export const CalendarBooking = ({
  availableTimes,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  professionalName,
  serviceDuration = 30,
}: CalendarBookingProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    const slots = generateTimeSlots();
    setTimeSlots(slots);
  }, [availableTimes]);

  const generateTimeSlots = (): TimeSlot[] => {
    const allPossibleTimes = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += serviceDuration) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allPossibleTimes.push({
          time: timeString,
          available: availableTimes.includes(timeString),
        });
      }
    }
    return allPossibleTimes;
  };

  const getDateDisplayText = (date: Date) => {
    if (isToday(date)) {
      return "Hoje";
    } else if (isTomorrow(date)) {
      return "Amanhã";
    }
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  const modifiers = {
    available: (date: Date) => {
      // Here you could add logic to check if the date has available slots
      const today = new Date();
      return date >= today;
    },
  };

  const modifiersStyles = {
    available: {
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Calendar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Escolha a Data
          </CardTitle>
          {professionalName && (
            <p className="text-sm text-muted-foreground">
              Profissional: {professionalName}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={(date) => date < new Date()}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className={cn("rounded-md border shadow pointer-events-auto")}
            locale={ptBR}
          />
        </CardContent>
      </Card>

      {/* Time Slots Section */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horários Disponíveis
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {getDateDisplayText(selectedDate)}
              </Badge>
              <Badge variant="outline">
                {availableTimes.length} horários disponíveis
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {availableTimes.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-2">
                  Nenhum horário disponível
                </p>
                <p className="text-sm text-muted-foreground">
                  Tente selecionar outra data
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {timeSlots
                  .filter(slot => slot.available)
                  .map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      size="sm"
                      onClick={() => onTimeSelect(slot.time)}
                      className={cn(
                        "h-12 relative transition-all duration-200",
                        selectedTime === slot.time && [
                          "bg-primary text-primary-foreground",
                          "shadow-lg scale-105"
                        ],
                        !slot.available && [
                          "opacity-50 cursor-not-allowed",
                          "hover:bg-transparent"
                        ]
                      )}
                      disabled={!slot.available}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium">{slot.time}</span>
                        {selectedTime === slot.time && (
                          <CheckCircle className="h-3 w-3 absolute -top-1 -right-1" />
                        )}
                      </div>
                    </Button>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selected Summary */}
      {selectedDate && selectedTime && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Agendamento selecionado</p>
                <p className="font-medium">
                  {getDateDisplayText(selectedDate)} às {selectedTime}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <Badge className="bg-primary text-primary-foreground">
                  Confirmado
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarBooking;