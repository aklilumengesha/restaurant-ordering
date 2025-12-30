import { prisma } from '@/lib/prisma'
import { sendReservationEmail } from '@/lib/email'

// Optional Twilio SMS
let twilioClient: any = null
function getTwilio() {
  try {
    const sid = process.env.TWILIO_ACCOUNT_SID
    const token = process.env.TWILIO_AUTH_TOKEN
    if (!sid || !token) return null
    if (!twilioClient) twilioClient = require('twilio')(sid, token)
    return twilioClient
  } catch {
    return null
  }
}

export async function createNotification(params: { type: string; title: string; message?: string; severity?: 'info'|'warning'|'error'; metadata?: any }) {
  const { type, title, message, severity = 'info', metadata } = params
  try {
    await prisma.notification.create({ data: { type, title, message, severity, metadata } })
  } catch (e) {
    console.warn('Failed to store notification', e)
  }
}

export async function notifyNewOrder(orderId: string) {
  await createNotification({ type: 'NEW_ORDER', title: 'New order received', message: `Order #${orderId.slice(0,6)} received` })
  const adminEmail = process.env.ADMIN_EMAIL
  if (adminEmail) {
    try { await sendReservationEmail({ to: adminEmail, subject: 'New order', html: `<p>New order received: ${orderId}</p>` }) } catch {}
  }
}

export async function notifyNewReservation(reservationId: string) {
  await createNotification({ type: 'NEW_RESERVATION', title: 'New reservation request', message: `Reservation ${reservationId} created` })
  const adminEmail = process.env.ADMIN_EMAIL
  if (adminEmail) {
    try { await sendReservationEmail({ to: adminEmail, subject: 'New reservation', html: `<p>New reservation: ${reservationId}</p>` }) } catch {}
  }
}

export async function notifyError(title: string, message?: string, metadata?: any) {
  await createNotification({ type: 'ERROR', title, message, severity: 'error', metadata })
}

export async function sendSMS(to: string, body: string) {
  const from = process.env.TWILIO_FROM
  const client = getTwilio()
  if (!client || !from) return
  try { await client.messages.create({ to, from, body }) } catch (e) { console.warn('SMS send failed', e) }
}
