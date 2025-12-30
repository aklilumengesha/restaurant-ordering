import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import StaffDashboardClient from './staff-dashboard-client'

export default async function StaffPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'STAFF') {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
        <p>Only staff can access this page.</p>
        <a className="text-brand" href="/signin?callbackUrl=/staff">Sign in</a>
      </div>
    ) as any
  }

  const userId = (session.user as any)?.id
  const orders = await prisma.order.findMany({ where: { status: { in: ['PENDING','PREPARING','READY'] } }, include: { items: { include: { menuItem: true } }, user: true }, orderBy: { createdAt: 'desc' } })
  const reservations = await prisma.reservation.findMany({ where: { startTime: { gte: new Date() } }, orderBy: { startTime: 'asc' } })
  
  // Fetch shifts assigned to this staff member
  let myShifts: any[] = []
  try {
    myShifts = await (prisma as any).shift.findMany({ 
      where: { userId }, 
      orderBy: { startTime: 'asc' } 
    })
  } catch (e) {
    // Shift table might not exist yet
  }

  // @ts-expect-error Server Component to Client Component
  return <StaffDashboardClient initialOrders={orders} initialReservations={reservations} myShifts={myShifts} />
}
