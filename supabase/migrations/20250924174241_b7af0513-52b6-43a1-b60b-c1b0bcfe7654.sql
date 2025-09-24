-- Add new columns to profiles table for company data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;