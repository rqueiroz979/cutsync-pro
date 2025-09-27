-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.validate_appointment_slot(
  p_professional_id uuid,
  p_appointment_date date,
  p_appointment_time time,
  p_duration_minutes integer,
  p_appointment_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the time slot is already taken
  RETURN NOT EXISTS (
    SELECT 1
    FROM public.appointments a
    JOIN public.services s ON a.service_id = s.id
    WHERE a.professional_id = p_professional_id
      AND a.appointment_date = p_appointment_date
      AND a.status NOT IN ('cancelled', 'completed')
      AND (p_appointment_id IS NULL OR a.id != p_appointment_id)
      AND (
        -- Check for time overlap
        (a.appointment_time <= p_appointment_time 
         AND (a.appointment_time + (s.duration_minutes || ' minutes')::interval)::time > p_appointment_time)
        OR
        (p_appointment_time <= a.appointment_time 
         AND (p_appointment_time + (p_duration_minutes || ' minutes')::interval)::time > a.appointment_time)
      )
  );
END;
$$;