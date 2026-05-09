import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Business } from '@/types'

// ── Status config ────────────────────────────────────────────
const STATUS: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  new:                { label: 'Nuevo',           dot: 'bg-sky-400',     bg: 'bg-sky-50',     text: 'text-sky-700'     },
  analyzed:           { label: 'Analizado',        dot: 'bg-violet-400',  bg: 'bg-violet-50',  text: 'text-violet-700'  },
  contacted:          { label: 'Contactado',       dot: 'bg-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-700'    },
  follow_up_1:        { label: 'Seguimiento 1',    dot: 'bg-amber-400',   bg: 'bg-amber-50',   text: 'text-amber-700'   },
  follow_up_2:        { label: 'Seguimiento 2',    dot: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-700'   },
  follow_up_3:        { label: 'Seguimiento 3',    dot: 'bg-orange-500',  bg: 'bg-orange-50',  text: 'text-orange-700'  },
  report_paid:        { label: 'Reporte pagado',   dot: 'bg-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  huella_paid:        { label: 'Huella pagada',    dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  tutorial_paid:      { label: 'Tutorial pagado',  dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  site_active:        { label: 'Sitio activo',     dot: 'bg-green-500',   bg: 'bg-green-50',   text: 'text-green-700'   },
  renewal_pending:    { label: 'Renovación',       dot: 'bg-yellow-500',  bg: 'bg-yellow-50',  text: 'text-yellow-700'  },
  renewed:            { label: 'Renovado',         dot: 'bg-green-600',   bg: 'bg-green-50',   text: 'text-green-800'   },
  lost:               { label: 'Perdido',          dot: 'bg-red-400',     bg: 'bg-red-50',     text: 'text-red-700'     },
  closed_permanently: { label: 'Cerrado',          dot: 'bg-gray-400',    bg: 'bg-gray-100',   text: 'text-gray-600'    },
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, dot: 'bg-gray-300', bg: 'bg-gray-50', text: 'text-gray-600' }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  )
}

// ── Score visual ─────────────────────────────────────────────
function ScoreCell({ score }: { score: number }) {
  const color =
    score >= 70 ? 'text-emerald-600' :
    score >= 45 ? 'text-amber-600'   :
                  'text-red-500'
  const barColor =
    score >= 70 ? 'bg-emerald-400' :
    score >= 45 ? 'bg-amber-400'   :
                  'bg-red-400'

  return (
    <div className="flex items-center gap-2 justify-end">
      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`font-semibold text-sm tabular-nums w-10 text-right ${color}`}>{score}</span>
    </div>
  )
}

// ── Contacto ─────────────────────────────────────────────────
function ContactIcons({ email, whatsapp }: { email: string | null; whatsapp: string | null }) {
  return (
    <div className="flex items-center gap-2">
      <span title={email ?? 'Sin email'} className={`text-base leading-none ${email ? 'text-emerald-500' : 'text-gray-200'}`}>✉</span>
      <span title={whatsapp ?? 'Sin WhatsApp'} className={`text-base leading-none ${whatsapp ? 'text-emerald-500' : 'text-gray-200'}`}>📱</span>
    </div>
  )
}

// ── Tabla ────────────────────────────────────────────────────
export default function TablaLeads({ leads }: { leads: Business[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="pl-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Negocio</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ciudad</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoría</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Score</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contacto</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-sm text-gray-400 py-14">
                No hay leads que coincidan con los filtros.
              </TableCell>
            </TableRow>
          )}
          {leads.map(lead => (
            <TableRow
              key={lead.id}
              className="group hover:bg-blue-50/40 transition-colors border-b border-gray-100 last:border-0"
            >
              {/* Nombre */}
              <TableCell className="pl-5 py-3">
                <div className="font-medium text-gray-900 max-w-[200px] truncate">{lead.name}</div>
                {lead.needs_review && (
                  <span className="text-[11px] text-amber-500 font-medium">⚠ Requiere revisión</span>
                )}
              </TableCell>

              {/* Ciudad */}
              <TableCell className="py-3">
                <span className="text-sm text-gray-600">{lead.city ?? '—'}</span>
              </TableCell>

              {/* Categoría */}
              <TableCell className="py-3">
                <span className="text-xs text-gray-500 max-w-[140px] truncate block">
                  {lead.category ?? '—'}
                </span>
              </TableCell>

              {/* Score */}
              <TableCell className="py-3 pr-4">
                <ScoreCell score={lead.score_total} />
              </TableCell>

              {/* Contacto */}
              <TableCell className="py-3">
                <ContactIcons email={lead.email} whatsapp={lead.whatsapp} />
              </TableCell>

              {/* Estado */}
              <TableCell className="py-3">
                <StatusBadge status={lead.status} />
              </TableCell>

              {/* Acción */}
              <TableCell className="py-3 pr-4">
                <Link
                  href={`/leads/${lead.slug}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                >
                  Ver →
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
