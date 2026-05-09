import { createAdminClient } from '@/lib/supabase/admin'
import { Activity } from 'lucide-react'
import ApiUsagePanel from '@/components/apis/ApiUsagePanel'

export const revalidate = 120

// ── Límites y metadatos de cada API ──────────────────────────
const API_CONFIG: Record<string, {
  nombre: string
  emoji: string
  limiteDiario: number | null
  limiteMensual: number | null
  costoPorUso: number
  creditoFree: number | null
  unidad: string
}> = {
  google_cse: {
    nombre:        'Google Custom Search',
    emoji:         '🔍',
    limiteDiario:  100,
    limiteMensual: null,
    costoPorUso:   0.005,
    creditoFree:   null,
    unidad:        'búsquedas',
  },
  brave: {
    nombre:        'Brave Search',
    emoji:         '🦁',
    limiteDiario:  null,
    limiteMensual: 2000,
    costoPorUso:   0,
    creditoFree:   null,
    unidad:        'búsquedas',
  },
  google_places: {
    nombre:        'Google Places',
    emoji:         '🗺️',
    limiteDiario:  null,
    limiteMensual: null,
    costoPorUso:   0.017,
    creditoFree:   200,
    unidad:        'búsquedas',
  },
  pagespeed: {
    nombre:        'PageSpeed Insights',
    emoji:         '🔦',
    limiteDiario:  25000,
    limiteMensual: null,
    costoPorUso:   0,
    creditoFree:   null,
    unidad:        'análisis',
  },
  sendgrid: {
    nombre:        'SendGrid',
    emoji:         '📧',
    limiteDiario:  100,
    limiteMensual: null,
    costoPorUso:   0,
    creditoFree:   null,
    unidad:        'emails',
  },
}

// ── Helpers ───────────────────────────────────────────────────
function getMesActual() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function getHoy() {
  return new Date().toISOString().slice(0, 10)
}

export default async function ApisPage() {
  const supabase = createAdminClient()
  const hoy      = getHoy()
  const mes      = getMesActual()

  // Últimos 30 días de datos
  const hace30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const { data: rows } = await supabase
    .from('api_usage')
    .select('env, api, date, used, script')
    .gte('date', hace30)
    .order('date', { ascending: false })

  const registros = rows ?? []

  // Agrupar por API
  const apisPresentes = [...new Set(registros.map(r => r.api))]
  // Asegurar que siempre aparecen google_cse y brave aunque no tengan datos
  const apisAMostrar = [...new Set([...Object.keys(API_CONFIG), ...apisPresentes])]

  const apis = apisAMostrar.map(apiId => {
    const config = API_CONFIG[apiId] ?? {
      nombre: apiId, emoji: '📡',
      limiteDiario: null, limiteMensual: null,
      costoPorUso: 0, creditoFree: null, unidad: 'llamadas',
    }

    const rowsApi = registros.filter(r => r.api === apiId)

    // Uso hoy (prd + test sumados, o separados)
    const usadoHoyPrd  = rowsApi.filter(r => r.env === 'prd'  && r.date === hoy).reduce((s, r) => s + r.used, 0)
    const usadoHoyTest = rowsApi.filter(r => r.env === 'test' && r.date === hoy).reduce((s, r) => s + r.used, 0)
    const usadoHoy     = usadoHoyPrd + usadoHoyTest

    // Uso este mes
    const usadoMesPrd  = rowsApi.filter(r => r.env === 'prd'  && r.date.startsWith(mes)).reduce((s, r) => s + r.used, 0)
    const usadoMesTest = rowsApi.filter(r => r.env === 'test' && r.date.startsWith(mes)).reduce((s, r) => s + r.used, 0)
    const usadoMes     = usadoMesPrd + usadoMesTest

    // Últimos 7 días para sparkline
    const ultimos7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      const usado = rowsApi.filter(r => r.date === d).reduce((s, r) => s + r.used, 0)
      return { date: d, usado }
    }).reverse()

    // Último script que lo usó
    const ultimoScript = rowsApi[0]?.script ?? null

    // % del límite activo
    const limite  = config.limiteDiario ?? config.limiteMensual
    const usado   = config.limiteDiario ? usadoHoy : usadoMes
    const pct     = limite ? Math.min(100, Math.round(usado / limite * 100)) : null

    // Costo estimado del mes
    const costoMes = config.creditoFree
      ? Math.max(0, usadoMes * config.costoPorUso - config.creditoFree)
      : usadoMes * config.costoPorUso

    return {
      id: apiId,
      ...config,
      usadoHoy,
      usadoHoyPrd,
      usadoHoyTest,
      usadoMes,
      usadoMesPrd,
      usadoMesTest,
      ultimos7,
      ultimoScript,
      pct,
      limite,
      costoMes: Math.round(costoMes * 1000) / 1000,
    }
  })

  // Alerta si alguna API está al 80%+
  const enAlerta = apis.filter(a => a.pct !== null && a.pct >= 80)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">APIs externas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Cuota diaria y mensual · Hoy: {hoy}</p>
        </div>
        <Activity className="h-5 w-5 text-gray-400" />
      </div>

      {/* Alertas */}
      {enAlerta.length > 0 && (
        <div className="flex flex-col gap-2">
          {enAlerta.map(a => (
            <div key={a.id} className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
              a.pct! >= 95 ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
            }`}>
              <span>{a.pct! >= 95 ? '🔴' : '🟡'}</span>
              <p className={`text-sm ${a.pct! >= 95 ? 'text-red-700' : 'text-yellow-700'}`}>
                <strong>{a.nombre}</strong>: {a.pct}% del límite{' '}
                {a.limiteDiario ? 'diario' : 'mensual'} usado
                {a.pct! >= 95 ? ' — sin cuota disponible' : ''}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Grid de cards */}
      <ApiUsagePanel apis={apis} />
    </div>
  )
}
