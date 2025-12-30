import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlots, parseTimeToDate, overlaps } from '@/lib/reservations'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const dateISO = searchParams.get('date')
  if (!dateISO) return new NextResponse('Missing date', { status: 400 })

  const slots = generateSlots(dateISO)
  const dayStart = new Date(dateISO + 'T00:00:00')
  const dayEnd = new Date(dateISO + 'T23:59:59')
  const reservations = await prisma.reservation.findMany({
    where: { startTime: { gte: dayStart }, endTime: { lte: dayEnd } },
    select: { startTime: true, endTime: true },
  })

  const capacity = Number(process.env.RES_CAPACITY ?? '1')
  const unavailable = new Set<string>()
  const counts: Record<string, number> = {}
  for (const slot of slots) {
    const start = parseTimeToDate(dateISO, slot)
    const end = new Date(start.getTime() + Number(process.env.RES_SLOT_MINUTES ?? '30') * 60000)
    const count = reservations.filter((r) => overlaps(start, end, r.startTime, r.endTime)).length
    counts[slot] = count
    if (count >= capacity) {
      unavailable.add(slot)
    }
  }

  return NextResponse.json({ date: dateISO, slots, unavailable: Array.from(unavailable), counts, capacity })
}
