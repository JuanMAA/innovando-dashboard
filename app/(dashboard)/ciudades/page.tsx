import { createAdminClient } from '@/lib/supabase/admin'
import TablaCiudades from '@/components/ciudades/TablaCiudades'
import FormAgregarCiudad from '@/components/ciudades/FormAgregarCiudad'
import type { City } from '@/types'

export const revalidate = 0

export default async function CiudadesPage() {
  const supabase = createAdminClient()
  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .order('name')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Ciudades</h1>
        <FormAgregarCiudad />
      </div>
      <TablaCiudades cities={(cities ?? []) as City[]} />
    </div>
  )
}
