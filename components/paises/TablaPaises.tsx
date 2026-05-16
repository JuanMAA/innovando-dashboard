'use client'

import { useTransition, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Loader2, Check } from 'lucide-react'
import { updateCountry } from '@/app/(dashboard)/paises/actions'
import type { Country, PaymentMethod } from '@/types'

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  paypal:      'PayPal',
  mercadopago: 'MercadoPago',
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function CountryRow({ country }: { country: Country }) {
  const [pending, startTransition] = useTransition()
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [notes, setNotes] = useState(country.notes ?? '')

  function patch(p: Parameters<typeof updateCountry>[1]) {
    startTransition(async () => {
      const res = await updateCountry(country.code, p)
      if (res.ok) {
        setSavedAt(Date.now())
        setTimeout(() => setSavedAt(null), 2000)
      }
    })
  }

  const hasPm = (m: PaymentMethod) => country.payment_methods.includes(m)

  function togglePm(m: PaymentMethod, on: boolean) {
    const next = on
      ? [...new Set([...country.payment_methods, m])]
      : country.payment_methods.filter((x) => x !== m)
    patch({ payment_methods: next })
  }

  return (
    <TableRow className="hover:bg-gray-50/50">
      <TableCell className="pl-5">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">{country.flag_emoji ?? '🏳️'}</span>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">{country.name}</p>
            <p className="text-xs text-gray-400 font-mono leading-tight">{country.code} · {country.currency}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <button
          type="button"
          onClick={() => patch({ enabled: !country.enabled })}
          disabled={pending}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            country.enabled ? 'bg-emerald-500' : 'bg-gray-300'
          } disabled:opacity-50`}
          aria-pressed={country.enabled}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              country.enabled ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className={`ml-2 text-xs font-medium ${country.enabled ? 'text-emerald-700' : 'text-gray-400'}`}>
          {country.enabled ? 'Habilitado' : 'Deshabilitado'}
        </span>
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-1.5">
          {(['paypal', 'mercadopago'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => togglePm(m, !hasPm(m))}
              disabled={pending}
              className={`inline-flex items-center gap-2 text-xs w-fit transition-colors ${
                hasPm(m) ? 'font-semibold text-gray-900' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span
                className={`flex h-3.5 w-3.5 items-center justify-center rounded border ${
                  hasPm(m) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
                }`}
              >
                {hasPm(m) && <Check className="w-2.5 h-2.5 text-white" />}
              </span>
              {PAYMENT_LABELS[m]}
            </button>
          ))}
        </div>
      </TableCell>

      <TableCell className="text-xs text-gray-500">{fmtDate(country.launched_at)}</TableCell>

      <TableCell>
        <Input
          value={notes}
          placeholder="Notas internas…"
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => { if ((notes ?? '') !== (country.notes ?? '')) patch({ notes: notes || null }) }}
          className="h-8 text-xs"
        />
      </TableCell>

      <TableCell className="pr-5 text-right">
        <span className="inline-flex items-center justify-end w-6 h-6">
          {pending && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />}
          {savedAt && !pending && <Check className="w-3.5 h-3.5 text-emerald-500" />}
        </span>
      </TableCell>
    </TableRow>
  )
}

export default function TablaPaises({ countries }: { countries: Country[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="pl-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">País</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Métodos de Pago</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lanzado</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notas</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {countries.map((c) => <CountryRow key={c.code} country={c} />)}
        </TableBody>
      </Table>
    </div>
  )
}
