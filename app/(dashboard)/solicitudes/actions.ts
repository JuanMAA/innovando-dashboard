'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { LeadStatus, DashboardUser } from '@/types'

export async function updateLead(
  id: string,
  patch: {
    status?:        LeadStatus
    internal_note?: string | null
    assigned_to?:   string | null
  },
) {
  const supabase = createAdminClient()
  const now = new Date().toISOString()

  const update: Record<string, unknown> = { updated_at: now }

  if (patch.status) {
    update.status            = patch.status
    update.status_changed_at = now
    if (patch.status === 'contacted') update.contacted_at = now
    if (patch.status === 'converted') update.converted_at = now
  }
  if (patch.internal_note !== undefined) update.internal_note = patch.internal_note
  if (patch.assigned_to    !== undefined) update.assigned_to   = patch.assigned_to

  const { error } = await supabase.from('leads').update(update).eq('id', id)
  if (error) {
    console.error('[updateLead]', error)
    return { ok: false, error: error.message }
  }

  revalidatePath('/solicitudes')
  revalidatePath(`/solicitudes/${id}`)
  return { ok: true }
}

/**
 * Lista usuarios del dashboard (auth.users) para mostrar en selectores
 * de asignación. Sólo email + id.
 */
export async function listDashboardUsers(): Promise<DashboardUser[]> {
  const supabase = createAdminClient()
  // listUsers requiere admin (service-role); ya lo usamos en createAdminClient
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 })
  if (error) {
    console.error('[listDashboardUsers]', error)
    return []
  }
  return (data?.users ?? []).map((u) => ({
    id:    u.id,
    email: u.email ?? null,
    name:  (u.user_metadata?.full_name as string | undefined) ?? (u.user_metadata?.name as string | undefined) ?? null,
  }))
}
