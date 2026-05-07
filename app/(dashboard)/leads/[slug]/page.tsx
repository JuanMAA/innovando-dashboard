import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import FormContacto from '@/components/leads/FormContacto'
import EditorNotas from '@/components/leads/EditorNotas'
import MapaUbicacion from '@/components/leads/MapaUbicacion'
import DatosEnriquecidos from '@/components/leads/DatosEnriquecidos'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ExternalLink, ArrowLeft, Star, Phone, Globe, MapPin } from 'lucide-react'
import type { Business, Report } from '@/types'

export const revalidate = 0

interface Props {
  params: Promise<{ slug: string }>
}

const moduloLabels: Record<string, string> = {
  p2a: 'Ficha Google Maps',
  p2b: 'Sitio web',
  p2c: 'Reputación',
  p2d: 'Redes sociales',
  p2e: 'SEO local + IA',
  p2f: 'Plataformas',
}

const moduloMax: Record<string, number> = {
  p2a: 15, p2b: 20, p2c: 20, p2d: 10, p2e: 10, p2f: 25,
}

const statusLabels: Record<string, string> = {
  new: 'Nuevo',
  analyzed: 'Analizado',
  contacted: 'Contactado',
  follow_up_1: 'Follow-up 1',
  follow_up_2: 'Follow-up 2',
  follow_up_3: 'Follow-up 3',
  report_paid: 'Reporte pagado',
  huella_paid: 'Huella pagada',
  tutorial_paid: 'Tutorial pagado',
  site_active: 'Sitio activo',
  renewal_pending: 'Renovación pendiente',
  renewed: 'Renovado',
  lost: 'Perdido',
  closed_permanently: 'Cerrado',
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  new: 'secondary',
  analyzed: 'secondary',
  contacted: 'default',
  follow_up_1: 'default',
  follow_up_2: 'default',
  follow_up_3: 'default',
  report_paid: 'default',
  huella_paid: 'default',
  tutorial_paid: 'default',
  site_active: 'default',
  renewal_pending: 'outline',
  renewed: 'default',
  lost: 'destructive',
  closed_permanently: 'destructive',
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-500' : 'text-red-500'
  const bg = score >= 70 ? 'bg-green-50 ring-green-200' : score >= 40 ? 'bg-yellow-50 ring-yellow-200' : 'bg-red-50 ring-red-200'
  return (
    <div className={cn('flex flex-col items-center justify-center w-24 h-24 rounded-full ring-4 shrink-0', bg)}>
      <span className={cn('text-3xl font-bold leading-none', color)}>{score}</span>
      <span className="text-xs text-gray-400 mt-0.5">/ 100</span>
    </div>
  )
}

