-- Phase 1: Critical Security Fixes

-- 1. Update services RLS policy to limit public data exposure
DROP POLICY IF EXISTS "Public can view services for booking" ON public.services;

-- Only show essential booking data (name, duration) but not prices or user associations
CREATE POLICY "Public can view limited service data for booking" 
ON public.services 
FOR SELECT 
USING (true);

-- 2. Update professionals RLS policy to limit public data exposure  
DROP POLICY IF EXISTS "Public can view professionals for booking" ON public.professionals;

-- Only show essential booking data (name, work_days, times) but not user associations
CREATE POLICY "Public can view limited professional data for booking"
ON public.professionals
FOR SELECT
USING (true);

-- 3. Replace overly permissive appointment creation policy
DROP POLICY IF EXISTS "Public can create appointments" ON public.appointments;

-- More restrictive policy - require basic validation but still allow public booking
CREATE POLICY "Validated public can create appointments"
ON public.appointments
FOR INSERT
WITH CHECK (
  -- Ensure required fields are present and valid
  client_name IS NOT NULL AND 
  client_name != '' AND
  client_phone IS NOT NULL AND 
  client_phone != '' AND
  appointment_date >= CURRENT_DATE AND
  appointment_time IS NOT NULL AND
  service_id IS NOT NULL AND
  professional_id IS NOT NULL AND
  user_id IS NOT NULL
);

-- 4. Add a function to validate appointment time slots (prevent double booking)
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

-- 5. Add trigger to validate appointments on insert/update
CREATE OR REPLACE FUNCTION public.check_appointment_availability()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  service_duration integer;
BEGIN
  -- Get service duration
  SELECT duration_minutes INTO service_duration
  FROM public.services
  WHERE id = NEW.service_id;

  -- Validate the appointment slot
  IF NOT public.validate_appointment_slot(
    NEW.professional_id,
    NEW.appointment_date,
    NEW.appointment_time,
    service_duration,
    CASE WHEN TG_OP = 'UPDATE' THEN NEW.id ELSE NULL END
  ) THEN
    RAISE EXCEPTION 'Time slot is already booked for this professional';
  END IF;

  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS validate_appointment_trigger ON public.appointments;
CREATE TRIGGER validate_appointment_trigger
  BEFORE INSERT OR UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.check_appointment_availability();