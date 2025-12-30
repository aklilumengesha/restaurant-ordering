import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlots, parseTimeToDate, overlaps } from '@/lib/reservations'
import { sendReservationEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const dateISO = searchParams.get('date')
  const me = searchParams.get('me') === '1'
  const where: any = {}
  if (dateISO) {
    const dayStart = new Date(dateISO + 'T00:00:00')
    const dayEnd = new Date(dateISO + 'T23:59:59')
    where.startTime = { gte: dayStart }
    where.endTime = { lte: dayEnd }
  }
  if (me) {
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })
    const u = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!u) return new NextResponse('Unauthorized', { status: 401 })
    where.userId = u.id
  }
  const reservations = await prisma.reservation.findMany({ where, orderBy: { startTime: 'asc' } })
  return NextResponse.json(reservations)
}

export async function POST(req: NextRequest) {
  const { getServerSession } = await import('next-auth')
  const { authOptions } = await import('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })
  const body = await req.json()
  const { name, email, phone, partySize, notes, date, time, durationMinutes = Number(process.env.RES_SLOT_MINUTES ?? '30') } = body
  if (!name || !email || !partySize || !date || !time) return new NextResponse('Missing fields', { status: 400 })

  const start = parseTimeToDate(date, time)
  const end = new Date(start.getTime() + Number(durationMinutes) * 60000)

  // business rule: only allow slots within generated hours
  const slots = generateSlots(date)
  if (!slots.includes(time)) return new NextResponse('Invalid slot', { status: 400 })

  // overlap validation with capacity
  const capacity = Number(process.env.RES_CAPACITY ?? '1')
  const dayStart = new Date(date + 'T00:00:00')
  const dayEnd = new Date(date + 'T23:59:59')
  const existing = await prisma.reservation.findMany({ where: { startTime: { gte: dayStart }, endTime: { lte: dayEnd } } })
  const overlappingCount = existing.filter((r) => overlaps(start, end, r.startTime, r.endTime)).length
  if (overlappingCount >= capacity) return new NextResponse('Slot unavailable', { status: 409 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  const created = await prisma.reservation.create({
    data: { name, email, phone, partySize, notes, startTime: start, endTime: end, userId: user?.id ?? null },
  })

  // send confirmation email (best-effort)
  try {
    await sendReservationEmail({
      to: email,
      subject: 'Reservation confirmed',
      html: `<p>Hi ${name},</p><p>Your reservation for ${partySize} on ${date} at ${time} is confirmed.</p>`,
    })
  } catch (e) {
    console.warn('Email send failed', e)
  }

  return NextResponse.json(created, { status: 201 })
}
