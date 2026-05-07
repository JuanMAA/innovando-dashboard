import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { IssueReport, IssueStatus, IssueType } from '@/types'

const statusLabel: Record<IssueStatus, string> = {
  pending: 'Pendiente',
  reviewed: 'Revisado',
  resolved: 'Resuelto',
  ignored: 'Ignorado',
}

const statusVariant: Record<IssueStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'destructive',
  reviewed: 'secondary',
  resolved: 'outline',
  ignored: 'secondary',
}

const tipoLabel: Record<IssueType, string> = {
  wrong_profile: 'Perfil equivocado',
  incorrect_link: 'Link incorrecto',
  outdated_info: 'Info desactualizada',
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 24) return `hace ${h}h`
  const d = Math.floor(h / 24)
  return `hace ${d}d`
}

export default function TablaProblemas({ issues }: { issues: IssueReport[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estado</TableHead>
            <TableHead>Negocio</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead>Hace</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm text-gray-500 py-10">
                No hay problemas reportados.
              </TableCell>
            </TableRow>
          )}
          {issues.map(issue => (
            <TableRow key={issue.id}>
              <TableCell>
                <Badge variant={statusVariant[issue.status]}>{statusLabel[issue.status]}</Badge>
              </TableCell>
              <TableCell className="font-medium">{issue.businesses?.name ?? '—'}</TableCell>
              <TableCell className="text-sm text-gray-600">{tipoLabel[issue.type] ?? issue.type}</TableCell>
              <TableCell className="text-sm text-gray-500">{issue.businesses?.city ?? '—'}</TableCell>
              <TableCell className="text-sm text-gray-400">{timeAgo(issue.reported_at)}</TableCell>
              <TableCell>
                <Link href={`/problemas/${issue.id}`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>Ver</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
