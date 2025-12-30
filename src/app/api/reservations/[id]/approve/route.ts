import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendReservationEmail } from '@/lib/email'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { getServerSession } = await import('next-auth')
  const { authOptions } = await import('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session || !['ADMIN','STAFF'].includes((session.user as any)?.role)) return new NextResponse('Forbidden', { status: 403 })

  const r = await prisma.reservation.findUnique({ where: { id: params.id } })
  if (!r) return new NextResponse('Not found', { status: 404 })
  try {
    await sendReservationEmail({
      to: r.email,
      subject: 'Reservation approved',
      html: `<p>Hi ${r.name},</p><p>Your reservation for ${r.partySize} on ${new Date(r.startTime).toLocaleDateString()} at ${new Date(r.startTime).toLocaleTimeString()} is approved. See you soon!</p>`,
    })
  } catch (e) {
    console.warn('Email send failed', e)
  }
  // no DB status tracked yet
  return NextResponse.json({ ok: true })
}
