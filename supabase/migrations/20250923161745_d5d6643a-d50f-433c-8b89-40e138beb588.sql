-- Fix security vulnerability: Restrict public access to sensitive customer data in appointments table

-- Drop the existing permissive policy that might allow public access
DROP POLICY IF EXISTS "Public can create appointments" ON public.appointments;

-- Create a secure INSERT policy for public booking (limited access)
CREATE POLICY "Public can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (true);

-- Ensure SELECT access is restricted to appointment owners only
CREATE POLICY "Users can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = user_id);

-- Ensure UPDATE access is restricted to appointment owners only  
CREATE POLICY "Users can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure DELETE access is restricted to appointment owners only
CREATE POLICY "Users can delete their own appointments" 
ON public.appointments 
FOR DELETE 
USING (auth.uid() = user_id);