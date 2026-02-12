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
  
  // Update reservation status to REJECTED
  await prisma.reservation.update({
    where: { id: params.id },
    data: { status: 'REJECTED' } as any
  })
  
  try {
    const startDate = new Date(r.startTime)
    const formattedDate = startDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    const formattedTime = startDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    
    await sendReservationEmail({
      to: r.email,
      subject: 'Reservation Update - Unable to Accommodate',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #ef4444; margin-bottom: 20px;">Reservation Update</h1>
            <p style="font-size: 16px; color: #374151; margin-bottom: 15px;">Hi ${r.name},</p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              We sincerely apologize, but we are unable to accommodate your reservation request at this time.
            </p>
            
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h2 style="color: #1f2937; margin-top: 0; font-size: 18px;">Requested Reservation</h2>
              <p style="margin: 10px 0; color: #4b5563;"><strong>Date:</strong> ${formattedDate}</p>
              <p style="margin: 10px 0; color: #4b5563;"><strong>Time:</strong> ${formattedTime}</p>
              <p style="margin: 10px 0; color: #4b5563;"><strong>Party Size:</strong> ${r.partySize} ${r.partySize === 1 ? 'guest' : 'guests'}</p>
            </div>
            
            <p style="font-size: 16px; color: #374151; margin-top: 20px;">
              This may be due to capacity constraints or scheduling conflicts. We encourage you to:
            </p>
            <ul style="color: #374151; font-size: 16px;">
              <li>Try a different date or time</li>
              <li>Contact us directly for alternative options</li>
              <li>Check our availability for smaller party sizes</li>
            </ul>
            
            <p style="font-size: 16px; color: #374151; margin-top: 20px;">
              We appreciate your understanding and hope to serve you soon!<br>
              <strong>The Restaurant Team</strong>
            </p>
          </div>
          
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
            This is an automated notification email. Please do not reply to this message.
          </p>
        </div>
      `,
    })
  } catch (e) {
    console.error('Email send failed:', e)
  }
  
  return NextResponse.json({ ok: true, message: 'Reservation rejected and email sent' })
}
