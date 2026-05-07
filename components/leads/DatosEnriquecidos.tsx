'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'

const NETWORK_ICONS: Record<string, string> = {
  instagram: '📸', facebook: '📘', tiktok: '🎵',
  youtube: '▶️', x: '🐦', twitter: '🐦',
  tripadvisor: '🦉', whatsapp: '💬', linktree: '🌳',
}

interface Social  { network: string; url: string; username: string | null; source: string; verified: boolean }
interface Email   { email: string; source: string; found_at_step: string; is_primary: boolean; verified: boolean }
interface Phone   { phone: string; type: string; source: string; found_at_step: string; is_primary: boolean; verified: boolean }
interface BizData { module: string; key: string; value: string; value_type: string; source: string; found_at_step: string; updated_at: string }

interface Props {
  socials:      Social[]
  emails:       Email[]
  phones:       Phone[]
  businessData: BizData[]
}

function EmptyRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-6 text-center text-sm text-gray-400">
        Sin datos
      </td>
    </tr>
  )
}

export default function DatosEnriquecidos({ socials, emails, phones, businessData }: Props) {
  const counts = {
    redes:  socials.length,
    emails: emails.length,
    phones: phones.length,
    data:   businessData.length,
  }

  function TabLabel({ label, count }: { label: string; count: number }) {
    return (
      <span className="flex items-center gap-1.5">
        {label}
        {count > 0 && (
          <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 leading-none">
            {count}
          </span>
        )}
      </span>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <Tabs defaultValue="redes">
        <div className="border-b border-gray-100 px-4 pt-4">
          <TabsList className="bg-transparent p-0 gap-0 h-auto">
            {(['redes', 'emails', 'phones', 'data'] as const).map(tab => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 text-sm font-medium text-gray-500 data-[state=active]:text-gray-900"
              >
                <TabLabel
                  label={tab === 'redes' ? 'Redes' : tab === 'emails' ? 'Emails' : tab === 'phones' ? 'Teléfonos' : 'Datos web'}
                  count={counts[tab]}
                />
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Redes */}
        <TabsContent value="redes" className="m-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Red</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Perfil</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Fuente</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {socials.length === 0 ? <EmptyRow cols={4} /> : socials.map(s => (
                <tr key={s.network} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-medium text-gray-700">
                    {NETWORK_ICONS[s.network] ?? '🔗'} {s.network}
                  </td>
                  <td className="px-4 py-2.5">
                    <a href={s.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline truncate max-w-xs">
                      {s.username ?? s.url}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">{s.source}</td>
                  <td className="px-4 py-2.5">
                    {s.verified
                      ? <Badge variant="default" className="text-xs">verificado</Badge>
                      : <Badge variant="secondary" className="text-xs">sin verificar</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        {/* Emails */}
        <TabsContent value="emails" className="m-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Email</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Fuente</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Script</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {emails.length === 0 ? <EmptyRow cols={4} /> : emails.map(e => (
                <tr key={e.email} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-mono text-gray-800">
                    <span className="flex items-center gap-2">
                      {e.email}
                      {e.is_primary && <Badge variant="outline" className="text-xs">principal</Badge>}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">{e.source}</td>
                  <td className="px-4 py-2.5 text-gray-500">{e.found_at_step}</td>
                  <td className="px-4 py-2.5">
                    {e.verified
                      ? <Badge variant="default" className="text-xs">verificado</Badge>
                      : <Badge variant="secondary" className="text-xs">sin verificar</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        {/* Teléfonos */}
        <TabsContent value="phones" className="m-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Teléfono</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Tipo</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Fuente</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {phones.length === 0 ? <EmptyRow cols={4} /> : phones.map(p => (
                <tr key={p.phone} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-mono text-gray-800">
                    <span className="flex items-center gap-2">
                      {p.phone}
                      {p.is_primary && <Badge variant="outline" className="text-xs">principal</Badge>}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">{p.type}</td>
                  <td className="px-4 py-2.5 text-gray-500">{p.source}</td>
                  <td className="px-4 py-2.5">
                    {p.verified
                      ? <Badge variant="default" className="text-xs">verificado</Badge>
                      : <Badge variant="secondary" className="text-xs">sin verificar</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        {/* Datos web */}
        <TabsContent value="data" className="m-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Módulo</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Clave</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Valor</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Fuente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {businessData.length === 0 ? <EmptyRow cols={4} /> : businessData.map(d => (
                <tr key={`${d.module}-${d.key}`} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5">
                    <Badge variant="secondary" className="text-xs font-mono">{d.module}</Badge>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-gray-700">{d.key}</td>
                  <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">
                    {d.value_type === 'url'
                      ? <a href={d.value} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:underline flex items-center gap-1">
                           {d.value} <ExternalLink className="h-3 w-3 shrink-0" />
                         </a>
                      : d.value_type === 'boolean'
                        ? <Badge variant={d.value === 'true' ? 'default' : 'secondary'} className="text-xs">
                            {d.value}
                          </Badge>
                        : <span className="font-mono">{d.value}</span>
                    }
                  </td>
                  <td className="px-4 py-2.5 text-gray-400 text-xs">{d.found_at_step}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>
      </Tabs>
    </div>
  )
}
