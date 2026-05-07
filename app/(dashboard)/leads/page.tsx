import { createAdminClient } from '@/lib/supabase/admin'
import TablaLeads from '@/components/leads/TablaLeads'
import FiltrosLeads from '@/components/leads/FiltrosLeads'
import { Suspense } from 'react'
import type { Business } from '@/types'

export const revalidate = 0

interface Props {
  searchParams: Promise<{
    ciudad?: string
    estado?: string
    email?: string
    relleno?: string
  }>
}

export default async function LeadsPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = createAdminClient()

  let query = supabase
    .from('businesses')
    .select('*')
    .order('score_total', { ascending: false })

  if (params.ciudad) query = query.eq('city', params.ciudad)
  if (params.estado && params.estado !== 'all') query = query.eq('status', params.estado)
  if (params.email === 'yes') query = query.not('email', 'is', null)
  if (params.email === 'no') query = query.is('email', null)
  if (params.relleno === '1') query = query.eq('needs_review', true)

  const { data: leads } = await query

  const { data: ciudadesRaw } = await supabase
    .from('businesses')
    .select('city')
    .not('city', 'is', null)

  const ciudades = [...new Set((ciudadesRaw ?? []).map(r => r.city as string))].sort()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
      <Suspense>
        <FiltrosLeads ciudades={ciudades} />
      </Suspense>
      <p className="text-sm text-gray-500">{leads?.length ?? 0} resultado{leads?.length !== 1 ? 's' : ''}</p>
      <TablaLeads leads={(leads ?? []) as Business[]} />
    </div>
  )
}
