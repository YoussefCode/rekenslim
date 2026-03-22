CREATE OR REPLACE FUNCTION public.get_students_with_last_login()
RETURNS TABLE (
  user_id uuid,
  email text,
  role text,
  first_name text,
  last_name text,
  last_login_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT
    p.user_id,
    p.email,
    p.role,
    p.first_name,
    p.last_name,
    u.last_sign_in_at AS last_login_at
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.user_id
  WHERE p.role = 'student'
    AND public.is_admin(auth.uid())
  ORDER BY p.first_name;
$$;

GRANT EXECUTE ON FUNCTION public.get_students_with_last_login() TO authenticated;
