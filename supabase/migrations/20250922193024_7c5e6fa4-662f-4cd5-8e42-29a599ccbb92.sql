-- Add domain field to questions table
ALTER TABLE public.questions ADD COLUMN domain text;

-- Add domain_results field to quiz_submissions table to track performance per domain
ALTER TABLE public.quiz_submissions ADD COLUMN domain_results jsonb;

-- Update existing questions to have a domain (if any exist for f2)
UPDATE public.questions SET domain = 'Algemeen' WHERE level = 'f2' AND domain IS NULL;