'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'

interface EditorNotasProps {
  reportId: string
  modulo: string
  nota: string | null
  label: string
}

export default function EditorNotas({ reportId, modulo, nota, label }: EditorNotasProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(nota ?? '')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSave() {
    setLoading(true)
    const field = modulo === 'general' ? 'general_note' : `modulo_${modulo}`
    const editedField = modulo === 'general' ? 'general_note_edited' : null

    if (modulo === 'general') {
      await supabase.from('reports').update({
        general_note: value,
        general_note_edited: true,
      }).eq('id', reportId)
    } else {
      const { data } = await supabase
        .from('reports')
        .select(field)
        .eq('id', reportId)
        .single()

      if (data) {
        const current = ((data as unknown) as Record<string, unknown>)[field] as Record<string, unknown> ?? {}
        await supabase.from('reports').update({
          [field]: { ...current, nota: value, nota_editada: true },
        }).eq('id', reportId)
      }
    }

    setLoading(false)
    setEditing(false)
    router.refresh()
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
        {!editing && (
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Editar</Button>
        )}
      </div>

      {editing ? (
        <>
          <Textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            rows={4}
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setValue(nota ?? '') }}>
              Cancelar
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{value || <span className="text-gray-400 italic">Sin nota</span>}</p>
      )}
    </div>
  )
}
