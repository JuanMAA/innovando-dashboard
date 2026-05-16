import { createAdminClient } from '@/lib/supabase/admin'
import TablaPaises from '@/components/paises/TablaPaises'
import type { Country } from '@/types'

export const revalidate = 0

export default async function PaisesPage() {
  const supabase = createAdminClient()
  const { data: countries } = await supabase
    .from('countries')
    .select('*')
    .order('enabled', { ascending: false })
    .order('name',    { ascending: true })

  const list = (countries ?? []) as Country[]
  const enabledCount = list.filter((c) => c.enabled).length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Países</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Países habilitados en la plataforma y métodos de pago disponibles. Al habilitar un país, aparece en el landing y en innovando-reports con los métodos seleccionados.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {enabledCount} habilitado{enabledCount !== 1 ? 's' : ''}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> {list.length - enabledCount} pausado{list.length - enabledCount !== 1 ? 's' : ''}
        </span>
      </div>

      <TablaPaises countries={list} />

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-1">Reglas de negocio</p>
        <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
          <li><b>PayPal</b> está disponible para todos los países.</li>
          <li><b>MercadoPago</b> está disponible <b>solo para Chile</b>.</li>
          <li>El precio se gestiona en <code className="px-1 bg-blue-100 rounded">country_pricing</code> (configurable por servicio y categoría).</li>
        </ul>
      </div>
    </div>
  )
}
