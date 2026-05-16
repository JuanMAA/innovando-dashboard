'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { ThemeToggle } from '@/components/theme-toggle'

interface TopbarProps {
  userEmail: string
}

export default function Topbar({ userEmail }: TopbarProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-12 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-4">
      <div />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <span className="text-sm text-slate-600 dark:text-slate-300">{userEmail}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
