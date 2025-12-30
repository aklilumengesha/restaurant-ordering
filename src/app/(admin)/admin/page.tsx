import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/guard'
import { Decimal } from '@prisma/client/runtime/library'
import { DollarSign, Users, Calendar, UtensilsCrossed, TrendingUp, TrendingDown, Package } from 'lucide-react'

function toNumber(d: unknown) {
  if (d instanceof Decimal) return Number(d)
  if (typeof d === 'string') return Number(d)
  if (typeof d === 'number') return d
  return 0
}

function startOfDay(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function fmtDay(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default async function AdminDashboard() {
  await requireAdmin()

  const now = new Date()
  const today = startOfDay(now)
  const sevenDaysAgo = addDays(today, -6) // inclusive 7 days window
  const thirtyDaysAgo = addDays(today, -29)

  // Fetch order data for summaries (exclude canceled)
  const [recentOrders, totalOrdersAgg, topItemsAgg, activeUsersOrders, recentReservations, counts] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo }, NOT: { status: 'CANCELED' } },
      select: { id: true, total: true, createdAt: true, userId: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.order.aggregate({
      where: { NOT: { status: 'CANCELED' } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.orderItem.groupBy({
      by: ['menuItemId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: addDays(today, -7) }, NOT: { status: 'CANCELED' } },
      distinct: ['userId'],
      select: { userId: true },
    }),
    prisma.reservation.findMany({
      where: { startTime: { gte: today } },
      select: { id: true, startTime: true },
    }),
    Promise.all([
      prisma.menuItem.count(),
      prisma.user.count(),
    ]),
  ])

  const [menuCount, usersCount] = counts

  // Daily totals for last 7 days and 30 days
  const days: string[] = []
  for (let i = 0; i < 7; i++) days.push(fmtDay(addDays(today, -6 + i)))

  const dailyTotals: Record<string, number> = {}
  for (let i = 0; i < 30; i++) {
    dailyTotals[fmtDay(addDays(today, -29 + i))] = 0
  }
  for (const o of recentOrders) {
    const key = fmtDay(startOfDay(o.createdAt))
    dailyTotals[key] = (dailyTotals[key] ?? 0) + toNumber(o.total)
  }

  const last7Days = days.map((d) => ({ day: d, total: dailyTotals[d] ?? 0 }))

  // Weekly summary: this week vs last week totals
  const thisWeekStart = addDays(today, -today.getDay()) // Sunday as start
  const lastWeekStart = addDays(thisWeekStart, -7)
  const lastWeekEnd = addDays(thisWeekStart, -1)

  let thisWeekTotal = 0
  let lastWeekTotal = 0
  for (const o of recentOrders) {
    const created = o.createdAt
    const amount = toNumber(o.total)
    if (created >= thisWeekStart) thisWeekTotal += amount
    else if (created >= lastWeekStart && created <= lastWeekEnd) lastWeekTotal += amount
  }

  // Top-selling menu items: fetch names
  const topIds = topItemsAgg.map((t) => t.menuItemId)
  const topMenu = await prisma.menuItem.findMany({ where: { id: { in: topIds } }, select: { id: true, name: true, price: true } })
  const topLabelById = Object.fromEntries(topMenu.map((m) => [m.id, m.name])) as Record<string, string>
  const topSelling = topItemsAgg.map((t) => ({
    id: t.menuItemId,
    name: topLabelById[t.menuItemId] ?? 'Unknown',
    quantity: t._sum.quantity ?? 0,
  }))

  // Active users (past 7 days having orders) and active reservations (future)
  const activeUsersCount = activeUsersOrders.length
  const activeReservationsCount = recentReservations.length

  // Revenue breakdown
  const ordersRevenue = toNumber(totalOrdersAgg._sum.total ?? 0)
  const reservationsRevenue = 0 // Not modeled in schema; keep as 0
  const deliveryFees = 0 // Not modeled in schema; keep as 0
  const totalRevenue = ordersRevenue + reservationsRevenue + deliveryFees

  // Calculate week-over-week change
  const weekChange = lastWeekTotal > 0 ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100 : 0
  const isPositiveChange = weekChange >= 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your restaurant performance</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl">
          Last updated: {now.toLocaleString()}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">${ordersRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">From all orders</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{activeUsersCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 7 days</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reservations</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{activeReservationsCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Upcoming</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Menu Items</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{menuCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total dishes</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Sales summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Sales</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last 7 days performance</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              isPositiveChange 
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {isPositiveChange ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(weekChange).toFixed(1)}% vs last week
            </div>
          </div>
          <div className="space-y-3">
            {last7Days.map(({ day, total }) => {
              const maxTotal = Math.max(...last7Days.map(d => d.total), 1)
              const percentage = (total / maxTotal) * 100
              return (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {new Date(day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-24 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    ${total.toFixed(2)}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">This week total</span>
            <span className="text-xl font-bold gradient-text">${thisWeekTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Orders</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">${ordersRevenue.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reservations</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">${reservationsRevenue.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex justify-between items-center">
              <span className="font-semibold text-gray-900 dark:text-white">Total Revenue</span>
              <span className="text-2xl font-bold gradient-text">${totalRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top-selling items */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Selling Items</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Best performing menu items</p>
          </div>
        </div>
        {topSelling.length === 0 ? (
          <div className="text-center py-8">
            <UtensilsCrossed className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No sales data yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topSelling.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                  idx === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500' :
                  idx === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                  idx === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700' :
                  'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{item.quantity} sold</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
