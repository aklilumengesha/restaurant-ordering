import nodemailer from 'nodemailer'

export async function sendReservationEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.FROM_EMAIL || 'noreply@example.com'

  if (!host || !user || !pass) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('SMTP not configured; skipping email send')
      return
    }
    throw new Error('SMTP not configured')
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  })

  try {
    const info = await transporter.sendMail({
      from: `"Restaurant" <${from}>`,
      to,
      subject,
      html
    })
    return info
  } catch (error: any) {
    console.error('Failed to send email:', error.message)
    throw error
  }
}
