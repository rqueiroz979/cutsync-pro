import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AppointmentLimit {
  appointments_used: number;
  has_active_subscription: boolean;
  can_create_appointment: boolean;
}

export function useAppointmentLimit(userId: string | null) {
  const [limit, setLimit] = useState<AppointmentLimit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchLimit = async () => {
      try {
        // Get current usage
        const { data: limitData, error: limitError } = await supabase
          .from('user_appointment_limits')
          .select('appointments_used, has_active_subscription')
          .eq('user_id', userId)
          .single();

        if (limitError && limitError.code !== 'PGRST116') {
          throw limitError;
        }

        const appointments_used = limitData?.appointments_used || 0;
        const has_active_subscription = limitData?.has_active_subscription || false;
        const can_create_appointment = has_active_subscription || appointments_used < 10;

        setLimit({
          appointments_used,
          has_active_subscription,
          can_create_appointment
        });
      } catch (err) {
        console.error('Error fetching appointment limit:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar limite de agendamentos');
      } finally {
        setLoading(false);
      }
    };

    fetchLimit();
  }, [userId]);

  return { limit, loading, error };
}