'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Plus } from 'lucide-react'

export default function FormAgregarCiudad() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', country: 'Chile' })
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('cities').insert({
      name: form.name.trim(),
      country: form.country.trim(),
      status: 'pending',
    })

    if (error) {
      setError(error.message.includes('unique') ? 'Esa ciudad ya existe.' : error.message)
      setLoading(false)
      return
    }

    setForm({ name: '', country: 'Chile' })
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="h-4 w-4 mr-1" />
        Agregar ciudad
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="city-name">Ciudad</Label>
        <Input
          id="city-name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Ej: Castro"
          required
          className="w-44"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="city-country">País</Label>
        <Input
          id="city-country"
          value={form.country}
          onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
          placeholder="Chile"
          required
          className="w-36"
        />
      </div>
      {error && <p className="text-sm text-red-600 self-center">{error}</p>}
      <Button type="submit" size="sm" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancelar</Button>
    </form>
  )
}
