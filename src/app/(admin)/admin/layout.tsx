import { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/sidebar'

import { AdminAlerts } from '@/components/admin/alerts-client'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2">
        <AdminSidebar />
      </aside>
      <section className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">{children}</section>
      <AdminAlerts />
    </div>
  )
}
