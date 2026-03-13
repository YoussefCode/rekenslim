
CREATE TABLE public.student_domain_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_domain_id uuid NOT NULL REFERENCES public.student_domains(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  result_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.student_domain_results ENABLE ROW LEVEL SECURITY;

-- Admins full access
CREATE POLICY "Admins full access to student_domain_results"
ON public.student_domain_results
FOR ALL
TO public
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
));

-- Students can insert their own results
CREATE POLICY "Students can insert own results"
ON public.student_domain_results
FOR INSERT
TO public
WITH CHECK (student_id = auth.uid());

-- Students can view their own results
CREATE POLICY "Students can view own results"
ON public.student_domain_results
FOR SELECT
TO public
USING (student_id = auth.uid());
