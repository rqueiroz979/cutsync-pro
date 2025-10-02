-- Allow public to view barbershop information for booking
CREATE POLICY "Public can view barbershop info for booking"
ON public.profiles
FOR SELECT
USING (barbershop_name IS NOT NULL);