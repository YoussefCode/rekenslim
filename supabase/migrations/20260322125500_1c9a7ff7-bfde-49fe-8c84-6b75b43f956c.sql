DROP INDEX IF EXISTS public.student_domains_unique_class_domain_per_student;

CREATE UNIQUE INDEX IF NOT EXISTS student_domains_unique_student_class_domain
ON public.student_domains(student_id, class_domain_id);
