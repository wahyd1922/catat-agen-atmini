CREATE OR REPLACE FUNCTION delete_inactive_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM auth.users
  WHERE 
    (last_sign_in_at IS NOT NULL AND last_sign_in_at < NOW() - INTERVAL '30 days')
    OR
    (last_sign_in_at IS NULL AND created_at < NOW() - INTERVAL '30 days');
END;
$$;

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'delete_inactive_users_job',
  '0 0 * * *',
  $$SELECT delete_inactive_users();$$
);

ALTER TABLE public.transactions
DROP CONSTRAINT IF EXISTS transactions_user_id_fkey,
ADD CONSTRAINT transactions_user_id_fkey
   FOREIGN KEY (user_id)
   REFERENCES auth.users(id)
   ON DELETE CASCADE;
