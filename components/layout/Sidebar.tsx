'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MapPin, Users, AlertTriangle, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Inicio', icon: LayoutDashboard },
  { href: '/ciudades', label: 'Ciudades', icon: MapPin },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/problemas', label: 'Problemas', icon: AlertTriangle },
  { href: '/apis', label: 'APIs', icon: Activity },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex flex-col">
      <div className="h-12 flex items-center px-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <img src="/logo-innovando.png" alt="Innovando" className="h-7 w-auto" />
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
              pathname === href
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
