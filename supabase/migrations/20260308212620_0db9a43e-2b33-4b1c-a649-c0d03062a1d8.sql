
-- Practice sets (groups of questions per domain)
CREATE TABLE public.practice_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL,
  title text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Practice questions within a set
CREATE TABLE public.practice_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_set_id uuid NOT NULL REFERENCES public.practice_sets(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  answer text NOT NULL,
  explanation text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.practice_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;

-- Everyone can read practice content
CREATE POLICY "Anyone can view practice sets" ON public.practice_sets FOR SELECT USING (true);
CREATE POLICY "Anyone can view practice questions" ON public.practice_questions FOR SELECT USING (true);

-- Admins full access
CREATE POLICY "Admins full access practice_sets" ON public.practice_sets FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins full access practice_questions" ON public.practice_questions FOR ALL USING (public.is_admin(auth.uid()));
