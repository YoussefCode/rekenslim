
-- Domeinen per leerling
CREATE TABLE public.student_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain_name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.student_domains ENABLE ROW LEVEL SECURITY;

-- Lesmateriaal per domein
CREATE TABLE public.student_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_domain_id uuid NOT NULL REFERENCES public.student_domains(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.student_materials ENABLE ROW LEVEL SECURITY;

-- Oefenvragen per domein
CREATE TABLE public.student_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_domain_id uuid NOT NULL REFERENCES public.student_domains(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer integer NOT NULL,
  explanation text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.student_questions ENABLE ROW LEVEL SECURITY;

-- Storage bucket voor PDF bestanden
INSERT INTO storage.buckets (id, name, public) VALUES ('student-files', 'student-files', true);

-- RLS: Admins kunnen alles, leerlingen zien alleen hun eigen data
CREATE POLICY "Admins full access to student_domains" ON public.student_domains FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Students view own domains" ON public.student_domains FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Admins full access to student_materials" ON public.student_materials FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Students view own materials" ON public.student_materials FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.student_domains sd WHERE sd.id = student_domain_id AND sd.student_id = auth.uid()
  ));

CREATE POLICY "Admins full access to student_questions" ON public.student_questions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Students view own questions" ON public.student_questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.student_domains sd WHERE sd.id = student_domain_id AND sd.student_id = auth.uid()
  ));

-- Storage RLS: admins uploaden, leerlingen downloaden
CREATE POLICY "Admins can upload files" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'student-files' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Admins can manage files" ON storage.objects FOR ALL
  USING (bucket_id = 'student-files' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Anyone can read student files" ON storage.objects FOR SELECT
  USING (bucket_id = 'student-files');
