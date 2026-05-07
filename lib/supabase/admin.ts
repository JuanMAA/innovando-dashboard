import { createClient } from '@supabase/supabase-js'

// Cliente con service_role — bypasea RLS para queries de datos
// Solo usar en Server Components y Server Actions, nunca en el cliente
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
