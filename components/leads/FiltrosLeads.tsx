'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const estadoOptions = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'new', label: 'Nuevo' },
  { value: 'analyzed', label: 'Analizado' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'report_paid', label: 'Reporte pagado' },
  { value: 'lost', label: 'Perdido' },
]

export default function FiltrosLeads({ ciudades }: { ciudades: string[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const set = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  const soloRelleno = searchParams.get('relleno') === '1'

  function toggleRelleno() {
    const params = new URLSearchParams(searchParams.toString())
    if (soloRelleno) {
      params.delete('relleno')
    } else {
      params.set('relleno', '1')
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Button
        size="sm"
        variant={soloRelleno ? 'default' : 'outline'}
        onClick={toggleRelleno}
      >
        {soloRelleno ? '✓ ' : ''}Solo requiere relleno
      </Button>

      <Select
        value={searchParams.get('ciudad') ?? 'all'}
        onValueChange={v => set('ciudad', v ?? 'all')}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Ciudad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las ciudades</SelectItem>
          {ciudades.map(c => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get('estado') ?? 'all'}
        onValueChange={v => set('estado', v ?? 'all')}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          {estadoOptions.map(o => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get('email') ?? 'all'}
        onValueChange={v => set('email', v ?? 'all')}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Email" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="yes">Con email</SelectItem>
          <SelectItem value="no">Sin email</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
