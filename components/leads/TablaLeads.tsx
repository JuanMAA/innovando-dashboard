import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { Business } from '@/types'

const statusLabel: Record<string, string> = {
  new: 'Nuevo',
  analyzed: 'Analizado',
  contacted: 'Contactado',
  follow_up_1: 'Seguimiento 1',
  follow_up_2: 'Seguimiento 2',
  follow_up_3: 'Seguimiento 3',
  report_paid: 'Reporte pagado',
  huella_paid: 'Huella pagada',
  site_active: 'Sitio activo',
  lost: 'Perdido',
  closed_permanently: 'Cerrado',
}

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  new: 'secondary',
  analyzed: 'secondary',
  contacted: 'default',
  report_paid: 'default',
  site_active: 'default',
  lost: 'destructive',
  closed_permanently: 'destructive',
}

function ContactoBadge({ value, label }: { value: string | null; label: string }) {
  return value
    ? <span className="text-green-600 text-xs">✓ {label}</span>
    : <span className="text-red-500 text-xs">✗ {label}</span>
}

export default function TablaLeads({ leads }: { leads: Business[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Negocio</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-sm text-gray-500 py-10">
                No hay leads que coincidan con los filtros.
              </TableCell>
            </TableRow>
          )}
          {leads.map(lead => (
            <TableRow key={lead.id}>
              <TableCell>
                <div className="font-medium text-gray-900 max-w-xs truncate">{lead.name}</div>
                {lead.needs_review && (
                  <span className="text-xs text-amber-600">⚠ Requiere relleno</span>
                )}
              </TableCell>
              <TableCell className="text-gray-600 text-sm">{lead.city}</TableCell>
              <TableCell className="text-right font-mono text-sm">{lead.score_total}/100</TableCell>
              <TableCell><ContactoBadge value={lead.email} label="email" /></TableCell>
              <TableCell><ContactoBadge value={lead.whatsapp} label="WSP" /></TableCell>
              <TableCell>
                <Badge variant={statusVariant[lead.status] ?? 'outline'}>
                  {statusLabel[lead.status] ?? lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Link href={`/leads/${lead.slug}`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>Ver</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
