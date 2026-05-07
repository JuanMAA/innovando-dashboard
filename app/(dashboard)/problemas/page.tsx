import { createAdminClient } from '@/lib/supabase/admin'
import TablaProblemas from '@/components/problemas/TablaProblemas'
import type { IssueReport } from '@/types'

export const revalidate = 0

export default async function ProblemasPage() {
  const supabase = createAdminClient()

  const { data: issues } = await supabase
    .from('issue_reports')
    .select('*, businesses(name, city, country, slug)')
    .order('reported_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Problemas reportados</h1>
      <TablaProblemas issues={(issues ?? []) as IssueReport[]} />
    </div>
  )
}
