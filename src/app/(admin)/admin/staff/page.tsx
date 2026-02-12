import { prisma } from '@/lib/prisma'
import StaffClient from './staff-client'

export const dynamic = 'force-dynamic'

export default async function StaffManagementPage() {
  const staff = await prisma.user.findMany({ where: { role: { in: ['ADMIN','STAFF'] } }, orderBy: { name: 'asc' } })
  const openOrders = await prisma.order.findMany({ where: { status: { in: ['PENDING','PREPARING','READY'] } }, include: { user: true, items: { include: { menuItem: true } } }, orderBy: { createdAt: 'desc' } })
  const upcomingReservations = await prisma.reservation.findMany({ where: { startTime: { gte: new Date() } }, orderBy: { startTime: 'asc' } })
  const shifts = await prisma.shift.findMany({ include: { user: true }, orderBy: { startTime: 'asc' } })

  // Performance (simple): delivered orders per staff in last 30 days; reservations handled in last 30 days
  const since = new Date(); since.setDate(since.getDate() - 30)
  const perfOrders = await prisma.order.groupBy({ where: { updatedAt: { gte: since }, status: 'DELIVERED', assignedToId: { not: null } }, by: ['assignedToId'], _count: { _all: true } })
  const perfRes = await prisma.reservation.groupBy({ where: { startTime: { gte: since }, assignedToId: { not: null } }, by: ['assignedToId'], _count: { _all: true } })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Staff Management</h1>
      </div>
      <StaffClient staff={staff} openOrders={openOrders} upcomingReservations={upcomingReservations} shifts={shifts} perfOrders={perfOrders} perfRes={perfRes} />
    </div>
  )
}
