import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, Phone, AtSign, ThumbsUp, Globe, MapPin, Calendar } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Lead } from '@/types'
import EditorSolicitud from '@/components/solicitudes/EditorSolicitud'
import { LEAD_STATUS } from '@/components/solicitudes/TablaSolicitudes'
import { listDashboardUsers } from '@/app/(dashboard)/solicitudes/actions'

export const revalidate = 0

interface PageProps {
  params: Promise<{ id: string }>
}

const SERVICE_LABELS: Record<string, string> = {
  'desarrollo-web':       'Desarrollo Web',
  'web-development':      'Desarrollo Web',
  'desenvolvimento-web':  'Desarrollo Web',
  'developpement-web':    'Desarrollo Web',
  'auditoria-sitio-web':  'Auditoría de Sitio Web',
  'website-audit':        'Auditoría de Sitio Web',
  'auditoria-site':       'Auditoría de Sitio Web',
  'audit-site-web':       'Auditoría de Sitio Web',
  'mantencion-sitio-web': 'Mantención de Sitio Web',
  'website-maintenance':  'Mantención de Sitio Web',
  'manutencao-site':      'Mantención de Sitio Web',
  'maintenance-site-web': 'Mantención de Sitio Web',
  'gestion-reputacion':    'Gestión de Reputación',
  'reputation-management': 'Gestión de Reputación',
  'gestao-reputacao':      'Gestión de Reputación',
  'gestion-reputation':    'Gestión de Reputación',
  'huella-digital':       'Auditoría Huella Digital',
  'digital-footprint':    'Auditoría Huella Digital',
  'pegada-digital':       'Auditoría Huella Digital',
  'empreinte-numerique':  'Auditoría Huella Digital',
}

const BUSINESS_TYPES: Record<string, string> = {
  hotel:          'Hotel / Alojamiento',
  agencia_viajes: 'Agencia / Tour Operador',
  travel_agency:  'Agencia / Tour Operador',
  agencia_viagens:'Agencia / Tour Operador',
  agence_voyage:  'Agencia / Tour Operador',
  restaurante:    'Restaurante',
  restaurant:     'Restaurante',
  transporte:     'Transporte Turístico',
  transport:      'Transporte Turístico',
  actividad:      'Atracción / Actividad',
  activity:       'Atracción / Actividad',
  atividade:      'Atracción / Actividad',
  activite:       'Atracción / Actividad',
  otro:           'Otro',
  other:          'Otro',
  outro:          'Otro',
  autre:          'Otro',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString('es-CL', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function SolicitudDetallePage({ params }: PageProps) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .maybeSingle<Lead>()

  if (!lead) notFound()

  const users = await listDashboardUsers()

  const status = LEAD_STATUS[lead.status] ?? LEAD_STATUS.new

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Volver */}
      <Link
        href="/solicitudes"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Volver a solicitudes
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
          <div className="flex items-center gap-2 flex-wrap text-sm text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{fmt(lead.created_at)}</span>
            <span className="text-gray-300">·</span>
            <span className="capitalize">{lead.page_key ?? 'sin sección'}</span>
            {lead.locale && (
              <>
                <span className="text-gray-300">·</span>
                <span className="uppercase">{lead.locale}</span>
              </>
            )}
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.bg} ${status.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">

        {/* Columna izquierda */}
        <div className="flex flex-col gap-5">

          {/* Servicio + mensaje */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Servicio solicitado</p>
              <p className="text-lg font-semibold text-gray-900">
                {SERVICE_LABELS[lead.service_interest ?? ''] ?? lead.service_interest ?? '—'}
              </p>
              {lead.business_type && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Tipo de negocio: {BUSINESS_TYPES[lead.business_type] ?? lead.business_type}
                </p>
              )}
            </div>

            {lead.message && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Mensaje</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{lead.message}</p>
              </div>
            )}
          </div>

          {/* Contacto */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Contacto</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {lead.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">{lead.email}</a>
                </li>
              )}
              {lead.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">{lead.phone}</a>
                </li>
              )}
              {lead.instagram && (
                <li className="flex items-center gap-2.5">
                  <AtSign className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-700">{lead.instagram}</span>
                </li>
              )}
              {lead.facebook && (
                <li className="flex items-center gap-2.5">
                  <ThumbsUp className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-700">{lead.facebook}</span>
                </li>
              )}
              {lead.website_linkedin && (
                <li className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                  <a
                    href={lead.website_linkedin.startsWith('http') ? lead.website_linkedin : `https://${lead.website_linkedin}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    {lead.website_linkedin}
                  </a>
                </li>
              )}
              {!lead.email && !lead.phone && !lead.instagram && !lead.facebook && !lead.website_linkedin && (
                <li className="text-sm text-gray-400 italic">No dejó datos de contacto.</li>
              )}
            </ul>
          </div>

          {/* Atribución */}
          {(lead.utm_source || lead.utm_campaign || lead.referrer) && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Atribución</p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                {lead.utm_source && (<><dt className="text-gray-500">utm_source</dt><dd className="text-gray-800 font-mono truncate">{lead.utm_source}</dd></>)}
                {lead.utm_medium && (<><dt className="text-gray-500">utm_medium</dt><dd className="text-gray-800 font-mono truncate">{lead.utm_medium}</dd></>)}
                {lead.utm_campaign && (<><dt className="text-gray-500">utm_campaign</dt><dd className="text-gray-800 font-mono truncate">{lead.utm_campaign}</dd></>)}
                {lead.utm_term && (<><dt className="text-gray-500">utm_term</dt><dd className="text-gray-800 font-mono truncate">{lead.utm_term}</dd></>)}
                {lead.utm_content && (<><dt className="text-gray-500">utm_content</dt><dd className="text-gray-800 font-mono truncate">{lead.utm_content}</dd></>)}
                {lead.referrer && (
                  <>
                    <dt className="text-gray-500">referrer</dt>
                    <dd className="text-gray-800 font-mono truncate" title={lead.referrer}>{lead.referrer}</dd>
                  </>
                )}
                {lead.page_slug && (
                  <>
                    <dt className="text-gray-500">página</dt>
                    <dd className="text-gray-800 font-mono truncate" title={lead.page_slug}>{lead.page_slug}</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {/* Técnico */}
          {(lead.ip || lead.user_agent) && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Técnico</p>
              <dl className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 text-xs">
                {lead.ip && (
                  <>
                    <dt className="text-gray-500 inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> IP</dt>
                    <dd className="text-gray-800 font-mono">{lead.ip}</dd>
                  </>
                )}
                {lead.user_agent && (
                  <>
                    <dt className="text-gray-500">User-Agent</dt>
                    <dd className="text-gray-700 font-mono break-all">{lead.user_agent}</dd>
                  </>
                )}
              </dl>
            </div>
          )}
        </div>

        {/* Columna derecha — editor */}
        <div className="flex flex-col gap-4">
          <EditorSolicitud lead={lead} users={users} />

          {(lead.contacted_at || lead.converted_at) && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-xs">
              <p className="font-bold uppercase tracking-widest text-gray-500 mb-2">Historial</p>
              {lead.contacted_at && (
                <p className="text-gray-600">📞 Contactado: <span className="font-medium text-gray-900">{fmt(lead.contacted_at)}</span></p>
              )}
              {lead.converted_at && (
                <p className="text-gray-600 mt-1">✅ Convertido: <span className="font-medium text-gray-900">{fmt(lead.converted_at)}</span></p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
