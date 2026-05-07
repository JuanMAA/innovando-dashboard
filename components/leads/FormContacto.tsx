'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import type { Business } from '@/types'

const fuenteOptions = ['web', 'instagram', 'facebook', 'manual']

export default function FormContacto({ lead }: { lead: Business }) {
  const router = useRouter()
  const [email, setEmail] = useState(lead.email ?? '')
  const [emailFuente, setEmailFuente] = useState(lead.email_source ?? 'manual')
  const [whatsapp, setWhatsapp] = useState(lead.whatsapp ?? '')
  const [whatsappFuente, setWhatsappFuente] = useState(lead.whatsapp_source ?? 'manual')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const updates: Record<string, unknown> = {
      email: email || null,
      email_source: email ? emailFuente : null,
      whatsapp: whatsapp || null,
      whatsapp_source: whatsapp ? whatsappFuente : null,
      needs_review: !email && !whatsapp,
    }

    await supabase.from('businesses').update(updates).eq('id', lead.id)

    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <form onSubmit={handleSave} className="rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-4">
      <h2 className="font-semibold text-gray-900">Datos de contacto</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Email</Label>
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="contacto@negocio.cl"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Fuente email</Label>
          <Select value={emailFuente} onValueChange={v => setEmailFuente(v ?? 'manual')}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {fuenteOptions.map(f => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label>WhatsApp</Label>
          <Input
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
            placeholder="+56 9 1234 5678"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Fuente WhatsApp</Label>
          <Select value={whatsappFuente} onValueChange={v => setWhatsappFuente(v ?? 'manual')}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {fuenteOptions.map(f => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {lead.phone && (
        <p className="text-sm text-gray-500">
          Teléfono Google Maps: <span className="font-mono">{lead.phone}</span>
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
        {saved && <span className="text-sm text-green-600">✓ Guardado</span>}
      </div>
    </form>
  )
}
