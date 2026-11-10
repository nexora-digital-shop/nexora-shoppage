# NEXORA store-access hardening

Status: migration 003 is committed. The owner reports it was executed successfully in Supabase and that the permission verification query returned the expected direct-write denials. The project has not been independently inspected; broader runtime and tenant-isolation tests remain.

## Risk addressed

The initial RLS policy allowed an authenticated store owner to insert or update their own store row directly. Although ownership was checked, a client could attempt to choose privileged fields such as `status='active'`. Store activation must not be self-service.

## Migration 003

`supabase/migrations/202611100003_store_write_hardening.sql`:

- Removes direct owner insert/update policies on `stores`.
- Revokes client insert/update table privileges for `anon` and `authenticated`.
- Keeps store creation through the authenticated `create_my_store(...)` SECURITY DEFINER function.
- That function derives ownership from `auth.uid()` and always creates a `draft` store.
- Removes direct client profile insertion; the Auth trigger provisions profiles.
- Leaves owner-scoped profile reads/updates and public reads of active stores in place.

## Required validation before connecting a real frontend

The owner reports migrations 001–003 have already been applied. Reported SQL verification results: `anon_can_insert_store=false`, `user_can_insert_store=false`, `user_can_update_store=false`, `user_can_insert_profile=false`, `user_can_create_store=true`, `remaining_policies=13`. Extend validation with actual separate anonymous and authenticated sessions:

1. Anonymous and authenticated clients cannot insert/update stores directly.
2. An authenticated user can create one draft store through the RPC.
3. An unauthenticated RPC call fails.
4. A second store for the same account fails.
5. A seller cannot change their store to active, paused, or suspended.
6. Public users can read only active stores and published products belonging to active stores.
7. One seller cannot read or alter another seller's private products.
8. The Auth trigger creates exactly one profile for a new user.

Do not rerun these migrations blindly; inspect the Supabase migration history first. The reported SQL checks are not a substitute for end-to-end testing. Do not expose the Supabase service-role key in browser code. Store activation needs a separate trusted admin workflow; that workflow is not implemented yet.
