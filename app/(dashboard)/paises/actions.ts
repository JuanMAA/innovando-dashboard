'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Country, PaymentMethod } from '@/types'

const ALLOWED_PAYMENTS: PaymentMethod[] = ['paypal', 'mercadopago']

export async function updateCountry(
  code: string,
  patch: Partial<Pick<Country, 'enabled' | 'payment_methods' | 'notes' | 'name' | 'currency' | 'flag_emoji'>>,
) {
  const supabase = createAdminClient()

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (patch.enabled !== undefined) {
    update.enabled = patch.enabled
    if (patch.enabled) update.launched_at = new Date().toISOString()
  }
  if (patch.payment_methods !== undefined) {
    update.payment_methods = patch.payment_methods.filter((m) => ALLOWED_PAYMENTS.includes(m))
  }
  if (patch.notes !== undefined)       update.notes       = patch.notes
  if (patch.name !== undefined)        update.name        = patch.name
  if (patch.currency !== undefined)    update.currency    = patch.currency
  if (patch.flag_emoji !== undefined)  update.flag_emoji  = patch.flag_emoji

  const { error } = await supabase.from('countries').update(update).eq('code', code)
  if (error) {
    console.error('[updateCountry]', error)
    return { ok: false, error: error.message }
  }
  revalidatePath('/paises')
  return { ok: true }
}

export async function createCountry(input: Pick<Country, 'code' | 'name' | 'currency'> & Partial<Country>) {
  const supabase = createAdminClient()
  const row = {
    code:            input.code.toUpperCase(),
    name:            input.name,
    currency:        input.currency,
    enabled:         input.enabled ?? false,
    payment_methods: (input.payment_methods ?? []).filter((m) => ALLOWED_PAYMENTS.includes(m)),
    flag_emoji:      input.flag_emoji ?? null,
    notes:           input.notes ?? null,
    launched_at:     input.enabled ? new Date().toISOString() : null,
  }
  const { error } = await supabase.from('countries').insert(row)
  if (error) {
    console.error('[createCountry]', error)
    return { ok: false, error: error.message }
  }
  revalidatePath('/paises')
  return { ok: true }
}
