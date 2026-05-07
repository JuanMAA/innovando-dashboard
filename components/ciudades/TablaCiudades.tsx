'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/lib/supabase/client'
import type { City, CityStatus } from '@/types'
import { useRouter } from 'next/navigation'

const statusLabel: Record<CityStatus, string> = {
  pending: 'Pendiente',
  active: 'Activa',
  completed: 'Completada',
  paused: 'Pausada',
}

const statusVariant: Record<CityStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  active: 'default',
  completed: 'outline',
  paused: 'destructive',
}

function formatDate(date: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function TablaCiudades({ cities }: { cities: City[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  async function togglePausa(city: City) {
    setLoading(city.id)
    const newStatus: CityStatus = city.status === 'paused' ? 'active' : 'paused'
    await supabase.from('cities').update({ status: newStatus }).eq('id', city.id)
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ciudad</TableHead>
            <TableHead>País</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Leads</TableHead>
            <TableHead className="text-right">Con email</TableHead>
            <TableHead className="text-right">Con WSP</TableHead>
            <TableHead className="text-right">Contactados</TableHead>
            <TableHead>Última corrida</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {cities.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-sm text-gray-500 py-8">
                No hay ciudades registradas.
              </TableCell>
            </TableRow>
          )}
          {cities.map(city => (
            <TableRow key={city.id}>
              <TableCell className="font-medium">
                <Link href={`/leads?ciudad=${encodeURIComponent(city.name)}`} className="hover:underline">
                  {city.name}
                </Link>
              </TableCell>
              <TableCell className="text-gray-600">{city.country}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[city.status]}>{statusLabel[city.status]}</Badge>
              </TableCell>
              <TableCell className="text-right">{city.total_leads || '—'}</TableCell>
              <TableCell className="text-right">{city.leads_with_email || '—'}</TableCell>
              <TableCell className="text-right">{city.leads_with_whatsapp || '—'}</TableCell>
              <TableCell className="text-right">{city.leads_contacted || '—'}</TableCell>
              <TableCell className="text-sm text-gray-500">{formatDate(city.last_run_at)}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => togglePausa(city)}
                  disabled={loading === city.id}
                >
                  {city.status === 'paused' ? 'Reactivar' : 'Pausar'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
