import { prisma } from '@/lib/prisma'
import ReportsClient from './reports-client'

function startOfDay(date = new Date()) { const d = new Date(date); d.setHours(0,0,0,0); return d }
function fmtDay(d: Date) { return d.toISOString().slice(0,10) }
function monthKey(d: Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` }

export default async function ReportsAdminPage() {
  const now = new Date()
  const day30 = new Date(now); day30.setDate(day30.getDate() - 29); day30.setHours(0,0,0,0)
  const monthStart = new Date(now.getFullYear(), now.getMonth()-11, 1)

  const [orders, orderItems, reservations] = await Promise.all([
    prisma.order.findMany({ where: { NOT: { status: 'CANCELED' } }, select: { id: true, total: true, createdAt: true } }),
    prisma.orderItem.findMany({ select: { menuItemId: true, quantity: true }, }),
    prisma.reservation.findMany({ select: { id: true, startTime: true }, where: { startTime: { gte: day30 } } }),
  ])

  // Daily revenue last 30 days
  const dailyMap = new Map<string, number>()
  for (let i=0;i<30;i++){ const d=new Date(day30); d.setDate(d.getDate()+i); dailyMap.set(fmtDay(d), 0) }
  for (const o of orders) {
    const key = fmtDay(startOfDay(o.createdAt))
    if (dailyMap.has(key)) dailyMap.set(key, (dailyMap.get(key) || 0) + Number(o.total))
  }
  const daily = Array.from(dailyMap.entries()).map(([day,total])=>({ day, total }))

  // Monthly revenue last 12 months
  const monthlyMap = new Map<string, number>()
  for (let i=0;i<12;i++){ const d=new Date(monthStart.getFullYear(), monthStart.getMonth()+i, 1); monthlyMap.set(monthKey(d), 0) }
  for (const o of orders) {
    const k = monthKey(o.createdAt)
    if (monthlyMap.has(k)) monthlyMap.set(k, (monthlyMap.get(k) || 0) + Number(o.total))
  }
  const monthly = Array.from(monthlyMap.entries()).map(([month,total])=>({ month, total }))

  // Yearly revenue (all years present)
  const yearlyMap = new Map<string, number>()
  for (const o of orders) {
    const y = String(o.createdAt.getFullYear())
    yearlyMap.set(y, (yearlyMap.get(y) || 0) + Number(o.total))
  }
  const yearly = Array.from(yearlyMap.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([year,total])=>({ year, total }))

  // Menu performance
  const grouped = new Map<string, number>()
  for (const it of orderItems) grouped.set(it.menuItemId, (grouped.get(it.menuItemId) || 0) + it.quantity)
  const ids = Array.from(grouped.keys())
  const menu = await prisma.menuItem.findMany({ where: { id: { in: ids } }, select: { id: true, name: true } })
  const nameById = Object.fromEntries(menu.map(m=>[m.id, m.name])) as Record<string,string>
  const perf = Array.from(grouped.entries()).map(([id,q])=>({ id, name: nameById[id] || 'Unknown', quantity: q }))
  const bestSellers = [...perf].sort((a,b)=> b.quantity - a.quantity).slice(0,5)
  const leastOrdered = [...perf].sort((a,b)=> a.quantity - b.quantity).slice(0,5)

  // Reservation trends (last 30 days)
  const resMap = new Map<string, number>()
  for (let i=0;i<30;i++){ const d=new Date(day30); d.setDate(d.getDate()+i); resMap.set(fmtDay(d), 0) }
  for (const r of reservations) {
    const k = fmtDay(startOfDay(r.startTime))
    if (resMap.has(k)) resMap.set(k, (resMap.get(k) || 0) + 1)
  }
  const reservationsTrend = Array.from(resMap.entries()).map(([day, count])=>({ day, count }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Reports</h1>
      </div>
      <ReportsClient daily={daily} monthly={monthly} yearly={yearly} bestSellers={bestSellers} leastOrdered={leastOrdered} reservations={reservationsTrend} />
    </div>
  )
}