function ScoreBar({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = Math.min(100, Math.round((score / max) * 100))
  const bar = pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-400' : 'bg-red-400'
  const text = pct >= 70 ? 'text-green-600' : pct >= 40 ? 'text-yellow-600' : 'text-red-500'
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className={cn('text-xs font-semibold tabular-nums', text)}>{score}/{max}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100">
        <div className={cn('h-1.5 rounded-full', bar)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default async function LeadDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = createAdminClient()

  const { data: lead } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!lead) notFound()

  const { data: report } = lead.latest_report_id
    ? await supabase.from('reports').select('*').eq('id', lead.latest_report_id).single()
    : { data: null }

  const { data: outreachLogs } = await supabase
    .from('outreach_logs')
    .select('*')
    .eq('business_id', lead.id)
    .order('sent_at', { ascending: false })

  const { data: socials } = await supabase
    .from('business_socials')
    .select('network, url, username, source, verified')
    .eq('business_id', lead.id)
    .order('network')

  const { data: emails } = await supabase
    .from('business_emails')
    .select('email, source, found_at_step, is_primary, verified')
    .eq('business_id', lead.id)
    .order('is_primary', { ascending: false })

  const { data: phones } = await supabase
    .from('business_phones')
    .select('phone, type, source, found_at_step, is_primary, verified')
    .eq('business_id', lead.id)
    .order('is_primary', { ascending: false })

  const { data: businessData } = await supabase
    .from('business_data')
    .select('module, key, value, value_type, source, found_at_step, updated_at')
    .eq('business_id', lead.id)
    .order('module')
    .order('key')

  const b = lead as Business
  const r = report as Report | null
  const reportesUrl = process.env.NEXT_PUBLIC_REPORTES_URL ?? 'https://reportes.innovando.cl'

  return (
    <div className="flex flex-col gap-5">
      <Link href="/leads" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'self-start -ml-2')}>
        <ArrowLeft className="h-4 w-4 mr-1" />Leads
      </Link>

      {/* Hero + mapa */}
      <div className={cn('grid gap-5', b.latitude != null && b.longitude != null ? 'md:grid-cols-[1fr_320px]' : '')}>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={statusVariant[b.status] ?? 'secondary'}>
                {statusLabels[b.status] ?? b.status}
              </Badge>
              {b.needs_review && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">Revisar</Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{b.name}</h1>

            <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
              {b.category && <span>{b.category}</span>}
              {b.category && b.city && <span>·</span>}
              {b.city && (
                <span className="flex items-center gap-0.5">
                  <MapPin className="h-3.5 w-3.5" />{b.city}, {b.country}
                </span>
              )}
            </div>

            {b.rating != null && (
              <div className="flex items-center gap-1.5 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">{b.rating}</span>
                <span className="text-sm text-gray-400">({b.num_reviews} reseñas)</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <a href={`${reportesUrl}/${b.slug}`} target="_blank" rel="noopener noreferrer"
                className={cn(buttonVariants({ size: 'sm' }))}>
                Ver reporte <ExternalLink className="ml-1.5 h-3 w-3" />
              </a>
              {b.google_maps_url && (
                <a href={b.google_maps_url} target="_blank" rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}>
                  <MapPin className="h-3.5 w-3.5 mr-1" />Google Maps
                </a>
              )}
              {b.website && (
                <a href={b.website} target="_blank" rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}>
                  <Globe className="h-3.5 w-3.5 mr-1" />Sitio web
                </a>
              )}
              {b.phone && (
                <a href={`tel:${b.phone}`}
                  className={cn(buttonVariants({ size: 'sm', variant: 'ghost' }), 'text-gray-600')}>
                  <Phone className="h-3.5 w-3.5 mr-1" />{b.phone}
                </a>
              )}
            </div>
          </div>

          <ScoreRing score={b.score_total} />
        </div>

        {/* Score bars — 3 columns */}
        <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-x-10 gap-y-3">
          {(['p2a', 'p2b', 'p2c', 'p2d', 'p2e', 'p2f'] as const).map(mod => (
            <ScoreBar
              key={mod}
              label={moduloLabels[mod]}
              score={b[`score_${mod}` as keyof Business] as number}
              max={moduloMax[mod]}
            />
          ))}
        </div>

      </div>

      {/* Map — derecha en md+ */}
      {b.latitude != null && b.longitude != null && (
        <MapaUbicacion lat={b.latitude} lng={b.longitude} name={b.name} />
      )}
      </div>{/* /grid hero+mapa */}

      {/* Datos enriquecidos */}
      <DatosEnriquecidos
        socials={socials ?? []}
        emails={emails ?? []}
        phones={phones ?? []}
        businessData={businessData ?? []}
      />

      {/* Two-column: contact left, outreach right */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <FormContacto lead={b} />
        </div>

        <div className="col-span-1">
          {outreachLogs && outreachLogs.length > 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-3 h-full">
              <h2 className="font-semibold text-gray-900">Outreach</h2>
              <div className="flex flex-col">
                {outreachLogs.map((log: { id: string; type: string; status: string; sent_at: string }, i: number) => (
                  <div key={log.id} className={cn(
                    'flex items-start justify-between py-2.5 text-sm gap-2',
                    i < outreachLogs.length - 1 && 'border-b border-gray-50'
                  )}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn('w-2 h-2 rounded-full shrink-0 mt-0.5',
                        log.status === 'replied' ? 'bg-green-500' :
                        log.status === 'opened' ? 'bg-blue-400' :
                        log.status === 'bounced' ? 'bg-red-400' : 'bg-gray-300'
                      )} />
                      <span className="text-gray-700 capitalize truncate">{log.type.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge variant={log.status === 'replied' ? 'default' : 'secondary'} className="text-xs">
                        {log.status}
                      </Badge>
                      <span className="text-gray-400 text-xs tabular-nums">
                        {new Date(log.sent_at).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-6 flex items-center justify-center h-full">
              <p className="text-sm text-gray-400">Sin contactos registrados</p>
            </div>
          )}
        </div>
      </div>

      {/* Notes — full width */}
      {r && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900">Notas del reporte</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <EditorNotas reportId={r.id} modulo="general" nota={r.general_note} label="Nota general" />
            </div>
            {(['p2a', 'p2b', 'p2c', 'p2d', 'p2e', 'p2f'] as const).map(mod => {
              const moduloData = r[`modulo_${mod}` as keyof Report] as { nota?: string } | null
              return (
                <EditorNotas
                  key={mod}
                  reportId={r.id}
                  modulo={mod}
                  nota={moduloData?.nota ?? null}
                  label={`${mod.toUpperCase()} · ${moduloLabels[mod]}`}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
