-- Add level column to questions table
ALTER TABLE public.questions 
ADD COLUMN level TEXT NOT NULL DEFAULT 'basis';

-- Add level column to quiz_submissions table  
ALTER TABLE public.quiz_submissions
ADD COLUMN level TEXT NOT NULL DEFAULT 'basis';

-- Update the get_quiz_questions function to accept a level parameter
CREATE OR REPLACE FUNCTION public.get_quiz_questions(quiz_level text DEFAULT 'basis')
 RETURNS TABLE(id uuid, question_text text, options jsonb, created_at timestamp with time zone, updated_at timestamp with time zone, correct_answer integer, level text)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  -- If user is admin, return all data including correct answers
  SELECT 
    q.id,
    q.question_text,
    q.options,
    q.created_at,
    q.updated_at,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
          AND profiles.role = 'admin'
      ) THEN q.correct_answer
      ELSE NULL
    END as correct_answer,
    q.level
  FROM public.questions q
  WHERE q.level = quiz_level;
$function$