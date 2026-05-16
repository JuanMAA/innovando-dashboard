'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Loader2, Check, UserCog } from 'lucide-react'
import { updateLead } from '@/app/(dashboard)/solicitudes/actions'
import type { Lead, LeadStatus, DashboardUser } from '@/types'
import { LEAD_STATUS } from './TablaSolicitudes'

interface Props {
  lead:  Lead
  users: DashboardUser[]
}

const UNASSIGNED = '__unassigned__'

export default function EditorSolicitud({ lead, users }: Props) {
  const [status,     setStatus]     = useState<LeadStatus>(lead.status)
  const [note,       setNote]       = useState(lead.internal_note ?? '')
  const [assignedTo, setAssignedTo] = useState<string>(lead.assigned_to ?? UNASSIGNED)
  const [pending, startTransition] = useTransition()
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const dirty =
    status !== lead.status ||
    (note ?? '') !== (lead.internal_note ?? '') ||
    (assignedTo === UNASSIGNED ? null : assignedTo) !== lead.assigned_to

  function save() {
    startTransition(async () => {
      const res = await updateLead(lead.id, {
        status,
        internal_note: note.trim() === '' ? null : note,
        assigned_to:   assignedTo === UNASSIGNED ? null : assignedTo,
      })
      if (res.ok) {
        setSavedAt(Date.now())
        setTimeout(() => setSavedAt(null), 2500)
      }
    })
  }

  function userLabel(u: DashboardUser) {
    return u.name?.trim() ? `${u.name} · ${u.email ?? ''}` : (u.email ?? u.id.slice(0, 8))
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
          Gestión interna
        </h3>
        {savedAt && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <Check className="w-3.5 h-3.5" /> Guardado
          </span>
        )}
      </div>

      {/* Asignación */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-600 inline-flex items-center gap-1.5">
          <UserCog className="w-3.5 h-3.5 text-gray-400" /> Asignado a
        </label>
        <Select value={assignedTo} onValueChange={(v) => setAssignedTo(v ?? UNASSIGNED)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Sin asignar" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={UNASSIGNED}>Sin asignar</SelectItem>
            {users.map((u) => (
              <SelectItem key={u.id} value={u.id}>{userLabel(u)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Estado */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-600">Estado</label>
        <Select value={status} onValueChange={(v) => setStatus(v as LeadStatus)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.keys(LEAD_STATUS) as LeadStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{LEAD_STATUS[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nota */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-600">Nota interna</label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="Anotaciones internas, próximos pasos, etc."
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setStatus(lead.status)
            setNote(lead.internal_note ?? '')
            setAssignedTo(lead.assigned_to ?? UNASSIGNED)
          }}
          disabled={!dirty || pending}
        >
          Cancelar
        </Button>
        <Button size="sm" onClick={save} disabled={!dirty || pending}>
          {pending ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> Guardando…</> : 'Guardar'}
        </Button>
      </div>
    </div>
  )
}
