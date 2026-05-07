import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Mail, MailX, Send, AlertTriangle } from 'lucide-react'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createAdminClient()

  const [
    { count: totalLeads },
    { count: conEmail },
    { count: sinEmail },
    { count: reportesEnviados },
    { count: problemasPendientes },
    { count: requierenRelleno },
    { count: reportadosSinContactar },
  ] = await Promise.all([
    supabase.from('businesses').select('*', { count: 'exact', head: true }),
    supabase.from('businesses').select('*', { count: 'exact', head: true }).not('email', 'is', null),
    supabase.from('businesses').select('*', { count: 'exact', head: true }).is('email', null),
    supabase.from('outreach_logs').select('*', { count: 'exact', head: true }).eq('type', 'email_teaser'),
    supabase.from('issue_reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('needs_review', true),
    supabase.from('businesses').select('*', { count: 'exact', head: true })
      .eq('has_reported_issue', true)
      .eq('status', 'new'),
  ])

  const kpis = [
    { label: 'Total leads', value: totalLeads ?? 0, icon: Users },
    { label: 'Con email', value: conEmail ?? 0, icon: Mail },
    { label: 'Sin email', value: sinEmail ?? 0, icon: MailX },
    { label: 'Reportes enviados', value: reportesEnviados ?? 0, icon: Send },
    { label: 'Problemas', value: problemasPendientes ?? 0, icon: AlertTriangle },
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Resumen general</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-gray-500">{label}</CardTitle>
              <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {(requierenRelleno ?? 0) > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <span className="text-red-500">🔴</span>
            <p className="text-sm text-red-700">
              <strong>{requierenRelleno}</strong>{' '}
              {requierenRelleno === 1 ? 'lead requiere' : 'leads requieren'} relleno manual de contacto
            </p>
          </div>
        )}
        {(problemasPendientes ?? 0) > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <span className="text-red-500">🔴</span>
            <p className="text-sm text-red-700">
              <strong>{problemasPendientes}</strong>{' '}
              {problemasPendientes === 1 ? 'problema reportado pendiente' : 'problemas reportados pendientes'}
            </p>
          </div>
        )}
        {(reportadosSinContactar ?? 0) > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
            <span className="text-yellow-500">🟡</span>
            <p className="text-sm text-yellow-700">
              <strong>{reportadosSinContactar}</strong>{' '}
              {reportadosSinContactar === 1 ? 'lead con reporte pero sin contactar' : 'leads con reporte pero sin contactar'}
            </p>
          </div>
        )}
        {(requierenRelleno ?? 0) === 0 && (problemasPendientes ?? 0) === 0 && (reportadosSinContactar ?? 0) === 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <span>🟢</span>
            <p className="text-sm text-green-700">Todo al día, sin alertas pendientes.</p>
          </div>
        )}
      </div>
    </div>
  )
}
