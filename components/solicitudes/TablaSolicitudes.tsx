import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Lead, LeadStatus, DashboardUser } from '@/types'

/* ── Status ───────────────────────────────────────────────────── */
export const LEAD_STATUS: Record<LeadStatus, { label: string; dot: string; bg: string; text: string }> = {
  new:        { label: 'Nuevo',      dot: 'bg-sky-400',     bg: 'bg-sky-50',     text: 'text-sky-700'     },
  contacted:  { label: 'Contactado', dot: 'bg-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-700'    },
  qualified:  { label: 'Calificado', dot: 'bg-violet-500',  bg: 'bg-violet-50',  text: 'text-violet-700'  },
  converted:  { label: 'Convertido', dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  discarded:  { label: 'Descartado', dot: 'bg-gray-400',    bg: 'bg-gray-100',   text: 'text-gray-600'    },
  spam:       { label: 'Spam',       dot: 'bg-red-400',     bg: 'bg-red-50',     text: 'text-red-700'     },
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const s = LEAD_STATUS[status] ?? LEAD_STATUS.new
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  )
}

/* ── helpers ──────────────────────────────────────────────────── */
function fmtDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()
  const yest = new Date()
  yest.setDate(yest.getDate() - 1)
  const isYest = d.toDateString() === yest.toDateString()
  if (isToday) return `Hoy ${d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`
  if (isYest)  return `Ayer ${d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

const SERVICE_LABELS: Record<string, string> = {
  // turismo
  'desarrollo-web':       'Desarrollo Web',
  'web-development':      'Desarrollo Web',
  'desenvolvimento-web':  'Desarrollo Web',
  'developpement-web':    'Desarrollo Web',
  'auditoria-sitio-web':  'Auditoría Sitio',
  'website-audit':        'Auditoría Sitio',
  'auditoria-site':       'Auditoría Sitio',
  'audit-site-web':       'Auditoría Sitio',
  'mantencion-sitio-web': 'Mantención Sitio',
  'website-maintenance':  'Mantención Sitio',
  'manutencao-site':      'Mantención Sitio',
  'maintenance-site-web': 'Mantención Sitio',
  'gestion-reputacion':    'Gestión Reputación',
  'reputation-management': 'Gestión Reputación',
  'gestao-reputacao':      'Gestión Reputación',
  'gestion-reputation':    'Gestión Reputación',
  'huella-digital':       'Huella Digital',
  'digital-footprint':    'Huella Digital',
  'pegada-digital':       'Huella Digital',
  'empreinte-numerique':  'Huella Digital',
}

function serviceLabel(v: string | null): string {
  if (!v) return '—'
  return SERVICE_LABELS[v] ?? v
}

/* ── Tabla ────────────────────────────────────────────────────── */
export default function TablaSolicitudes({
  leads,
  users = [],
}: {
  leads: Lead[]
  users?: DashboardUser[]
}) {
  const usersById = new Map(users.map((u) => [u.id, u]))
  function asignadoLabel(id: string | null) {
    if (!id) return null
    const u = usersById.get(id)
    if (!u) return id.slice(0, 8)
    return (u.name?.trim() || u.email || id.slice(0, 8))
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">No hay solicitudes con esos filtros.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="pl-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Recibida</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contacto</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Servicio</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sección</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Idioma</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Asignado</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((l) => {
            const asignado = asignadoLabel(l.assigned_to)
            return (
            <TableRow key={l.id} className="hover:bg-gray-50">
              <TableCell className="pl-5 text-xs text-gray-500 whitespace-nowrap">{fmtDate(l.created_at)}</TableCell>
              <TableCell className="font-medium text-gray-900 max-w-[180px] truncate" title={l.name}>{l.name}</TableCell>
              <TableCell className="text-xs text-gray-600">
                <div className="flex flex-col">
                  {l.email && <span className="truncate" title={l.email}>{l.email}</span>}
                  {l.phone && <span className="text-gray-400">{l.phone}</span>}
                  {!l.email && !l.phone && <span className="text-gray-300">sin contacto</span>}
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-700">{serviceLabel(l.service_interest)}</TableCell>
              <TableCell className="text-xs text-gray-500 capitalize">{l.page_key ?? '—'}</TableCell>
              <TableCell className="text-xs text-gray-500 uppercase">{l.locale ?? '—'}</TableCell>
              <TableCell><StatusBadge status={l.status} /></TableCell>
              <TableCell className="text-xs">
                {asignado
                  ? <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 font-medium truncate max-w-[140px]" title={asignado}>{asignado}</span>
                  : <span className="text-gray-300">—</span>
                }
              </TableCell>
              <TableCell className="pr-5 text-right">
                <Link
                  href={`/solicitudes/${l.id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Ver →
                </Link>
              </TableCell>
            </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
