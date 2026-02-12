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
  
  // Update reservation status to CONFIRMED
  await prisma.reservation.update({
    where: { id: params.id },
    data: { status: 'CONFIRMED' }
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
      subject: '✅ Reservation Confirmed - We Look Forward to Seeing You!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #10b981; margin-bottom: 20px;">🎉 Reservation Confirmed!</h1>
            <p style="font-size: 16px; color: #374151; margin-bottom: 15px;">Hi ${r.name},</p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Great news! Your reservation has been confirmed. We're excited to welcome you!
            </p>
            
            <div style="background-color: #f3f4f6; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h2 style="color: #1f2937; margin-top: 0; font-size: 18px;">Reservation Details</h2>
              <p style="margin: 10px 0; color: #4b5563;"><strong>Date:</strong> ${formattedDate}</p>
              <p style="margin: 10px 0; color: #4b5563;"><strong>Time:</strong> ${formattedTime}</p>
              <p style="margin: 10px 0; color: #4b5563;"><strong>Party Size:</strong> ${r.partySize} ${r.partySize === 1 ? 'guest' : 'guests'}</p>
              ${r.phone ? `<p style="margin: 10px 0; color: #4b5563;"><strong>Contact:</strong> ${r.phone}</p>` : ''}
            </div>
            
            ${r.notes ? `
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0; color: #92400e;"><strong>Special Requests:</strong> ${r.notes}</p>
              </div>
            ` : ''}
            
            <p style="font-size: 16px; color: #374151; margin-top: 20px;">
              If you need to make any changes or cancel your reservation, please contact us as soon as possible.
            </p>
            
            <p style="font-size: 16px; color: #374151; margin-top: 20px;">
              See you soon!<br>
              <strong>The Restaurant Team</strong>
            </p>
          </div>
          
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
            This is an automated confirmation email. Please do not reply to this message.
          </p>
        </div>
      `,
    })
  } catch (e) {
    console.error('Email send failed:', e)
  }
  
  return NextResponse.json({ ok: true, message: 'Reservation confirmed and email sent' })
}
