'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const estadoOptions = [
  { value: 'all',       label: 'Todos los estados' },
  { value: 'new',       label: 'Nuevo'       },
  { value: 'contacted', label: 'Contactado'  },
  { value: 'qualified', label: 'Calificado'  },
  { value: 'converted', label: 'Convertido'  },
  { value: 'discarded', label: 'Descartado'  },
  { value: 'spam',      label: 'Spam'        },
]

const SECCIONES = [
  { value: 'all',          label: 'Todas las secciones' },
  { value: 'turismo',      label: 'Turismo'      },
  { value: 'desarrollo',   label: 'Desarrollo'   },
  { value: 'huellaDigital',label: 'Huella Digital'},
  { value: 'finanzas',     label: 'Finanzas'     },
]

const IDIOMAS = [
  { value: 'all', label: 'Todos los idiomas' },
  { value: 'es',  label: 'Español' },
  { value: 'en',  label: 'English' },
  { value: 'pt',  label: 'Português' },
  { value: 'fr',  label: 'Français' },
]

export default function FiltrosSolicitudes() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const set = useCallback((key: string, value: string | null | undefined) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    if (!value || value === 'all') params.delete(key)
    else params.set(key, value)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Input
        defaultValue={searchParams?.get('q') ?? ''}
        placeholder="Buscar nombre / email…"
        className="w-60"
        onChange={(e) => set('q', e.target.value)}
      />

      <Select
        value={searchParams?.get('estado') ?? 'all'}
        onValueChange={(v) => set('estado', v)}
      >
        <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
        <SelectContent>
          {estadoOptions.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams?.get('seccion') ?? 'all'}
        onValueChange={(v) => set('seccion', v)}
      >
        <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
        <SelectContent>
          {SECCIONES.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams?.get('locale') ?? 'all'}
        onValueChange={(v) => set('locale', v)}
      >
        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
        <SelectContent>
          {IDIOMAS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
