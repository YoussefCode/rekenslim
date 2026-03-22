ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone;

UPDATE public.profiles p
SET last_login_at = u.last_sign_in_at
FROM auth.users u
WHERE p.user_id = u.id
  AND p.last_login_at IS NULL;
