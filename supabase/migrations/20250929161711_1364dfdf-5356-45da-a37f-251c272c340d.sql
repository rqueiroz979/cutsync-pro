-- Create table to track appointment usage per user
CREATE TABLE public.user_appointment_limits (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    appointments_used integer NOT NULL DEFAULT 0,
    has_active_subscription boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_appointment_limits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own limits" 
ON public.user_appointment_limits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own limits" 
ON public.user_appointment_limits 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own limits" 
ON public.user_appointment_limits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to increment appointment count
CREATE OR REPLACE FUNCTION public.increment_appointment_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or increment appointment count
    INSERT INTO public.user_appointment_limits (user_id, appointments_used)
    VALUES (NEW.user_id, 1)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        appointments_used = user_appointment_limits.appointments_used + 1,
        updated_at = now();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to automatically count appointments
CREATE TRIGGER increment_appointment_count_trigger
    AFTER INSERT ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_appointment_count();

-- Add unique constraint for user_id
ALTER TABLE public.user_appointment_limits ADD CONSTRAINT user_appointment_limits_user_id_key UNIQUE (user_id);

-- Create function to check appointment limit
CREATE OR REPLACE FUNCTION public.check_appointment_limit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_count integer;
    has_subscription boolean;
BEGIN
    -- Get current usage and subscription status
    SELECT 
        COALESCE(appointments_used, 0),
        COALESCE(has_active_subscription, false)
    INTO current_count, has_subscription
    FROM public.user_appointment_limits
    WHERE user_id = p_user_id;
    
    -- If no record exists, user is under limit
    IF NOT FOUND THEN
        RETURN true;
    END IF;
    
    -- If has subscription, no limit
    IF has_subscription THEN
        RETURN true;
    END IF;
    
    -- Check if under free limit (10 appointments)
    RETURN current_count < 10;
END;
$$;

-- Add trigger for updated_at
CREATE TRIGGER update_user_appointment_limits_updated_at
    BEFORE UPDATE ON public.user_appointment_limits
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();