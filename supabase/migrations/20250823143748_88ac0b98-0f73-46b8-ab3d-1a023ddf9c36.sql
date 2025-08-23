-- Create table for storing quiz submissions
CREATE TABLE public.quiz_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  parent_name TEXT,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  answers JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert quiz submissions
CREATE POLICY "Anyone can submit quiz results" 
ON public.quiz_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow viewing quiz submissions (for admin purposes)
CREATE POLICY "Anyone can view quiz submissions" 
ON public.quiz_submissions 
FOR SELECT 
USING (true);