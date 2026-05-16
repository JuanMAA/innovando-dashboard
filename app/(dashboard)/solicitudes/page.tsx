import { Suspense } from 'react'
import { createAdminClient } from '@/lib/supabase/admin'
import TablaSolicitudes from '@/components/solicitudes/TablaSolicitudes'
import FiltrosSolicitudes from '@/components/solicitudes/FiltrosSolicitudes'
import type { Lead, LeadStatus } from '@/types'
import { listDashboardUsers } from './actions'

export const revalidate = 0

interface Props {
  searchParams: Promise<{
    q?:       string
    estado?:  string
    seccion?: string
    locale?:  string
  }>
}

export default async function SolicitudesPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = createAdminClient()

  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)

  if (params.estado && params.estado !== 'all') {
    query = query.eq('status', params.estado as LeadStatus)
  }
  if (params.seccion && params.seccion !== 'all') {
    query = query.eq('page_key', params.seccion)
  }
  if (params.locale && params.locale !== 'all') {
    query = query.eq('locale', params.locale)
  }
  if (params.q) {
    // Buscar en nombre o email (case-insensitive)
    query = query.or(`name.ilike.%${params.q}%,email.ilike.%${params.q}%`)
  }

  const { data: leads } = await query
  const users = await listDashboardUsers()

  /* Contadores por estado (todos sin filtros, para los chips) */
  const { data: allForCount } = await supabase
    .from('leads')
    .select('status')
  const counts: Record<string, number> = {}
  ;(allForCount ?? []).forEach((l) => {
    const s = (l as { status: string }).status
    counts[s] = (counts[s] ?? 0) + 1
  })
  const total = (allForCount ?? []).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Solicitudes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Mensajes recibidos desde el formulario del landing.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> {total} total
          </span>
          {(['new', 'contacted', 'qualified', 'converted'] as const).map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 font-medium text-gray-600"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                s === 'new'        ? 'bg-sky-400'     :
                s === 'contacted'  ? 'bg-blue-500'    :
                s === 'qualified'  ? 'bg-violet-500'  :
                                     'bg-emerald-500'
              }`} />
              {s === 'new' ? 'nuevos' : s === 'contacted' ? 'contactados' : s === 'qualified' ? 'calificados' : 'convertidos'}: {counts[s] ?? 0}
            </span>
          ))}
        </div>
      </div>

      <Suspense>
        <FiltrosSolicitudes />
      </Suspense>

      <p className="text-sm text-gray-500">{leads?.length ?? 0} resultado{leads?.length !== 1 ? 's' : ''}</p>

      <TablaSolicitudes leads={(leads ?? []) as Lead[]} users={users} />
    </div>
  )
}
