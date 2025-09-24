-- Add whatsapp column to profiles table for barbershop WhatsApp
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp TEXT;