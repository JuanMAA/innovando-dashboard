import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import DetalleProblema from '@/components/problemas/DetalleProblema'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import type { IssueReport } from '@/types'

export const revalidate = 0

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProblemaDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: issue } = await supabase
    .from('issue_reports')
    .select('*, businesses(name, city, country, slug)')
    .eq('id', id)
    .single()

  if (!issue) notFound()

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Link href="/problemas" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'self-start')}>
        <ArrowLeft className="h-4 w-4 mr-1" />Volver
      </Link>
      <DetalleProblema issue={issue as IssueReport} />
    </div>
  )
}
