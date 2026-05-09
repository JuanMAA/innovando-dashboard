'use client'

import { useState } from 'react'

// ── Tipos ────────────────────────────────────────────────────
interface ApiData {
  id: string
  nombre: string
  emoji: string
  limiteDiario: number | null
  limiteMensual: number | null
  costoPorUso: number
  creditoFree: number | null
  unidad: string
  usadoHoy: number
  usadoHoyPrd: number
  usadoHoyTest: number
  usadoMes: number
  usadoMesPrd: number
  usadoMesTest: number
  ultimos7: { date: string; usado: number }[]
  ultimoScript: string | null
  pct: number | null
  limite: number | null
  costoMes: number
}

interface Props {
  apis: ApiData[]
}

// ── Helpers ──────────────────────────────────────────────────
function colorPct(pct: number) {
  if (pct >= 90) return { bar: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200' }
  if (pct >= 70) return { bar: 'bg-yellow-400', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' }
  return           { bar: 'bg-emerald-500',  text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' }
}

function Sparkline({ data }: { data: { date: string; usado: number }[] }) {
  const max = Math.max(...data.map(d => d.usado), 1)
  const w = 80
  const h = 28
  const gap = w / (data.length - 1)

  const points = data.map((d, i) => {
    const x = i * gap
    const y = h - (d.usado / max) * (h - 4)
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="text-blue-400"
      />
      {/* último punto destacado */}
      {data.length > 0 && (() => {
        const last = data[data.length - 1]
        const x = (data.length - 1) * gap
        const y = h - (last.usado / max) * (h - 4)
        return <circle cx={x} cy={y} r="2.5" fill="currentColor" className="text-blue-500" />
      })()}
    </svg>
  )
}

function EnvBadge({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round(value / total * 100) : 0
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${label === 'prd' ? 'bg-blue-500' : 'bg-gray-400'}`} />
      <span className="font-medium text-gray-700">{label}</span>
      <span>{value}</span>
      {total > 0 && <span className="text-gray-400">({pct}%)</span>}
    </span>
  )
}

// ── Tarjeta individual ───────────────────────────────────────
function ApiCard({ api }: { api: ApiData }) {
  const [showTest, setShowTest] = useState(false)

  const tieneLimit  = api.pct !== null
  const colors      = tieneLimit ? colorPct(api.pct!) : null
  const esDiario    = api.limiteDiario !== null
  const usadoActivo = esDiario ? api.usadoHoy : api.usadoMes
  const prdActivo   = esDiario ? api.usadoHoyPrd : api.usadoMesPrd
  const testActivo  = esDiario ? api.usadoHoyTest : api.usadoMesTest

  const todosEmpty  = api.usadoHoy === 0 && api.usadoMes === 0

  return (
    <div className={`rounded-xl border bg-white shadow-sm p-5 flex flex-col gap-4 ${
      colors ? colors.border : 'border-gray-200'
    }`}>
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl leading-none">{api.emoji}</span>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{api.nombre}</p>
            {api.ultimoScript && (
              <p className="text-xs text-gray-400 truncate mt-0.5">Script: {api.ultimoScript}</p>
            )}
          </div>
        </div>
        {/* Sparkline últimos 7 días */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <Sparkline data={api.ultimos7} />
          <span className="text-[10px] text-gray-400">7 días</span>
        </div>
      </div>

      {/* Barra de progreso */}
      {tieneLimit ? (
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-xs text-gray-500">
              {esDiario ? 'Hoy' : 'Este mes'}: <strong className="text-gray-800">{usadoActivo}</strong>
              <span className="text-gray-400"> / {api.limite} {api.unidad}</span>
            </span>
            <span className={`text-xs font-semibold ${colors!.text}`}>{api.pct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${colors!.bar}`}
              style={{ width: `${api.pct}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-400 italic">Sin límite configurado</div>
      )}

      {/* Stats hoy / mes */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <div>
          <p className="text-gray-400 uppercase tracking-wide text-[10px] font-medium mb-0.5">Hoy</p>
          <p className="text-gray-800 font-semibold">{api.usadoHoy} <span className="font-normal text-gray-500">{api.unidad}</span></p>
        </div>
        <div>
          <p className="text-gray-400 uppercase tracking-wide text-[10px] font-medium mb-0.5">Este mes</p>
          <p className="text-gray-800 font-semibold">{api.usadoMes} <span className="font-normal text-gray-500">{api.unidad}</span></p>
        </div>
      </div>

      {/* Desglose prd / test */}
      {!todosEmpty && (
        <div>
          <button
            onClick={() => setShowTest(v => !v)}
            className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors mb-1.5"
          >
            {showTest ? '▴' : '▾'} Desglose prd / test
          </button>
          {showTest && (
            <div className="flex gap-3 flex-wrap">
              <EnvBadge label="prd"  value={prdActivo}  total={usadoActivo} />
              <EnvBadge label="test" value={testActivo} total={usadoActivo} />
            </div>
          )}
        </div>
      )}

      {/* Costo estimado */}
      {api.costoPorUso > 0 && (
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">Costo est. este mes</span>
          <span className={`text-xs font-semibold ${api.costoMes > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
            {api.costoMes > 0 ? `$${api.costoMes.toFixed(3)} USD` : 'dentro del crédito free'}
          </span>
        </div>
      )}
      {api.creditoFree && (
        <div className="text-[10px] text-gray-400">
          Crédito free: ${api.creditoFree} USD/mes
        </div>
      )}
    </div>
  )
}

// ── Panel principal ──────────────────────────────────────────
export default function ApiUsagePanel({ apis }: Props) {
  if (apis.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        Sin datos de uso registrados aún.
      </div>
    )
  }

  // Separar las que tienen límite (más relevantes) de las sin límite
  const conLimite = apis.filter(a => a.pct !== null)
  const sinLimite = apis.filter(a => a.pct === null)

  return (
    <div className="flex flex-col gap-6">
      {conLimite.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Con límite de cuota</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {conLimite.map(api => <ApiCard key={api.id} api={api} />)}
          </div>
        </div>
      )}
      {sinLimite.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Sin límite estricto</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sinLimite.map(api => <ApiCard key={api.id} api={api} />)}
          </div>
        </div>
      )}
    </div>
  )
}
