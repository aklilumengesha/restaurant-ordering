import { prisma } from '@/lib/prisma'
import OrdersControls from './status-client'

export const dynamic = 'force-dynamic'

export default async function OrdersAdminPage() {
  const orders = await prisma.order.findMany({ include: { items: { include: { menuItem: true } }, user: true }, orderBy: { createdAt: 'desc' } })
  const staff = await prisma.user.findMany({ where: { role: { in: ['ADMIN', 'STAFF'] } }, orderBy: { name: 'asc' } })
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orders Management</h1>
      </div>
      <OrdersControls orders={orders} staff={staff} />
    </div>
  )
}
