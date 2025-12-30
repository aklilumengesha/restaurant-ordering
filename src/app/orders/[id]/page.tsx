import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { StatusBadge } from '@/components/status-badge'
import ClientControls from './status-client'

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Order</h1>
        <p>Please sign in to view your order.</p>
        <Link href="/signin" className="text-brand">Sign in</Link>
      </div>
    )
  }

  const order = await prisma.order.findFirst({
    where: { id: params.id, user: { email: session.user.email } },
    include: { items: { include: { menuItem: true } } },
  })
  if (!order) return <div>Order not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Order #{order.id.slice(0, 6)}</h1>
        <StatusBadge status={order.status as any} />
      </div>
      <div className="border rounded p-4 space-y-2">
        {order.items.map((it) => (
          <div key={it.id} className="flex justify-between text-sm">
            <div>
              <div className="font-medium">{it.menuItem.name}</div>
              <div className="text-gray-500">Qty {it.quantity}</div>
            </div>
            <div>${(Number(it.unitPrice) * it.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="text-right font-semibold text-lg">Total ${Number(order.total).toFixed(2)}</div>
      <ClientControls orderId={order.id} status={order.status} items={order.items.map(i => ({ id: i.menuItemId, name: i.menuItem.name, price: Number(i.unitPrice), quantity: i.quantity }))} />
      <Link href="/orders" className="text-brand">Back to orders</Link>
    </div>
  )
}
