-- Migration: 20261022000000_account_deletion.sql
-- Description: Provide a secure RPC function for users to delete their own account and all personal data.
-- Compliance: GDPR, CCPA, and Google API Services User Data Policy (User Data Deletion).

create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
begin
  -- Retrieve the ID of the authenticated user invoking this function
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Unauthenticated: Bạn phải đăng nhập để xóa tài khoản.' using errcode = '42501';
  end if;

  -- 1. Delete user learning progress records
  delete from public.user_learning_progress where user_id = v_user_id;

  -- 2. Delete user learning stats records
  delete from public.user_learning_stats where user_id = v_user_id;

  -- 3. Delete user from auth.users (cascades identities, OAuth tokens, and sessions)
  delete from auth.users where id = v_user_id;
end;
$$;

-- Restrict execution permissions: only authenticated users can call this for their own account
revoke all on function public.delete_user_account() from public, anon;
grant execute on function public.delete_user_account() to authenticated;

notify pgrst, 'reload schema';

