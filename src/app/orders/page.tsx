import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { StatusBadge } from '@/components/status-badge'
import { Package, ArrowRight, ShoppingBag } from 'lucide-react'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">View Your Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Sign in to see your order history and track deliveries.</p>
          <Link href="/signin?callbackUrl=/orders" className="btn-primary inline-flex items-center gap-2">
            Sign in to continue
          </Link>
        </div>
      </div>
    )
  }
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return null
  
  const orders = await prisma.order.findMany({ 
    where: { userId: user.id }, 
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { menuItem: true } } }
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="section-title">Your Orders</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Start exploring our menu and place your first order!</p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="card p-6 card-hover">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Order #{o.id.slice(0, 8)}</h3>
                      <StatusBadge status={o.status as any} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {o.items.length} item{o.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-xl font-bold gradient-text">${Number(o.total).toFixed(2)}</p>
                  </div>
                  <Link 
                    href={`/orders/${o.id}`} 
                    className="btn-secondary flex items-center gap-2"
                  >
                    View
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
