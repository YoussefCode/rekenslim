-- Fix admin login by ensuring admin@admin.com gets admin role
-- Also create content table for editable website text

-- First, update the handle_new_user function to properly handle admin@admin.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (
    NEW.id, 
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@admin.com' THEN 'admin'
      ELSE 'student'
    END
  );
  RETURN NEW;
END;
$function$;

-- Create content table for editable website text
CREATE TABLE public.content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Create policies for content
CREATE POLICY "Anyone can view content" 
ON public.content 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify content" 
ON public.content 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Add trigger for updated_at
CREATE TRIGGER update_content_updated_at
BEFORE UPDATE ON public.content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.content (key, value, description) VALUES
('home_title', 'Welkom bij de Quiz App', 'Hoofdtitel op de homepage'),
('home_subtitle', 'Test je rekenvaardigheden', 'Ondertitel op de homepage'),
('home_description', 'Log in om de quiz te maken', 'Beschrijving op de homepage'),
('quiz_title', 'Rekenquiz', 'Titel van de quiz pagina'),
('quiz_description', 'Beantwoord alle vragen en klik op "Quiz Voltooien" wanneer je klaar bent.', 'Beschrijving van de quiz pagina');