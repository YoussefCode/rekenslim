CREATE TABLE IF NOT EXISTS public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.class_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (class_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.class_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  domain_name text NOT NULL,
  description text,
  html_file_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.student_domains
ADD COLUMN IF NOT EXISTS class_domain_id uuid REFERENCES public.class_domains(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS student_domains_unique_class_domain_per_student
ON public.student_domains(student_id, class_domain_id)
WHERE class_domain_id IS NOT NULL;

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access classes"
ON public.classes
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access class_students"
ON public.class_students
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access class_domains"
ON public.class_domains
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Students can view own class_students"
ON public.class_students
FOR SELECT
USING (student_id = auth.uid());

CREATE POLICY "Students can view own class domains"
ON public.class_domains
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.class_students cs
    WHERE cs.class_id = class_domains.class_id
      AND cs.student_id = auth.uid()
  )
);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'update_updated_at_column'
      AND pg_function_is_visible(oid)
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'update_classes_updated_at'
    ) THEN
      CREATE TRIGGER update_classes_updated_at
      BEFORE UPDATE ON public.classes
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'update_class_domains_updated_at'
    ) THEN
      CREATE TRIGGER update_class_domains_updated_at
      BEFORE UPDATE ON public.class_domains
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
  END IF;
END $$;
