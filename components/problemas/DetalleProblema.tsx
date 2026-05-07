'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import type { IssueReport, IssueStatus } from '@/types'
import { ExternalLink } from 'lucide-react'

const tipoLabel: Record<string, string> = {
  wrong_profile: 'Perfil equivocado',
  incorrect_link: 'Link incorrecto',
  outdated_info: 'Info desactualizada',
}

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

export default function DetalleProblema({ issue }: { issue: IssueReport }) {
  const router = useRouter()
  const [nota, setNota] = useState(issue.internal_note ?? '')
  const [loading, setLoading] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()
  const reportesUrl = process.env.NEXT_PUBLIC_REPORTES_URL ?? 'https://reportes.innovando.cl'

  async function setStatus(status: IssueStatus, action_taken?: string) {
    setLoading(status)
    await supabase.from('issue_reports').update({
      status,
      action_taken: action_taken ?? null,
      internal_note: nota || null,
      resolved_at: ['resolved', 'ignored'].includes(status) ? new Date().toISOString() : null,
    }).eq('id', issue.id)

    if (issue.businesses?.slug) {
      await supabase.from('businesses').update({ has_reported_issue: false }).eq('slug', issue.businesses.slug)
    }

    setLoading(null)
    router.push('/problemas')
    router.refresh()
  }

  async function saveNota() {
    setLoading('nota')
    await supabase.from('issue_reports').update({ internal_note: nota || null }).eq('id', issue.id)
    setLoading(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{issue.businesses?.name ?? 'Negocio'}</h1>
            <p className="text-sm text-gray-500">{issue.businesses?.city}</p>
          </div>
          <Badge variant={statusVariant[issue.status]}>{statusLabel[issue.status]}</Badge>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <p><span className="text-gray-500">Tipo:</span> <strong>{tipoLabel[issue.type] ?? issue.type}</strong></p>
          {issue.detalle && (
            <p><span className="text-gray-500">Detalle:</span> {issue.detalle}</p>
          )}
          <p><span className="text-gray-500">Reportado:</span> {new Date(issue.reported_at).toLocaleString('es-CL')}</p>
        </div>

        <div className="flex gap-3 flex-wrap pt-2 border-t border-gray-100">
          {issue.businesses?.slug && (
            <a
              href={`${reportesUrl}/${issue.businesses.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
            >
              Ver reporte <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
          {issue.businesses?.slug && (
            <Link href={`/leads/${issue.businesses.slug}`} className={cn(buttonVariants({ size: 'sm', variant: 'ghost' }))}>
              Ver lead →
            </Link>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-3">
        <h2 className="font-semibold text-gray-900">Nota interna</h2>
        <Textarea
          value={nota}
          onChange={e => setNota(e.target.value)}
          placeholder="Agregar nota sobre este problema..."
          rows={3}
        />
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={saveNota} disabled={loading === 'nota'}>
            {loading === 'nota' ? 'Guardando...' : 'Guardar nota'}
          </Button>
          {saved && <span className="text-sm text-green-600">✓ Guardado</span>}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-3">
        <h2 className="font-semibold text-gray-900">Acciones</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            onClick={() => setStatus('resolved', 're_analisis_completo')}
            disabled={!!loading}
          >
            Marcar resuelto
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setStatus('reviewed')}
            disabled={!!loading}
          >
            Marcar revisado
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setStatus('ignored', 'ignorado')}
            disabled={!!loading}
          >
            Ignorar
          </Button>
        </div>
      </div>
    </div>
  )
}
